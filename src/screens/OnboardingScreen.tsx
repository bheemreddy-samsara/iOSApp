import { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors, spacing } from '@/theme/tokens';
import { useSettingsStore } from '@/state/settingsStore';
import { RootStackParamList } from '@/navigation';

const slides = [
  {
    title: 'Your family, your data',
    description:
      'TogetherCal stores events with your providers. We never touch work calendars or leak details.',
  },
  {
    title: 'Designed for little helpers',
    description:
      'Kids can suggest events with emojis. Parents approve with a tap.',
  },
  {
    title: 'Clear, calm calendar views',
    description:
      'Switch between Today, Week, and Month with buttery-smooth animations.',
  },
];

export function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { completeOnboarding, acceptPrivacyPolicy } = useSettingsStore();

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      finish();
    }
  };

  const finish = () => {
    acceptPrivacyPolicy();
    completeOnboarding();
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" onPress={finish}>
          <Text style={styles.skip}>Skip</Text>
        </Pressable>
        <Text style={styles.progress}>{`${step + 1} / ${slides.length}`}</Text>
      </View>
      <View style={styles.hero}>
        <Text style={styles.title}>{slides[step].title}</Text>
        <Text style={styles.description}>{slides[step].description}</Text>
      </View>
      <View style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, index === step && styles.dotActive]}
            />
          ))}
        </View>
        <Pressable
          accessibilityRole="button"
          style={styles.primaryButton}
          onPress={handleNext}
        >
          <Text style={styles.primaryLabel}>
            {step === slides.length - 1 ? 'Get started' : 'Next'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing['3xl'],
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skip: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  progress: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  hero: {
    gap: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  description: {
    fontSize: 18,
    color: colors.textSecondary,
    lineHeight: 26,
  },
  footer: {
    gap: 20,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.surfaceMuted,
  },
  dotActive: {
    backgroundColor: colors.primary,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryLabel: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
