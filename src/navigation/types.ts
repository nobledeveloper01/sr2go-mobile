/** Route names and their params, so navigation is checked at compile time. */
export type AuthStackParams = {
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

export type AppTabsParams = {
  HomeStack: undefined;
  Trips: undefined;
  Wallet: undefined;
  Profile: undefined;
};

/** The stack inside the Home tab, so a trip opens over the dashboard. */
export type HomeStackParams = {
  Dashboard: undefined;
  TripDetail: { tripId: string };
};
