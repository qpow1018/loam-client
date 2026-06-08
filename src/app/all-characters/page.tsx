import { requireAuth } from '@/lib/auth/requireAuth';
import AllCharactersClient from './AllCharactersClient';

export default async function AllCharactersPage() {
  await requireAuth('/all-characters');

  return <AllCharactersClient />;
}
