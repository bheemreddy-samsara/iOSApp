import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  createBottomTabNavigator,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import { useMemo } from 'react';
import { HomeScreen } from '@/screens/HomeScreen';
import { CalendarScreen } from '@/screens/CalendarScreen';
import { NotificationsScreen } from '@/screens/NotificationsScreen';
import { MembersScreen } from '@/screens/MembersScreen';
import { IntegrationsScreen } from '@/screens/IntegrationsScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { OnboardingScreen } from '@/screens/OnboardingScreen';
import { EventEditorScreen } from '@/screens/EventEditorScreen';
import { AuthScreen } from '@/screens/AuthScreen';
import { PrivacyPolicyScreen } from '@/screens/PrivacyPolicyScreen';
import { TermsScreen } from '@/screens/TermsScreen';
import { colors } from '@/theme/tokens';
import { useAuthStore } from '@/state/authStore';
import { useSettingsStore } from '@/state/settingsStore';
import { Calendar } from 'lucide-react-native';
import { Home, Bell, Users, Settings } from 'lucide-react-native';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export type RootStackParamList = {
  Auth: undefined;
  Onboarding: undefined;
  MainTabs: undefined;
  Notifications: undefined;
  Members: undefined;
  Integrations: undefined;
  Settings: undefined;
  EventEditor: { eventId?: string } | undefined;
  PrivacyPolicy: undefined;
  Terms: undefined;
};

export type TabParamList = {
  Today: undefined;
  Calendar: undefined;
  Members: undefined;
  Settings: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.surface,
    primary: colors.primary,
    text: colors.textPrimary,
    border: colors.border,
    notification: colors.accent,
  },
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }: BottomTabScreenProps<TabParamList>) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 72,
          paddingBottom: 14,
          paddingTop: 12,
        },
        tabBarIcon: ({ color, size }: { color: string; size: number }) => {
          switch (route.name) {
            case 'Today':
              return <Home color={color} size={size} />;
            case 'Calendar':
              return <Calendar color={color} size={size} />;
            case 'Members':
              return <Users color={color} size={size} />;
            case 'Settings':
              return <Settings color={color} size={size} />;
            default:
              return <Home color={color} size={size} />;
          }
        },
      })}
    >
      <Tab.Screen name="Today" component={HomeScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Members" component={MembersScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const scheme = useColorScheme();
  const { session, member } = useAuthStore();
  const { hasCompletedOnboarding } = useSettingsStore();

  const isAuthenticated = Boolean(session);
  const hasOnboarded = hasCompletedOnboarding || Boolean(member);

  const theme = useMemo(() => AppTheme, [scheme]);

  // Determine which stack to show based on auth state
  // Using separate Groups prevents race conditions by not conditionally rendering screens
  const authState = isAuthenticated
    ? hasOnboarded
      ? 'authenticated'
      : 'onboarding'
    : 'unauthenticated';

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={theme}>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          {authState === 'unauthenticated' ? (
            // Auth Flow - shown when not authenticated
            <RootStack.Group>
              <RootStack.Screen name="Auth" component={AuthScreen} />
              <RootStack.Screen
                name="PrivacyPolicy"
                component={PrivacyPolicyScreen}
                options={{ presentation: 'modal' }}
              />
              <RootStack.Screen
                name="Terms"
                component={TermsScreen}
                options={{ presentation: 'modal' }}
              />
            </RootStack.Group>
          ) : authState === 'onboarding' ? (
            // Onboarding Flow - shown when authenticated but not onboarded
            <RootStack.Group>
              <RootStack.Screen name="Onboarding" component={OnboardingScreen} />
              <RootStack.Screen
                name="PrivacyPolicy"
                component={PrivacyPolicyScreen}
                options={{ presentation: 'modal' }}
              />
              <RootStack.Screen
                name="Terms"
                component={TermsScreen}
                options={{ presentation: 'modal' }}
              />
            </RootStack.Group>
          ) : (
            // Main App - shown when authenticated and onboarded
            <RootStack.Group>
              <RootStack.Screen name="MainTabs" component={MainTabs} />
              <RootStack.Screen
                name="Notifications"
                component={NotificationsScreen}
                options={{ presentation: 'modal' }}
              />
              <RootStack.Screen name="Members" component={MembersScreen} />
              <RootStack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ headerShown: true, title: 'Settings' }}
              />
              <RootStack.Screen
                name="Integrations"
                component={IntegrationsScreen}
                options={{
                  headerShown: true,
                  title: 'Integrations',
                  presentation: 'modal',
                }}
              />
              <RootStack.Screen
                name="EventEditor"
                component={EventEditorScreen}
                options={{
                  headerShown: true,
                  title: 'Plan Event',
                  presentation: 'fullScreenModal',
                }}
              />
              <RootStack.Screen
                name="PrivacyPolicy"
                component={PrivacyPolicyScreen}
                options={{ presentation: 'modal' }}
              />
              <RootStack.Screen
                name="Terms"
                component={TermsScreen}
                options={{ presentation: 'modal' }}
              />
            </RootStack.Group>
          )}
        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
