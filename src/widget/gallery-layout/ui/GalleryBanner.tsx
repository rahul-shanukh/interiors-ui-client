interface GalleryBannerProps {
  title: string;
  subtitle: string;
}

export const GalleryBanner: React.FC<GalleryBannerProps> = ({
  title,
  subtitle,
}) => {
  return (
    <div className="p-8 rounded-2xl bg-[var(--surface-banner)]">
      <h2 className="text-3xl font-bold text-[var(--text-heading)]">{title}</h2>

      <p className="mt-2 text-[var(--text-heading)] opacity-80">{subtitle}</p>
    </div>
  );
};
