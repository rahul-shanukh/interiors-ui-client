interface GalleryHeaderProps {
  title: string;
}

export const GalleryHeader: React.FC<GalleryHeaderProps> = ({ title }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
  );
};
