import React from "react";
import { DesignCard } from "./DesignCard";

const mockDesigns = [
  {
    id: 1,
    imageUrl: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3",
    title: "Modern Kitchen",
    style: "Modern",
  },
  {
    id: 2,
    imageUrl: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
    title: "Luxury Kitchen",
    style: "Luxury",
  },
  {
    id: 3,
    imageUrl: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea",
    title: "Minimal Kitchen",
    style: "Minimal",
  },
  {
    id: 4,
    imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
    title: "Contemporary Kitchen",
    style: "Contemporary",
  },
];

export const DesignGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {mockDesigns.map((design) => (
        <DesignCard
          key={design.id}
          imageUrl={design.imageUrl}
          title={design.title}
          style={design.style}
        />
      ))}
    </div>
  );
};
