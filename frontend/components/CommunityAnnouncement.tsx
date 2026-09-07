import Link from 'next/link';
import type { CountryCode } from '@/lib/locale';

export default function CommunityAnnouncement({ region }: { region?: CountryCode }) {
  const newsPath = region === 'IN' ? '/india/news' : region === 'US' ? '/usa/news' : '/login';
  return (
    <aside className="community-announcement" role="status">
      <span className="community-announcement-badge">Announcement</span>
      <div>
        <h2>Spring break family picnic</h2>
        <p>Join us for devotional songs, family games, shared food, and a joyful day of community togetherness.</p>
      </div>
      <Link href={newsPath}>{region ? 'View regional details' : 'Sign in for details'}</Link>
    </aside>
  );
}
