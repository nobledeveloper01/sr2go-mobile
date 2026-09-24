import { Route } from 'lucide-react-native';

import { Placeholder } from '../components/Placeholder';
import { colors } from '../theme';

export function TripsScreen() {
  return (
    <Placeholder
      icon={<Route size={30} color={colors.brand} />}
      title="Your trips"
      body="Booked and completed trips will appear here. The trip endpoints were outside the scope of this task, so this screen is intentionally left as a placeholder."
    />
  );
}
