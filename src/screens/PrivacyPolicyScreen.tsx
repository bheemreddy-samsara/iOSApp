import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing } from '@/theme/tokens';
import { ChevronLeft, ExternalLink } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function PrivacyPolicyScreen() {
  const navigation = useNavigation();

  const openExternalLink = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ChevronLeft color={colors.textPrimary} size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lastUpdated}>Last updated: November 2024</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.paragraph}>
            TogetherCal ("we", "our", or "us") is committed to protecting your
            privacy. This Privacy Policy explains how we collect, use, and
            safeguard your information when you use our family calendar
            application.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Information We Collect</Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Account Information:</Text> When you
            create an account, we collect your email address and encrypted
            password.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Calendar Data:</Text> Events you create,
            including titles, descriptions, dates, and attendees. We store this
            securely and never share it with third parties.
          </Text>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Calendar Integrations:</Text> If you
            connect external calendars (Google, Outlook), we only read calendar
            data with your explicit permission. Work calendar events are
            displayed as "Busy" blocks only—we never store or transmit private
            work event details.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How We Use Your Information</Text>
          <Text style={styles.bulletPoint}>
            • Display your family calendar and events
          </Text>
          <Text style={styles.bulletPoint}>
            • Send notifications you've enabled (reminders, approvals)
          </Text>
          <Text style={styles.bulletPoint}>
            • Detect scheduling conflicts within your family
          </Text>
          <Text style={styles.bulletPoint}>
            • Improve app performance and fix bugs
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Storage & Security</Text>
          <Text style={styles.paragraph}>
            Your data is stored securely using Supabase with row-level security
            policies. Authentication tokens are stored in iOS Keychain / Android
            Keystore. All data transmission uses TLS encryption.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Children's Privacy</Text>
          <Text style={styles.paragraph}>
            TogetherCal is designed for families. Child accounts require
            parental setup and supervision. Children can create events that
            require parent approval before appearing on the family calendar.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Retention</Text>
          <Text style={styles.paragraph}>
            We retain your data as long as your account is active. You can
            export your calendar data (ICS format) at any time from Settings.
            When you delete your account, all associated data is permanently
            removed within 30 days.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Rights</Text>
          <Text style={styles.bulletPoint}>• Access and export your data</Text>
          <Text style={styles.bulletPoint}>
            • Correct inaccurate information
          </Text>
          <Text style={styles.bulletPoint}>• Delete your account and data</Text>
          <Text style={styles.bulletPoint}>
            • Revoke calendar integration permissions
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Third-Party Services</Text>
          <Text style={styles.paragraph}>
            We use the following services that have their own privacy policies:
          </Text>
          <Pressable
            style={styles.externalLink}
            onPress={() => openExternalLink('https://supabase.com/privacy')}
            accessibilityRole="link"
          >
            <Text style={styles.linkText}>
              Supabase (database & authentication)
            </Text>
            <ExternalLink color={colors.primary} size={16} />
          </Pressable>
          <Pressable
            style={styles.externalLink}
            onPress={() => openExternalLink('https://expo.dev/privacy')}
            accessibilityRole="link"
          >
            <Text style={styles.linkText}>Expo (app infrastructure)</Text>
            <ExternalLink color={colors.primary} size={16} />
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have questions about this Privacy Policy or your data,
            contact us at:
          </Text>
          <Pressable
            style={styles.externalLink}
            onPress={() => openExternalLink('mailto:privacy@togethercal.app')}
            accessibilityRole="link"
          >
            <Text style={styles.linkText}>privacy@togethercal.app</Text>
            <ExternalLink color={colors.primary} size={16} />
          </Pressable>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing['3xl'],
  },
  lastUpdated: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  paragraph: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.sm,
  },
  bold: {
    fontWeight: '600',
    color: colors.textPrimary,
  },
  bulletPoint: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 28,
    paddingLeft: spacing.sm,
  },
  externalLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  linkText: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: '500',
  },
  bottomPadding: {
    height: 40,
  },
});
