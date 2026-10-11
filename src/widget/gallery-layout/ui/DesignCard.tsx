import React from "react";

interface DesignCardProps {
  imageUrl: string;
  title: string;
  style: string;
}

export const DesignCard: React.FC<DesignCardProps> = ({
  imageUrl,
  title,
  style,
}) => {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <img src={imageUrl} alt={title} className="h-56 w-full object-cover" />

      <div className="p-4">
        <h3 className="text-lg font-semibold text-[var(--text-heading)]">
          {title}
        </h3>

        <p className="mt-1 text-sm text-gray-500">{style}</p>

        <button className="mt-4 rounded-lg bg-[var(--brand-primary)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90">
          View Design
        </button>
      </div>
    </div>
  );
};
