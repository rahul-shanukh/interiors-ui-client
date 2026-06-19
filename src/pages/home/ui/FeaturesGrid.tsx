import { useState, useEffect } from "react";

// Define the shape of our synced data
interface Review {
  id: string;
  clientName: string;
  projectInfo: string;
  text: string;
  rating: number;
  source: "google" | "video_manual";
  videoThumb?: string; // For the 3D flip video cards
}

export const CustomerReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. THE GOOGLE REVIEWS AUTO-SYNC API LOGIC
  useEffect(() => {
    const fetchDynamicReviews = async () => {
      try {
        // In production, this hits your backend which securely talks to the Google Places API
        // const response = await fetch('/api/reviews/sync');
        // const data = await response.json();

        // SIMULATED SYNCED DATA
        const syncedData: Review[] = [
          {
            id: "1",
            clientName: "Rahul Sharma",
            projectInfo: "Premium Villa • Warangal",
            text: "Absolute transparency from day one. The 3D models perfectly matched the final output. Highly professional team.",
            rating: 5,
            source: "google",
          },
          {
            id: "2",
            clientName: "Anjali Desai",
            projectInfo: "Video Testimonial • Hyderabad",
            text: "Hover to see our kitchen transformation and hear about our experience with the JC team!",
            rating: 5,
            source: "video_manual",
            videoThumb:
              "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=400",
          },
          {
            id: "3",
            clientName: "Dr. K. Reddy",
            projectInfo: "Clinic Interior • Warangal",
            text: "Delivered perfectly on time. The glass partitions and modern lighting completely elevated our workspace.",
            rating: 5,
            source: "google",
          },
          {
            id: "4",
            clientName: "Vikram Singh",
            projectInfo: "Modular Kitchen • Google Review",
            text: "The cost calculator was incredibly accurate. No hidden charges, just pristine quality and reliable execution.",
            rating: 5,
            source: "google",
          },
        ];

        setReviews(syncedData);
      } catch (error) {
        console.error("API Sync Failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDynamicReviews();
  }, []);

  if (isLoading) return null;

  // Double the array for the infinite physics loop
  const marqueeReviews = [...reviews, ...reviews];

  return (
    // Deep Trust Slate Background
    <section className="relative py-24 bg-[#0B1121] overflow-hidden font-sans">
      {/* Subtle Glass/Glow Orbs in Background */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-16 flex flex-col md:flex-row items-end justify-between gap-8">
        {/* Header Text */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-pulse"></span>
            <span className="text-blue-400 text-xs font-bold tracking-widest uppercase">
              Live Google Sync Active
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
            Verified Client{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
              Stories
            </span>
          </h2>
        </div>

        {/* Aggregate Trust Badge */}
        <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl">
          <div className="text-4xl font-black text-white">4.9</div>
          <div className="flex flex-col">
            <div className="flex gap-1 mb-1">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-4 h-4 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-slate-400 text-xs font-medium">
              Based on 150+ Google Reviews
            </span>
          </div>
        </div>
      </div>

      {/* INFINITE LOOP SECTION */}
      <div className="relative w-full overflow-hidden flex group py-8">
        {/* Edges Gradient for smooth loop masking */}
        <div className="absolute top-0 left-0 w-24 md:w-48 h-full bg-gradient-to-r from-[#0B1121] to-transparent z-20 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-24 md:w-48 h-full bg-gradient-to-l from-[#0B1121] to-transparent z-20 pointer-events-none"></div>

        {/* The Marquee Track */}
        <div className="flex gap-6 w-max animate-marquee group-hover:[animation-play-state:paused] px-4 items-center">
          {marqueeReviews.map((review, idx) =>
            // 3D FLIP VIDEO CARD
            review.source === "video_manual" ? (
              <div
                key={`${review.id}-${idx}`}
                className="group/flip perspective-1000 w-[320px] md:w-[380px] h-[260px] shrink-0 cursor-pointer"
              >
                <div className="relative w-full h-full transition-transform duration-1000 transform-style-3d group-hover/flip:rotate-y-180">
                  {/* Front Face: Glass Stack Effect */}
                  <div className="absolute w-full h-full backface-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl flex flex-col justify-between overflow-hidden">
                    {/* Visual Stacked Lines */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-teal-400 opacity-50"></div>
                    <div className="absolute -top-2 left-4 right-4 h-2 bg-white/5 rounded-t-lg border-t border-x border-white/10"></div>

                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-4 h-4 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="bg-blue-500/20 text-blue-300 text-[0.65rem] font-bold px-2 py-1 rounded-full border border-blue-500/30 flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>{" "}
                        Video
                      </span>
                    </div>

                    <p className="text-slate-200 text-sm font-medium leading-relaxed italic mb-4">
                      "{review.text}"
                    </p>

                    <div>
                      <h4 className="text-white font-bold text-sm">
                        {review.clientName}
                      </h4>
                      <p className="text-slate-400 text-xs">
                        {review.projectInfo}
                      </p>
                    </div>
                  </div>

                  {/* Back Face: Video Thumbnail & Play Button */}
                  <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-2xl overflow-hidden border border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                    <img
                      src={review.videoThumb}
                      alt="Video Thumbnail"
                      className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-slate-900/40"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 shadow-xl hover:scale-110 hover:bg-white/30 transition-transform duration-300">
                        <svg
                          className="w-6 h-6 text-white ml-1"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                      <span className="text-white font-semibold text-sm mt-3 tracking-wide">
                        Play Client Story
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // STANDARD GLASS TESTIMONIAL CARD
              <div
                key={`${review.id}-${idx}`}
                className="relative w-[320px] md:w-[380px] shrink-0 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] cursor-pointer"
              >
                {/* Google SVG Logo */}
                <svg
                  className="absolute top-6 right-6 w-6 h-6 opacity-80"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>

                <div className="flex gap-1 mb-6">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-slate-200 text-sm leading-relaxed mb-8 font-medium line-clamp-4">
                  "{review.text}"
                </p>

                <div>
                  <h4 className="text-white font-bold text-sm tracking-wide">
                    {review.clientName}
                  </h4>
                  <p className="text-slate-400 text-xs mt-1 font-medium">
                    {review.projectInfo}
                  </p>
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      {/* REQUIRED CSS FOR 3D FLIPS AND MARQUEE PHYSICS */}
      <style>{`
        /* 3D Flip Utilities */
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        
        /* Smooth Infinite Loop Physics */
        @keyframes scrollMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 12px)); }
        }
        .animate-marquee {
          /* 45s makes it slow and readable. Linear keeps the speed constant */
          animation: scrollMarquee 45s linear infinite;
        }
      `}</style>
    </section>
  );
};
