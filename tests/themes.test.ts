import * as fontsAndroid from '../themes/fonts.android';
import * as fontsIos from '../themes/fonts.ios';
import * as theme from '../themes/theme';

describe('Themes', () => {
  it('theme exports lightTheme and darkTheme', () => {
    expect(theme.lightTheme).toBeDefined();
    expect(theme.darkTheme).toBeDefined();
    expect(theme.lightTheme.colors.primary).toBe('#4A90E2');
    expect(theme.darkTheme.colors.primary).toBe('#60A5FA');
  });
  it('fonts.ios exports expected keys', () => {
    expect(fontsIos.default).toHaveProperty('displayLarge');
    expect(fontsIos.default).toHaveProperty('bodySmall');
  });
  it('fonts.android exports expected keys', () => {
    expect(fontsAndroid.default).toHaveProperty('displayLarge');
    expect(fontsAndroid.default).toHaveProperty('bodySmall');
  });
  it('lightTheme uses ios or android fonts', () => {
    expect(theme.lightTheme.fonts).toBeDefined();
    expect(theme.darkTheme.fonts).toBeDefined();
  });
});
