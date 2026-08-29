import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

// 1. TYPINGS
export interface Review {
  id: string;
  clientName: string;
  projectInfo: string;
  text: string;
  rating: number;
  source: "google" | "video_manual";
  videoThumb?: string;
}

// 2. STATIC FALLBACK / INITIAL DATA
// Guarantees zero layout shift and instant SEO crawlability on cold renders.
const INITIAL_REVIEWS: Review[] = [
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
    text: "Hover to see our kitchen transformation and hear about our experience with the team!",
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

// Async fetcher function (hit your backend endpoint in production)
const fetchSyncedReviews = async (): Promise<Review[]> => {
  // In production:
  // const res = await fetch("/api/reviews/sync");
  // if (!res.ok) throw new Error("Network error");
  // return res.json();

  return INITIAL_REVIEWS;
};

export const CustomerReviews = () => {
  // 3. TANSTACK QUERY SETUP
  const { data: reviews = INITIAL_REVIEWS } = useQuery<Review[]>({
    queryKey: ["googleReviewsSync"],
    queryFn: fetchSyncedReviews,
    initialData: INITIAL_REVIEWS, // Hydrates instantly for SEO & SSR
    staleTime: 1000 * 60 * 15, // Cache for 15 minutes before background refetch
  });

  // Duplicate the reviews array for the infinite seamless marquee loop
  const marqueeReviews = useMemo(() => [...reviews, ...reviews], [reviews]);

  // 4. GOOGLE JSON-LD SCHEMA FOR RICH SEARCH SNIPPETS
  const schemaData = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Interior Design Warangal",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "150",
        bestRating: "5",
        worstRating: "1",
      },
      review: reviews.map((r) => ({
        "@type": "Review",
        author: { "@type": "Person", name: r.clientName },
        reviewRating: {
          "@type": "Rating",
          ratingValue: r.rating.toString(),
          bestRating: "5",
        },
        reviewBody: r.text,
      })),
    }),
    [reviews],
  );

  return (
    <section className="relative py-28 bg-[#0B1121] overflow-hidden font-sans">
      {/* 5. TOP BACKGROUND BLEND BRIDGE
          Melts the warm off-white background (#fcfbf9) of PriceCalculatorTeaser 
          smoothly into the dark luxury slate background (#0B1121) */}
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#fcfbf9] via-[#0B1121]/80 to-[#0B1121] pointer-events-none z-10" />

      {/* SEO Schema.org Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {/* Ambient Background Glows */}
      <div className="absolute top-12 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 mb-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-pulse" />
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

        {/* Aggregate Score Card */}
        <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl">
          <div className="text-4xl font-black text-white">4.9</div>
          <div className="flex flex-col">
            <div
              className="flex gap-1 mb-1"
              aria-label="Rating 5 out of 5 stars"
            >
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  aria-hidden="true"
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

      {/* MARQUEE CONTAINER */}
      <div className="relative w-full overflow-hidden flex group py-8 z-20">
        {/* Soft Side Fades for Smooth Infinite Edges */}
        <div className="absolute top-0 left-0 w-24 md:w-48 h-full bg-gradient-to-r from-[#0B1121] to-transparent z-30 pointer-events-none" />
        <div className="absolute top-0 right-0 w-24 md:w-48 h-full bg-gradient-to-l from-[#0B1121] to-transparent z-30 pointer-events-none" />

        {/* Scrolling Track */}
        <div className="flex gap-6 w-max animate-marquee group-hover:[animation-play-state:paused] px-4 items-center will-change-transform">
          {marqueeReviews.map((review, idx) =>
            review.source === "video_manual" ? (
              /* 3D FLIP VIDEO CARD */
              <div
                key={`${review.id}-${idx}`}
                className="group/flip perspective-1000 w-[320px] md:w-[380px] h-[260px] shrink-0 cursor-pointer"
              >
                <div className="relative w-full h-full transition-transform duration-1000 transform-style-3d group-hover/flip:rotate-y-180">
                  {/* Front Side */}
                  <div className="absolute w-full h-full backface-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl flex flex-col justify-between overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-teal-400 opacity-50" />
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-1" aria-hidden="true">
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
                      <span className="bg-blue-500/20 text-blue-300 text-[0.65rem] font-bold px-2.5 py-1 rounded-full border border-blue-500/30 flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>{" "}
                        Video Story
                      </span>
                    </div>

                    <p className="text-slate-200 text-sm font-medium leading-relaxed italic mb-4">
                      "{review.text}"
                    </p>

                    <div>
                      <h3 className="text-white font-bold text-sm">
                        {review.clientName}
                      </h3>
                      <p className="text-slate-400 text-xs">
                        {review.projectInfo}
                      </p>
                    </div>
                  </div>

                  {/* Back Side: Video Thumbnail */}
                  <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-2xl overflow-hidden border border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                    <img
                      src={review.videoThumb}
                      alt={`${review.clientName} Video Testimonial`}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay"
                    />
                    <div className="absolute inset-0 bg-slate-900/40" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 shadow-xl hover:scale-110 hover:bg-white/30 transition-transform duration-300">
                        <svg
                          className="w-6 h-6 text-white ml-1"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
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
              /* STANDARD GOOGLE REVIEW CARD */
              <div
                key={`${review.id}-${idx}`}
                className="relative w-[320px] md:w-[380px] shrink-0 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] cursor-pointer"
              >
                {/* Google Logo */}
                <svg
                  className="absolute top-6 right-6 w-6 h-6 opacity-80"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
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

                <div className="flex gap-1 mb-6" aria-hidden="true">
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
                  <h3 className="text-white font-bold text-sm tracking-wide">
                    {review.clientName}
                  </h3>
                  <p className="text-slate-400 text-xs mt-1 font-medium">
                    {review.projectInfo}
                  </p>
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      {/* GPU ACCELERATED STYLES */}
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }

        @keyframes scrollMarquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(calc(-50% - 12px), 0, 0); }
        }
        .animate-marquee {
          animation: scrollMarquee 45s linear infinite;
        }
      `}</style>
    </section>
  );
};
