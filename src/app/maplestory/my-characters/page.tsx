import { requireAuth } from '@/lib/auth/requireAuth';
import MyCharactersClient from './MyCharactersClient';

export default async function MyCharactersPage() {
  await requireAuth('/maplestory/my-characters');

  return <MyCharactersClient />;
}
