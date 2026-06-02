'use client';

import { useActionState } from 'react';

import { login, type TLoginState } from '@/app/login/actions';

import styles from './login.module.scss';

const INITIAL_STATE: TLoginState = {};

export default function LoginClient(props: { next: string }) {
  const { next } = props;

  const [state, formAction, isPending] = useActionState(login, INITIAL_STATE);

  return (
    <main className={styles['login-page']}>
      <section className={styles['login-panel']}>
        <div className={styles['brand']}>
          <h1>LoaM</h1>
          <p>개인 사용을 위한 인증이 필요합니다.</p>
        </div>

        <form action={formAction} className={styles['login-form']}>
          <input type="hidden" name="next" value={next} />

          <label className={styles['field']}>
            <span>이메일</span>
            <input name="email" type="email" autoComplete="email" autoFocus required />
          </label>

          <label className={styles['field']}>
            <span>비밀번호</span>
            <input name="password" type="password" autoComplete="current-password" required />
          </label>

          {state.message !== undefined && (
            <p className={styles['error-message']}>{state.message}</p>
          )}

          <button type="submit" disabled={isPending} className={styles['submit-button']}>
            {isPending ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </section>
    </main>
  );
}
