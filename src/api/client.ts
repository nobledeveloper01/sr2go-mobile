/**
 * The only place in the app that talks HTTP.
 *
 * Everything else calls a named function in `endpoints.ts`, so a change to
 * headers, error handling or the base URL happens once. Screens never see
 * fetch, a status code, or a token.
 */

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'https://shareride2go.com';

/**
 * Thirty seconds, which is longer than it looks like it should be.
 *
 * A cold login against this API measured 9.7 seconds from Lagos. The usual
 * 10 second default would turn a slow but successful request into a failure
 * the user cannot do anything about, so the timeout is set well clear of the
 * real worst case and the UI carries the waiting instead.
 */
const TIMEOUT_MS = 30_000;

/** What a screen is allowed to know about a failure. */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    /** Field name to message, when the server rejected specific fields. */
    readonly fieldErrors?: Record<string, string>,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** FastAPI's 422 body: a list of per field problems. */
interface ValidationDetail {
  loc: (string | number)[];
  msg: string;
  type: string;
}

const isValidationBody = (body: unknown): body is { detail: ValidationDetail[] } =>
  typeof body === 'object' &&
  body !== null &&
  Array.isArray((body as { detail?: unknown }).detail);

/**
 * Turns whatever the server said into one message, and a per field map when
 * there is one. Without this every screen ends up writing its own version of
 * "is detail a string or an array this time".
 */
const toApiError = (status: number, body: unknown): ApiError => {
  if (isValidationBody(body)) {
    const fieldErrors: Record<string, string> = {};

    for (const item of body.detail) {
      const field = item.loc.filter((part) => part !== 'body').join('.');
      if (field) fieldErrors[field] = item.msg;
    }

    const first = Object.values(fieldErrors)[0];
    return new ApiError(first ?? 'Please check the details you entered.', status, fieldErrors);
  }

  const detail = (body as { detail?: unknown })?.detail;
  if (typeof detail === 'string') return new ApiError(detail, status);

  // Never surface a raw status code to a user. They cannot act on "500".
  if (status >= 500) {
    return new ApiError('Something went wrong on our side. Please try again.', status);
  }

  return new ApiError('Something went wrong. Please try again.', status);
};

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  /** Bearer token, when the endpoint needs one. */
  token?: string;
  signal?: AbortSignal;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token, signal } = options;

  // Our own timeout, linked to any caller signal, so a screen that unmounts
  // mid request cancels it instead of setting state on a dead component.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  signal?.addEventListener('abort', () => controller.abort());

  let response: Response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...(token === undefined ? {} : { Authorization: `Bearer ${token}` }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (error) {
    clearTimeout(timeout);

    // An abort here is either our timeout or the caller leaving. Both read to
    // the user as "the network did not answer", which is what they can act on.
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('The server took too long to respond. Please try again.', 0);
    }

    throw new ApiError('No connection. Check your network and try again.', 0);
  }

  clearTimeout(timeout);

  const text = await response.text();
  const parsed: unknown = text.length > 0 ? JSON.parse(text) : null;

  if (!response.ok) throw toApiError(response.status, parsed);

  return parsed as T;
}
