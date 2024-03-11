import { Box } from '@mui/material';

import Layout from '@/components/Layout';

import MainCharacterSection from './MainCharacterSection';
import ArmorySection from './ArmorySection';
import MemoSection from './MemoSection';

export default function Loado() {
  return (
    <Layout>
      <Box
        sx={{
          padding: '12px',
          display: 'flex',
        }}
      >
        <Box
          sx={{
            width: '1080px',
            marginRight: '12px',
          }}
        >
          <MainCharacterSection />
          <ArmorySection />
        </Box>

        <Box sx={{ flex: 1 }}>
          <MemoSection />
        </Box>
      </Box>
    </Layout>
  );
}