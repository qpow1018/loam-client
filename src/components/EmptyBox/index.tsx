import { Box } from '@mui/material';
import theme from '@/style/theme';

import Text from '@/components/Text';

export default function EmptyBox(
  props: {
    text?: string;
    height?: string | number;
  }
) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: props.height !== undefined ? props.height : 180,
      }}
    >
      <Text
        sx={{
          fontSize: '0.813rem',
          color: theme.color.text.secondary,
        }}
      >
        { props.text !== undefined
          ? props.text
          : '내용이 없습니다.'
        }
      </Text>
    </Box>
  );
}