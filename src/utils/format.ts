/** Naira, grouped, no decimals. ₦12,500 rather than ₦12500.00. */
export const naira = (amount: number): string =>
  `₦${Math.round(amount).toLocaleString('en-NG')}`;

/** "Today, 14:30" or "Sat, 14:30", which is how people talk about departures. */
export const departure = (iso: string): string => {
  const date = new Date(iso);
  const today = new Date();
  const sameDay = date.toDateString() === today.toDateString();
  const time = date.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit', hour12: false });

  return sameDay ? `Today, ${time}` : `${date.toLocaleDateString('en-NG', { weekday: 'short' })}, ${time}`;
};
