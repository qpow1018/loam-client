import { Box, Modal, ButtonBase } from '@mui/material';
import theme from '@/style/theme';

import Text from '@/components/Text';

import CloseIcon from '@mui/icons-material/Close';

export default function ModalBase(
  props: {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title: string;
    width?: number;
  }
) {
  return (
    <Modal
      open={props.isOpen}
      onClose={props.onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '.MuiBackdrop-root': {
          backgroundColor: theme.color.background.overlay,
        },
      }}
    >
      <div style={{ outline: 'none' }}>
        <Box
          sx={{
            borderRadius: theme.common.borderRadius,
            backgroundColor: theme.color.background.default,
            marginBottom: '80px',
            width: props.width !== undefined ? props.width : 480,
          }}
        >
          <ModalHeader
            title={props.title}
            onClose={props.onClose}
          />

          { props.children }
        </Box>
      </div>
    </Modal>
  );
}

function ModalHeader(
  props: {
    title: string;
    onClose: () => void;
  }
) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 8px 0 16px',
        height: `${theme.size.modalHeaderHeight}px`,
        borderBottom: `1px solid ${theme.color.border.dark}`,
      }}
    >
      <Text
        sx={{
          fontSize: '0.875rem',
          fontWeight: 500,
          color: theme.color.text.secondary,
        }}
      >
        {props.title}
      </Text>

      <ButtonBase
        onClick={props.onClose}
        sx={{
          borderRadius: '50%',
          transition: theme.common.transition,
          width: 32,
          height: 32,
          color: theme.color.text.secondary,
          '&:hover': {
            color: theme.color.text.primary,
          }
        }}
      >
        <CloseIcon />
      </ButtonBase>
    </Box>
  );
}