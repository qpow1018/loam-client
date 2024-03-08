import { Box } from '@mui/material';
import theme from '@/style/theme';

export default function ProfileImage(
  props: {
    url: string;
    size?: number;
  }
) {
  return (
    <Box
      sx={{
        overflow: 'hidden',
        borderRadius: '50%',
        width: props.size !== undefined ? props.size : 36,
        height: props.size !== undefined ? props.size : 36,
        background: theme.color.dark.gray3,
      }}
    >
      <Box
        component={'img'}
        src={props.url}
        sx={{
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </Box>
  );
}