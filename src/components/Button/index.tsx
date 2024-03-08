import { ButtonBase, SxProps } from '@mui/material';

import theme from '@/style/theme';

import Text from '@/components/Text';

export enum ButtonTheme {
  bgPri = 'bgPri',
  bgSec = 'bgSec',
  bgGray = 'bgGray',
  bdGray = 'bdGray',
}

const buttonThemeMap = {
  [ButtonTheme.bgPri]: {
    color: theme.color.text.primary,
    backgroundColor: theme.color.primary.main,
    hoverBackgroundColor: theme.color.primary.light,
    borderColor: theme.color.primary.main,
    hoverBorderColor: theme.color.primary.light,
  },
  [ButtonTheme.bgSec]: {
    color: theme.color.text.primary,
    backgroundColor: theme.color.secondary.main,
    hoverBackgroundColor: theme.color.secondary.light,
    borderColor: theme.color.secondary.main,
    hoverBorderColor: theme.color.secondary.light,
  },
  [ButtonTheme.bgGray]: {
    color: theme.color.text.primary,
    backgroundColor: theme.color.dark.gray4,
    hoverBackgroundColor: theme.color.dark.gray5,
    borderColor: theme.color.dark.gray4,
    hoverBorderColor: theme.color.dark.gray5,
  },
  [ButtonTheme.bdGray]: {
    color: theme.color.text.primary,
    backgroundColor: 'transparent',
    hoverBackgroundColor: 'transparent',
    borderColor: theme.color.border.default,
    hoverBorderColor: theme.color.border.light,
  },
}

export default function Button(
  props: {
    onClick?: () => void;
    theme: ButtonTheme;
    isRound?: boolean;
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
          borderRadius: props.isRound === true ? '60px' : theme.common.borderRadius,
          transition: theme.common.transition,
          fontSize: '0.813rem',
          fontWeight: 500,
          minWidth: '80px',
          height: `${theme.size.buttonHeight}px`,
          padding: '0 12px',
          backgroundColor: buttonTheme.backgroundColor,
          color: buttonTheme.color,
          border: `1px solid ${buttonTheme.borderColor}`,
          '&:hover': {
            backgroundColor: buttonTheme.hoverBackgroundColor,
            borderColor: buttonTheme.hoverBorderColor,
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