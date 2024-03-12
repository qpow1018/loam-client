import { ButtonBase } from '@mui/material';
import theme from '@/style/theme';

import Text from '@/components/Text';

export default function LoadoMenuButton(
  props: {
    onClick?: () => void;
    children: React.ReactNode;
    iconComponent?: React.ReactNode;
  }
) {
  return (
    <ButtonBase
      onClick={props.onClick}
      sx={{
        transition: theme.common.transition,
        padding: '4px',
        color: theme.color.text.secondary,
        marginLeft: '6px',
        '&:first-of-type': {
          marginLeft: 0,
        },
        '& .MuiSvgIcon-root': {
          fontSize: '18px',
          marginRight: '4px'
        },
        '&:hover': {
          color: theme.color.text.primary,
        }
      }}
    >
      { props.iconComponent }

      <Text
        sx={{
          fontSize: '0.75rem',
          paddingBottom: '1px',
        }}
      >
        { props.children }
      </Text>
    </ButtonBase>
  );
}