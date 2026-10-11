import React from "react";
import { RoomNavigationTabs } from "./RoomNavigationTabs";
import { GalleryHeader } from "./GalleryHeader";
import { GalleryBanner } from "./GalleryBanner";
import { DesignGrid } from "./DesignGrid";
import { MainHeader } from "./MainHeader";
import { GalleryFilters } from "./GalleryFilters";
import { PromoRollingBoard } from "./PromoRollingBoard";

interface DesignGalleryShellProps {
  roomSlug: string;
}

export const DesignGalleryShell: React.FC<DesignGalleryShellProps> = ({
  roomSlug,
}) => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 1. Unified Sticky Header Ecosystem (Zero gap, stacks flush) */}
      <div className="sticky top-0 z-50 w-full bg-white">
        <MainHeader />
        <PromoRollingBoard />
        <RoomNavigationTabs activeRoom={roomSlug} />
      </div>

      {/* 2. Gallery Content Section (Controlled inner padding & spacing) */}
      <main className="flex-grow mx-auto w-full  ">
        <GalleryFilters />
        <GalleryHeader title={`${roomSlug} Designs`} />
        <GalleryBanner
          title={`${roomSlug} Designs`}
          subtitle={`Explore our latest ${roomSlug} design collection`}
        />
        <DesignGrid />
      </main>
    </div>
  );
};
