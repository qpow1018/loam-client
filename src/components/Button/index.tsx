import { ButtonBase, SxProps } from '@mui/material';

import theme from '@/style/theme';

import Text from '@/components/Text';

export enum ButtonTheme {
  bgPri = 'bgPri',
  bgSec = 'bgSec',
}

const buttonThemeMap = {
  [ButtonTheme.bgPri]: {
    color: theme.color.text.primary,
    backgroundColor: theme.color.primary.main,
    hoverBackgroundColor: theme.color.primary.light,
  },
  [ButtonTheme.bgSec]: {
    color: theme.color.text.primary,
    backgroundColor: theme.color.secondary.main,
    hoverBackgroundColor: theme.color.secondary.light,
  },
}

export default function Button(
  props: {
    onClick?: () => void;
    theme: ButtonTheme;
    children: React.ReactNode;
    sx?: SxProps;
  }
) {
  const buttonTheme = buttonThemeMap[props.theme];

  return (
    <ButtonBase
      onClick={props.onClick}
      sx={[
        {
          flexShrink: 0,
          borderRadius: theme.common.borderRadius,
          transition: theme.common.transition,
          fontSize: '0.75rem',
          fontWeight: 500,
          minWidth: '80px',
          height: `${theme.size.buttonHeight}px`,
          padding: '0 12px',
          backgroundColor: buttonTheme.backgroundColor,
          color: buttonTheme.color,
          '&:hover': {
            backgroundColor: buttonTheme.hoverBackgroundColor,
          }
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx])
      ]}
    >
      <Text sx={{ paddingBottom: '1px' }}>
        { props.children }
      </Text>
    </ButtonBase>
  );
}