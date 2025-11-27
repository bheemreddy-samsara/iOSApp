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

  // Determine initial route based on auth state
  const getInitialRoute = (): keyof RootStackParamList => {
    if (!isAuthenticated) return 'Auth';
    if (!hasOnboarded) return 'Onboarding';
    return 'MainTabs';
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={theme}>
        <RootStack.Navigator initialRouteName={getInitialRoute()}>
          {/* Auth Flow */}
          {!isAuthenticated && (
            <RootStack.Screen
              name="Auth"
              component={AuthScreen}
              options={{ headerShown: false }}
            />
          )}

          {/* Onboarding */}
          {isAuthenticated && !hasOnboarded && (
            <RootStack.Screen
              name="Onboarding"
              component={OnboardingScreen}
              options={{ headerShown: false }}
            />
          )}

          {/* Main App */}
          <RootStack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="Notifications"
            component={NotificationsScreen}
            options={{ headerShown: false, presentation: 'modal' }}
          />
          <RootStack.Screen
            name="Members"
            component={MembersScreen}
            options={{ headerShown: false }}
          />
          <RootStack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ title: 'Settings' }}
          />
          <RootStack.Screen
            name="Integrations"
            component={IntegrationsScreen}
            options={{ title: 'Integrations', presentation: 'modal' }}
          />
          <RootStack.Screen
            name="EventEditor"
            component={EventEditorScreen}
            options={{ title: 'Plan Event', presentation: 'fullScreenModal' }}
          />

          {/* Legal Screens */}
          <RootStack.Screen
            name="PrivacyPolicy"
            component={PrivacyPolicyScreen}
            options={{ headerShown: false, presentation: 'modal' }}
          />
          <RootStack.Screen
            name="Terms"
            component={TermsScreen}
            options={{ headerShown: false, presentation: 'modal' }}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
