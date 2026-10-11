import React from "react";
import { Link } from "react-router-dom";

const rooms = [
  {
    slug: "kitchen",
    name: "Kitchen",
    description: "Explore modern kitchen designs",
  },
  {
    slug: "wardrobe",
    name: "Wardrobe",
    description: "Explore stylish wardrobe designs",
  },
  {
    slug: "pooja-room",
    name: "Pooja Room",
    description: "Explore beautiful pooja room designs",
  },
];

export const CatalogLandingPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Explore Design Ideas</h1>

        <p className="mt-2 text-gray-600">
          Choose a room to explore our design collection.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <Link
            key={room.slug}
            to={`/design-ideas/${room.slug}`}
            className="rounded-2xl border p-6 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <h2 className="text-xl font-semibold">{room.name}</h2>

            <p className="mt-2 text-sm text-gray-600">{room.description}</p>

            <span className="mt-4 inline-block font-medium text-[var(--brand-primary)]">
              Explore Designs →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};
