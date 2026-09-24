import { Wallet } from 'lucide-react-native';

import { Placeholder } from '../components/Placeholder';
import { colors } from '../theme';

export function WalletScreen() {
  return (
    <Placeholder
      icon={<Wallet size={30} color={colors.brand} />}
      title="Wallet"
      body="Balance, payouts and payment methods belong here. Left as a placeholder because this task covered authentication only."
    />
  );
}
