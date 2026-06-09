import { requireAuth } from '@/lib/auth/requireAuth';
import AllCharactersClient from './AllCharactersClient';

export default async function AllCharactersPage() {
  await requireAuth('/lostark/all-characters');

  return <AllCharactersClient />;
}
