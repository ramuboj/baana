import { redirect } from 'next/navigation';

export default function UsaRegisterPage() {
  redirect('/register?region=US');
}
