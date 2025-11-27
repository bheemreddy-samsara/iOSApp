// Theme tokens tests
import {
  colors,
  typography,
  spacing,
  radii,
  shadows,
  motion,
} from '@/theme/tokens';

describe('theme tokens', () => {
  describe('colors', () => {
    it('has primary color defined', () => {
      expect(colors.primary).toBe('#5E6AD2');
    });

    it('has all required colors', () => {
      const requiredColors = [
        'primary',
        'primaryLight',
        'accent',
        'success',
        'warning',
        'danger',
        'background',
        'surface',
        'textPrimary',
        'textSecondary',
        'border',
      ];

      requiredColors.forEach((color) => {
        expect(colors).toHaveProperty(color);
      });
    });

    it('all colors are valid hex values', () => {
      const hexRegex = /^#[0-9A-Fa-f]{6}$/;

      Object.values(colors).forEach((color) => {
        expect(color).toMatch(hexRegex);
      });
    });

    it('has category colors', () => {
      expect(colors.categoryBlue).toBeDefined();
      expect(colors.categoryPink).toBeDefined();
      expect(colors.categoryTeal).toBeDefined();
      expect(colors.categoryYellow).toBeDefined();
    });
  });

  describe('typography', () => {
    it('has display style', () => {
      expect(typography.display).toEqual({
        fontSize: 44,
        lineHeight: 52,
        fontWeight: '700',
      });
    });

    it('has all text styles', () => {
      const styles = [
        'display',
        'title',
        'headline',
        'body',
        'callout',
        'footnote',
        'caption',
      ];

      styles.forEach((style) => {
        expect(typography).toHaveProperty(style);
        expect(typography[style as keyof typeof typography]).toHaveProperty(
          'fontSize',
        );
        expect(typography[style as keyof typeof typography]).toHaveProperty(
          'lineHeight',
        );
        expect(typography[style as keyof typeof typography]).toHaveProperty(
          'fontWeight',
        );
      });
    });

    it('font sizes decrease from display to caption', () => {
      expect(typography.display.fontSize).toBeGreaterThan(
        typography.title.fontSize,
      );
      expect(typography.title.fontSize).toBeGreaterThan(
        typography.headline.fontSize,
      );
      expect(typography.headline.fontSize).toBeGreaterThan(
        typography.body.fontSize,
      );
      expect(typography.body.fontSize).toBeGreaterThan(
        typography.callout.fontSize,
      );
      expect(typography.callout.fontSize).toBeGreaterThan(
        typography.footnote.fontSize,
      );
      expect(typography.footnote.fontSize).toBeGreaterThan(
        typography.caption.fontSize,
      );
    });

    it('line heights are greater than font sizes', () => {
      Object.values(typography).forEach((style) => {
        expect(style.lineHeight).toBeGreaterThan(style.fontSize);
      });
    });
  });

  describe('spacing', () => {
    it('has all spacing values', () => {
      const spacings = [
        'xxs',
        'xs',
        'sm',
        'md',
        'lg',
        'xl',
        '2xl',
        '3xl',
        '4xl',
        '5xl',
      ];

      spacings.forEach((s) => {
        expect(spacing).toHaveProperty(s);
      });
    });

    it('spacing values increase progressively', () => {
      expect(spacing.xxs).toBeLessThan(spacing.xs);
      expect(spacing.xs).toBeLessThan(spacing.sm);
      expect(spacing.sm).toBeLessThan(spacing.md);
      expect(spacing.md).toBeLessThan(spacing.lg);
      expect(spacing.lg).toBeLessThan(spacing.xl);
      expect(spacing.xl).toBeLessThan(spacing['2xl']);
      expect(spacing['2xl']).toBeLessThan(spacing['3xl']);
      expect(spacing['3xl']).toBeLessThan(spacing['4xl']);
      expect(spacing['4xl']).toBeLessThan(spacing['5xl']);
    });

    it('all spacing values are positive numbers', () => {
      Object.values(spacing).forEach((value) => {
        expect(typeof value).toBe('number');
        expect(value).toBeGreaterThan(0);
      });
    });
  });

  describe('radii', () => {
    it('has all border radius values', () => {
      expect(radii).toHaveProperty('xs');
      expect(radii).toHaveProperty('sm');
      expect(radii).toHaveProperty('md');
      expect(radii).toHaveProperty('lg');
      expect(radii).toHaveProperty('xl');
      expect(radii).toHaveProperty('pill');
    });

    it('radii values increase progressively except pill', () => {
      expect(radii.xs).toBeLessThan(radii.sm);
      expect(radii.sm).toBeLessThan(radii.md);
      expect(radii.md).toBeLessThan(radii.lg);
      expect(radii.lg).toBeLessThan(radii.xl);
    });

    it('pill radius is largest for fully rounded corners', () => {
      expect(radii.pill).toBe(999);
    });
  });

  describe('shadows', () => {
    it('has all shadow definitions', () => {
      expect(shadows).toHaveProperty('soft');
      expect(shadows).toHaveProperty('elevated');
      expect(shadows).toHaveProperty('modal');
    });

    it('shadow objects have required properties', () => {
      const requiredProps = [
        'shadowColor',
        'shadowOffset',
        'shadowOpacity',
        'shadowRadius',
        'elevation',
      ];

      Object.values(shadows).forEach((shadow) => {
        requiredProps.forEach((prop) => {
          expect(shadow).toHaveProperty(prop);
        });
      });
    });

    it('elevation increases with shadow intensity', () => {
      expect(shadows.soft.elevation).toBeLessThan(shadows.elevated.elevation);
      expect(shadows.elevated.elevation).toBeLessThan(shadows.modal.elevation);
    });

    it('shadow radius increases with intensity', () => {
      expect(shadows.soft.shadowRadius).toBeLessThan(
        shadows.elevated.shadowRadius,
      );
      expect(shadows.elevated.shadowRadius).toBeLessThan(
        shadows.modal.shadowRadius,
      );
    });
  });

  describe('motion', () => {
    it('has spring configuration', () => {
      expect(motion.spring).toEqual({
        stiffness: 160,
        damping: 20,
      });
    });

    it('has duration values', () => {
      expect(motion.durationFast).toBeDefined();
      expect(motion.durationBase).toBeDefined();
      expect(motion.durationSlow).toBeDefined();
    });

    it('durations increase progressively', () => {
      expect(motion.durationFast).toBeLessThan(motion.durationBase);
      expect(motion.durationBase).toBeLessThan(motion.durationSlow);
    });

    it('durations are reasonable animation lengths', () => {
      expect(motion.durationFast).toBeGreaterThanOrEqual(100);
      expect(motion.durationFast).toBeLessThanOrEqual(200);
      expect(motion.durationBase).toBeGreaterThanOrEqual(200);
      expect(motion.durationBase).toBeLessThanOrEqual(300);
      expect(motion.durationSlow).toBeGreaterThanOrEqual(300);
      expect(motion.durationSlow).toBeLessThanOrEqual(500);
    });
  });
});
