export default function WardrobeGallery() {
  const dummyWardrobes = [
    { id: 1, title: "Glass Door Sliding Wardrobe", style: "Luxury" },
    { id: 2, title: "Walk-In Closet System", style: "Modern" },
    { id: 3, title: "Hinged Wardrobe with Loft", style: "Classic" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {dummyWardrobes.map((item) => (
        <div
          key={item.id}
          className="bg-white border border-[#e3dfd3] p-4 rounded-lg shadow-sm"
        >
          <div className="w-full h-48 bg-[#f5f2eb] rounded mb-4 flex items-center justify-center text-[#8c7a6b] text-sm font-medium">
            Wardrobe Image Placeholder
          </div>
          <h3 className="font-semibold text-[#4a3f35]">{item.title}</h3>
          <p className="text-xs text-[#8c7a6b] mt-1">Style: {item.style}</p>
        </div>
      ))}
    </div>
  );
}
