/**
 * Placeholder content for the dashboard.
 *
 * The brief covers authentication only, and the trip endpoints were not part
 * of it, so these stand in for the real feed. Kept in one file, shaped the way
 * a trips endpoint would return it, so swapping in the live call later is a
 * change to one import rather than a rewrite of the screen.
 */

export interface Trip {
  id: string;
  from: string;
  to: string;
  departsAt: string;
  seatsLeft: number;
  farePerSeat: number;
  driverName: string;
  driverRating: number;
  vehicle: string;
  verified: boolean;
}

const inHours = (hours: number): string =>
  new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();

export const upcomingTrips: Trip[] = [
  {
    id: 'TRP-4821', from: 'Lagos', to: 'Ibadan', departsAt: inHours(3),
    seatsLeft: 2, farePerSeat: 12_500, driverName: 'Chinedu Okafor',
    driverRating: 4.9, vehicle: 'Toyota Corolla', verified: true,
  },
  {
    id: 'TRP-4822', from: 'Lagos', to: 'Abeokuta', departsAt: inHours(6),
    seatsLeft: 3, farePerSeat: 9_000, driverName: 'Aisha Bello',
    driverRating: 4.8, vehicle: 'Honda Accord', verified: true,
  },
  {
    id: 'TRP-4823', from: 'Abuja', to: 'Kaduna', departsAt: inHours(26),
    seatsLeft: 1, farePerSeat: 15_000, driverName: 'Tunde Adeyemi',
    driverRating: 5.0, vehicle: 'Toyota Highlander', verified: true,
  },
  {
    id: 'TRP-4824', from: 'Lagos', to: 'Benin City', departsAt: inHours(30),
    seatsLeft: 4, farePerSeat: 18_500, driverName: 'Ngozi Eze',
    driverRating: 4.7, vehicle: 'Kia Sportage', verified: false,
  },
];

export const popularRoutes = [
  { id: 'R1', from: 'Lagos', to: 'Ibadan', fromPrice: 9_000 },
  { id: 'R2', from: 'Lagos', to: 'Abuja', fromPrice: 45_000 },
  { id: 'R3', from: 'Abuja', to: 'Kaduna', fromPrice: 12_000 },
  { id: 'R4', from: 'Lagos', to: 'Benin', fromPrice: 16_500 },
];

export const walletSummary = { balance: 24_500, tripsTaken: 12, co2SavedKg: 86 };
