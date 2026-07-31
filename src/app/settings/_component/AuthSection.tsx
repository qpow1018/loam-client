'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import SettingsSection from '@/app/settings/_component/SettingsSection';
import Button from '@/components/common/button/Button';
import { createClient } from '@/lib/supabase/client';
import toast from '@/utils/toast';

export default function AuthSection() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    if (isSigningOut) return;

    setIsSigningOut(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error('로그아웃에 실패했습니다.');
      setIsSigningOut(false);
      return;
    }

    queryClient.clear();
    router.replace('/login');
    router.refresh();
  }

  return (
    <SettingsSection
      title="인증"
      description="현재 브라우저의 LoaM 로그인 세션을 종료합니다."
      actions={
        <Button
          color="rose"
          fill="solid"
          size="large"
          isLoading={isSigningOut}
          onClick={handleSignOut}
        >
          로그아웃
        </Button>
      }
    />
  );
}
