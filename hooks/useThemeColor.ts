/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/Colors';

export function useThemeColor(
  // props: { light?: string; dark?: string },
  props: { theme: string},
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  // const theme = useColorScheme() ?? 'light';
  // const colorFromProps = props[theme];

  if (props.theme == "light") {
    return Colors.light[colorName];
  } else {
    return Colors.dark[colorName];
  }
}
