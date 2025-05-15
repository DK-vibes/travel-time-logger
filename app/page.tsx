import ChartsPage from '@/components/ChartsPage';
import { getOut, getBack } from '@/lib/db';

export default async function Page() {
  const [outRows, backRows] = await Promise.all([getOut(), getBack()]);
  return <ChartsPage outRows={outRows} backRows={backRows} />;
}