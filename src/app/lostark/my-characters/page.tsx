import MyCharactersClient from './MyCharactersClient';
import { requireAuth } from '@/lib/auth/requireAuth';

export default async function MyCharactersPage() {
  await requireAuth('/lostark/my-characters');

  return <MyCharactersClient />;
}
