import { Box } from '@mui/material';
import theme from '@/style/theme';

import Text from '@/components/Text';

export default function SectionTitlePanel(
  props: {
    title: string;
    rightComponent?: React.ReactNode;
  }
) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        height: 56,
        borderBottom: `1px solid ${theme.color.border.dark}`,
        padding: '0 12px'
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Text
          sx={{
            fontSize: '0.813rem',
            fontWeight: 500,
            color: theme.color.text.secondary
          }}
        >
          { props.title }
        </Text>
      </Box>

      { props.rightComponent }
    </Box>
  );
}