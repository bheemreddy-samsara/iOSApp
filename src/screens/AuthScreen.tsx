import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing, radii } from '@/theme/tokens';
import { useAuthStore } from '@/state/authStore';
import { getSupabaseClient, isSupabaseConfigured } from '@/services/supabase';
import {
  Calendar,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Chrome,
  Apple,
} from 'lucide-react-native';
import { RootStackParamList } from '@/navigation';

// Lazy load Apple Authentication to avoid crashes on unsupported devices
let AppleAuthentication: typeof import('expo-apple-authentication') | null =
  null;
try {
  AppleAuthentication = require('expo-apple-authentication');
} catch {
  // Apple Authentication not available
}

type AuthMode = 'sign_in' | 'sign_up';

export function AuthScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [mode, setMode] = useState<AuthMode>('sign_in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAppleAuthAvailable, setIsAppleAuthAvailable] = useState(false);

  const setSession = useAuthStore((state) => state.setSession);

  useEffect(() => {
    // Check if Apple Auth is available
    if (AppleAuthentication) {
      AppleAuthentication.isAvailableAsync()
        .then(setIsAppleAuthAvailable)
        .catch(() => {
          setIsAppleAuthAvailable(false);
        });
    }
  }, []);

  const validateForm = (): boolean => {
    setError(null);

    if (!email.trim()) {
      setError('Please enter your email address');
      return false;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!password) {
      setError('Please enter your password');
      return false;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }

    if (mode === 'sign_up' && password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleAuth = async () => {
    if (!validateForm()) return;

    if (!isSupabaseConfigured()) {
      setError(
        'Authentication service not configured. Please contact support.',
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        throw new Error('Authentication service not available');
      }

      if (mode === 'sign_up') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });

        if (signUpError) throw signUpError;

        if (data.session) {
          setSession(data.session);
        } else {
          Alert.alert(
            'Check your email',
            'We sent you a confirmation link. Please check your inbox to verify your account.',
            [{ text: 'OK' }],
          );
        }
      } else {
        const { data, error: signInError } =
          await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });

        if (signInError) throw signInError;

        if (data.session) {
          setSession(data.session);
        }
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Authentication failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'sign_in' ? 'sign_up' : 'sign_in');
    setError(null);
    setPassword('');
    setConfirmPassword('');
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError('Please enter your email address first');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (!isSupabaseConfigured()) {
      setError('Password reset not available. Please contact support.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        throw new Error('Service not available');
      }

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: 'togethercal://reset-password',
        },
      );

      if (resetError) throw resetError;

      Alert.alert(
        'Check your email',
        'We sent you a password reset link. Please check your inbox.',
        [{ text: 'OK' }],
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to send reset email';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    Alert.alert(
      'Google Sign In',
      'Google sign-in requires OAuth configuration. Please set up your Google Cloud credentials first.',
      [{ text: 'OK' }],
    );
  };

  const handleOutlookAuth = () => {
    Alert.alert(
      'Outlook Sign In',
      'Outlook sign-in requires OAuth configuration. Please set up your Azure AD credentials first.',
      [{ text: 'OK' }],
    );
  };

  const handleAppleAuth = async () => {
    if (!AppleAuthentication || !isAppleAuthAvailable) {
      setError('Apple Sign In is not available on this device');
      return;
    }

    if (!isSupabaseConfigured()) {
      setError('Authentication service not configured');
      return;
    }

    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential.identityToken) {
        setLoading(true);
        const supabase = getSupabaseClient();
        if (!supabase) {
          throw new Error('Service not available');
        }

        const { data, error: signInError } =
          await supabase.auth.signInWithIdToken({
            provider: 'apple',
            token: credential.identityToken,
          });

        if (signInError) throw signInError;

        if (data.session) {
          setSession(data.session);
        }
      }
    } catch (err: unknown) {
      if (
        err &&
        typeof err === 'object' &&
        'code' in err &&
        err.code === 'ERR_REQUEST_CANCELED'
      ) {
        return;
      }
      const message =
        err instanceof Error ? err.message : 'Apple sign-in failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header} testID="auth-header">
          <View style={styles.logoContainer}>
            <Calendar color={colors.primary} size={48} />
          </View>
          <Text style={styles.title} testID="app-title">
            TogetherCal
          </Text>
          <Text style={styles.subtitle} testID="auth-subtitle">
            {mode === 'sign_in'
              ? 'Welcome back! Sign in to continue.'
              : 'Create an account to get started.'}
          </Text>
        </View>

        <View style={styles.form} testID="auth-form">
          {error && (
            <View style={styles.errorContainer} testID="error-container">
              <Text style={styles.errorText} testID="error-text">
                {error}
              </Text>
            </View>
          )}

          <View style={styles.inputContainer}>
            <Mail
              color={colors.textSecondary}
              size={20}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              accessibilityLabel="Email address"
              testID="email-input"
            />
          </View>

          <View style={styles.inputContainer}>
            <Lock
              color={colors.textSecondary}
              size={20}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoComplete={
                mode === 'sign_up' ? 'new-password' : 'current-password'
              }
              accessibilityLabel="Password"
              testID="password-input"
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
              accessibilityLabel={
                showPassword ? 'Hide password' : 'Show password'
              }
              accessibilityRole="button"
              testID="toggle-password-visibility"
            >
              {showPassword ? (
                <EyeOff color={colors.textSecondary} size={20} />
              ) : (
                <Eye color={colors.textSecondary} size={20} />
              )}
            </Pressable>
          </View>

          {mode === 'sign_in' && (
            <Pressable
              onPress={handleForgotPassword}
              style={styles.forgotPassword}
              accessibilityRole="button"
              testID="forgot-password-button"
            >
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </Pressable>
          )}

          {mode === 'sign_up' && (
            <View style={styles.inputContainer}>
              <Lock
                color={colors.textSecondary}
                size={20}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm password"
                placeholderTextColor={colors.textSecondary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
                autoComplete="new-password"
                accessibilityLabel="Confirm password"
                testID="confirm-password-input"
              />
            </View>
          )}

          <Pressable
            style={[
              styles.primaryButton,
              loading && styles.primaryButtonDisabled,
            ]}
            onPress={handleAuth}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel={
              mode === 'sign_in' ? 'Sign in' : 'Create account'
            }
            testID="auth-submit-button"
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText} testID="auth-submit-text">
                {mode === 'sign_in' ? 'Sign In' : 'Create Account'}
              </Text>
            )}
          </Pressable>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {isAppleAuthAvailable && AppleAuthentication ? (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={
                AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
              }
              buttonStyle={
                AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
              }
              cornerRadius={12}
              style={styles.appleButton}
              onPress={handleAppleAuth}
            />
          ) : (
            <Pressable
              style={styles.socialButton}
              onPress={handleAppleAuth}
              accessibilityRole="button"
              accessibilityLabel="Continue with Apple"
              testID="apple-signin-button"
            >
              <Apple color={colors.textPrimary} size={20} />
              <Text style={styles.socialButtonText}>Continue with Apple</Text>
            </Pressable>
          )}

          <Pressable
            style={styles.socialButton}
            onPress={handleGoogleAuth}
            accessibilityRole="button"
            accessibilityLabel="Continue with Google"
            testID="google-signin-button"
          >
            <Chrome color={colors.textPrimary} size={20} />
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </Pressable>

          <Pressable
            style={styles.socialButton}
            onPress={handleOutlookAuth}
            accessibilityRole="button"
            accessibilityLabel="Continue with Outlook"
            testID="outlook-signin-button"
          >
            <Mail color={colors.textPrimary} size={20} />
            <Text style={styles.socialButtonText}>Continue with Outlook</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={toggleMode}
            accessibilityRole="button"
            testID="toggle-mode-button"
          >
            <Text style={styles.secondaryButtonText} testID="toggle-mode-text">
              {mode === 'sign_in'
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </Text>
          </Pressable>
        </View>

        <Text style={styles.terms}>
          By continuing, you agree to our{' '}
          <Text
            style={styles.termsLink}
            onPress={() => navigation.navigate('Terms')}
          >
            Terms of Service
          </Text>{' '}
          and{' '}
          <Text
            style={styles.termsLink}
            onPress={() => navigation.navigate('PrivacyPolicy')}
          >
            Privacy Policy
          </Text>
          .
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing['3xl'],
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing['3xl'],
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    gap: spacing.md,
  },
  errorContainer: {
    backgroundColor: `${colors.danger}15`,
    borderRadius: radii.sm,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    height: 52,
    fontSize: 16,
    color: colors.textPrimary,
  },
  eyeButton: {
    padding: spacing.sm,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: radii.md,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginHorizontal: spacing.md,
  },
  secondaryButton: {
    alignItems: 'center',
    padding: spacing.md,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  terms: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing['3xl'],
    lineHeight: 18,
  },
  termsLink: {
    color: colors.primary,
    fontWeight: '600',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -spacing.sm,
  },
  forgotPasswordText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    height: 52,
  },
  socialButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  appleButton: {
    height: 52,
    width: '100%',
  },
});
