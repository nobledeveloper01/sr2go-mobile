/**
 * Which half of the app you are in, decided by auth state alone.
 *
 * There is no navigate() call after signing in or out anywhere in this app.
 * The stack that is mounted is a function of `status`, so the signed in tree
 * does not exist while signed out and cannot be reached with a back gesture.
 */
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Route, User, Wallet } from 'lucide-react-native';
import { Platform, StyleSheet } from 'react-native';

import { useAuth } from '../context/AuthContext';
import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { TripDetailScreen } from '../screens/TripDetailScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SignInScreen } from '../screens/SignInScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { SplashScreen } from '../screens/SplashScreen';
import { TripsScreen } from '../screens/TripsScreen';
import { WalletScreen } from '../screens/WalletScreen';
import { colors, typography } from '../theme';
import type { AppTabsParams, AuthStackParams, HomeStackParams } from './types';

const AuthStack = createNativeStackNavigator<AuthStackParams>();
const Tabs = createBottomTabNavigator<AppTabsParams>();
const HomeStack = createNativeStackNavigator<HomeStackParams>();

/**
 * A stack inside the Home tab, so opening a trip pushes over the dashboard
 * and the tab bar stays put. Putting the detail screen at the tab level
 * instead would hide the tab bar and lose the user's place.
 */
function HomeNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Dashboard" component={HomeScreen} />
      <HomeStack.Screen name="TripDetail" component={TripDetailScreen} />
    </HomeStack.Navigator>
  );
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
  );
}

function AppNavigator() {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="HomeStack"
        component={HomeNavigator}
        options={{ title: 'Home', tabBarIcon: ({ color }) => <Home size={22} color={color} /> }}
      />
      <Tabs.Screen
        name="Trips"
        component={TripsScreen}
        options={{ tabBarIcon: ({ color }) => <Route size={22} color={color} /> }}
      />
      <Tabs.Screen
        name="Wallet"
        component={WalletScreen}
        options={{ tabBarIcon: ({ color }) => <Wallet size={22} color={color} /> }}
      />
      <Tabs.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: ({ color }) => <User size={22} color={color} /> }}
      />
    </Tabs.Navigator>
  );
}

export function RootNavigator() {
  const { status } = useAuth();

  // The splash is shown outside the container, because there is nothing to
  // navigate to until we know which tree to build.
  if (status === 'restoring') return <SplashScreen />;

  return (
    <NavigationContainer>
      {status === 'signedIn' ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    height: Platform.OS === 'ios' ? 88 : 64,
    paddingTop: 8,
  },
  tabLabel: { ...typography.caption, marginBottom: Platform.OS === 'ios' ? 0 : 8 },
});
