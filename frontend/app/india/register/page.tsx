import { redirect } from 'next/navigation';

export default function IndiaRegisterPage() {
  redirect('/register?region=IN');
}
