import LoadoClient from './LoadoClient';
import { requireAuth } from '@/lib/auth/requireAuth';

export default async function LoadoPage() {
  await requireAuth('/lostark/loado');

  return <LoadoClient />;
}
