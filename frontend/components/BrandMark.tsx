import Image from 'next/image';
import { useLanguage } from '@/lib/i18n';

type BrandMarkProps = {
  className?: string;
  label?: string;
};

export default function BrandMark({
  className = '',
  label = 'Bukka Ayyavarlu',
}: BrandMarkProps) {
  const { t } = useLanguage();
  return (
    <span className={`brand-mark ${className}`.trim()}>
      <Image
        src="/bukka-ayyavarlu-logo.png"
        alt=""
        width={768}
        height={768}
        className="brand-mark-image"
        priority
      />
      <span className="brand-mark-label">{t(label)}</span>
    </span>
  );
}
