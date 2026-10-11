import { useParams, Navigate } from "react-router-dom";
import { CategoryThemeProvider } from "../../shared/ui/theme/CategoryThemeProvider";
import { DesignGalleryShell } from "../../widget/gallery-layout/ui/DesignGalleryShell";
import { ROOM_PALETTES } from "../../entities/room-category/config/palettes";

export default function RoomDesignIdeasPage() {
  const { room } = useParams<{ room: string }>();
  // Validate route parameter
  if (!room || !ROOM_PALETTES[room]) {
    return <Navigate to="/design-ideas" replace />;
  }

  return (
    <CategoryThemeProvider roomSlug={room}>
      <DesignGalleryShell roomSlug={room} />
    </CategoryThemeProvider>
  );
}
