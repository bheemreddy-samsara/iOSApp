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

export function TermsScreen() {
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
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lastUpdated}>Last updated: November 2024</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.paragraph}>
            By downloading, installing, or using TogetherCal ("the App"), you
            agree to be bound by these Terms of Service. If you do not agree to
            these terms, do not use the App.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Description of Service</Text>
          <Text style={styles.paragraph}>
            TogetherCal is a family calendar application that allows families to
            coordinate schedules, manage events, and stay organized together.
            The service includes:
          </Text>
          <Text style={styles.bulletPoint}>
            • Shared family calendar creation and management
          </Text>
          <Text style={styles.bulletPoint}>
            • Event scheduling with approval workflows
          </Text>
          <Text style={styles.bulletPoint}>
            • Integration with external calendar providers
          </Text>
          <Text style={styles.bulletPoint}>
            • Push notifications for reminders and updates
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. User Accounts</Text>
          <Text style={styles.paragraph}>
            You must create an account to use TogetherCal. You are responsible
            for:
          </Text>
          <Text style={styles.bulletPoint}>
            • Maintaining the confidentiality of your credentials
          </Text>
          <Text style={styles.bulletPoint}>
            • All activities that occur under your account
          </Text>
          <Text style={styles.bulletPoint}>
            • Providing accurate account information
          </Text>
          <Text style={styles.paragraph}>
            You must be at least 13 years old to create an account. Users under
            18 should have parental consent.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Family Groups</Text>
          <Text style={styles.paragraph}>
            Family group owners and administrators are responsible for managing
            member access and permissions. Child accounts have limited
            capabilities and require parent/admin approval for certain actions.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Acceptable Use</Text>
          <Text style={styles.paragraph}>You agree NOT to:</Text>
          <Text style={styles.bulletPoint}>
            • Use the App for any unlawful purpose
          </Text>
          <Text style={styles.bulletPoint}>
            • Share content that is harmful, abusive, or inappropriate
          </Text>
          <Text style={styles.bulletPoint}>
            • Attempt to access other users' accounts or data
          </Text>
          <Text style={styles.bulletPoint}>
            • Reverse engineer or modify the App
          </Text>
          <Text style={styles.bulletPoint}>
            • Use automated systems to access the service
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Calendar Integrations</Text>
          <Text style={styles.paragraph}>
            When you connect external calendars (Google Calendar, Outlook), you
            authorize TogetherCal to read calendar data according to the
            permissions you grant. You can revoke these permissions at any time
            through the Integrations settings.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Intellectual Property</Text>
          <Text style={styles.paragraph}>
            The App, including its design, features, and content, is owned by
            TogetherCal and protected by intellectual property laws. You retain
            ownership of the content you create (events, descriptions, etc.).
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Disclaimer of Warranties</Text>
          <Text style={styles.paragraph}>
            THE APP IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO
            NOT GUARANTEE THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR
            ERROR-FREE.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Limitation of Liability</Text>
          <Text style={styles.paragraph}>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, TOGETHERCAL SHALL NOT BE
            LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL
            DAMAGES ARISING FROM YOUR USE OF THE APP.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Termination</Text>
          <Text style={styles.paragraph}>
            We may suspend or terminate your access to the App at any time for
            violation of these terms. You may delete your account at any time
            through Settings.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>11. Changes to Terms</Text>
          <Text style={styles.paragraph}>
            We may update these terms from time to time. We will notify you of
            significant changes through the App or via email. Continued use
            after changes constitutes acceptance of the new terms.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>12. Contact</Text>
          <Text style={styles.paragraph}>
            For questions about these Terms of Service, contact us at:
          </Text>
          <Pressable
            style={styles.externalLink}
            onPress={() => openExternalLink('mailto:legal@togethercal.app')}
            accessibilityRole="link"
          >
            <Text style={styles.linkText}>legal@togethercal.app</Text>
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
