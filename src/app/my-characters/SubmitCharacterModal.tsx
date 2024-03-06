import { Box } from '@mui/material';

import Modal from '@/components/Modal';
import TextInput from '@/components/Form/TextInput';

export default function SubmitCharacterModal(
  props: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
  }
) {
  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.onClose}
      title={props.title}
      width={900}
    >
      <Box sx={{ padding: '16px' }}>
        <Box>
          캐릭터 리스트들
        </Box>

        <Box>
          인풋
        </Box>

        <Box>
          버튼
        </Box>

      </Box>

    </Modal>
  );
}