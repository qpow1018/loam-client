import { requireAuth } from '@/lib/auth/requireAuth';
import EquipmentClient from './EquipmentClient';

export default async function EquipmentPage() {
  await requireAuth('/maplestory/equipment');

  return <EquipmentClient />;
}
