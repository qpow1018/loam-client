import { ButtonBase, SxProps } from '@mui/material';

import theme from '@/style/theme';

export default function IconButton(
  props: {
    onClick?: () => void;
    children: React.ReactNode;
    buttonSize?: number | string;
    iconSize?: number | string;
    sx?: SxProps;
  }
) {
  return (
    <ButtonBase
      onClick={props.onClick}
      sx={[
        {
          flexShrink: 0,
          borderRadius: '50%',
          transition: theme.common.transition,
          width: props.buttonSize !== undefined ? props.buttonSize: `${theme.size.iconButtonSize}px`,
          height: props.buttonSize !== undefined ? props.buttonSize: `${theme.size.iconButtonSize}px`,
          backgroundColor: theme.color.dark.gray4,
          color: theme.color.text.secondary,
          '&:hover': {
            backgroundColor: theme.color.dark.gray5,
          },
          '& .MuiSvgIcon-root': {
            fontSize: props.iconSize !== undefined ? props.iconSize : '18px'
          }
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx])
      ]}
    >
      { props.children }
    </ButtonBase>
  );
}