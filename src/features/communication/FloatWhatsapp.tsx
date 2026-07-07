import { useRef } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { X } from "lucide-react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface FloatWhatsappProps {
  phoneNumber?: string; // Format: country code + number, e.g. "919000000000"
  defaultMessage?: string;
}

export default function FloatWhatsapp({
  phoneNumber = "919573451382", 
  defaultMessage = "Hi! I am interested in getting a consultation for my home interiors.",
}: FloatWhatsappProps) {
  const queryClient = useQueryClient();
  const constraintsRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragControls = useDragControls();

  // Query to handle delayed tooltip display with full unmount cleanup using AbortSignal
  const { data: showTooltip } = useQuery({
    queryKey: ["whatsappTooltip"],
    queryFn: ({ signal }) =>
      new Promise<boolean>((resolve) => {
        const timer = setTimeout(() => resolve(true), 4000);
        // Clean up the timer if the component unmounts or query is canceled
        signal.addEventListener("abort", () => clearTimeout(timer));
      }),
    initialData: false,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const handleDragStart = () => {
    isDraggingRef.current = true;
  };

  const handleDragEnd = () => {
    // Use a tiny timeout to ensure the click event is ignored
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 100);
  };

  const handleChatStart = () => {
    if (isDraggingRef.current) return;
    const encodedMessage = encodeURIComponent(defaultMessage);
    // WhatsApp direct API link (opens WhatsApp app or WhatsApp Web directly with prefilled number and message)
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const handleCloseTooltip = () => {
    // Set query data cache to false to immediately hide the tooltip
    queryClient.setQueryData(["whatsappTooltip"], false);
  };

  return (
    <>
      {/* Invisible full-screen viewport container to define dragging boundaries without resize listeners */}
      <div
        ref={constraintsRef}
        className="fixed inset-6 pointer-events-none z-50 select-none"
      />

      <motion.div
        drag
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans touch-none"
      >
        {/* Floating tooltip */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className="mb-3 mr-2 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-gray-100 flex items-center gap-2 max-w-[250px] relative cursor-pointer pointer-events-auto"
              onClick={() => {
                if (!isDraggingRef.current) {
                  handleChatStart();
                  handleCloseTooltip();
                }
              }}
            >
              {/* Close tooltip */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isDraggingRef.current) {
                    handleCloseTooltip();
                  }
                }}
                className="absolute -top-1.5 -left-1.5 bg-white text-gray-400 hover:text-gray-600 rounded-full p-0.5 border border-gray-100 shadow-sm transition-colors cursor-pointer"
              >
                <X size={10} />
              </button>
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping shrink-0" />
              <p className="text-xs font-semibold text-gray-700 select-none">
                Need help? Chat with an expert!
              </p>
              {/* arrow indicator */}
              <div className="absolute right-4 -bottom-1.5 w-3 h-3 bg-white/95 rotate-45 border-r border-b border-gray-100/50"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Action Button */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onPointerDown={(e) => dragControls.start(e)}
          onClick={handleChatStart}
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg cursor-grab active:cursor-grabbing text-white bg-[#25D366] hover:bg-[#20ba59] hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] transition-all duration-300 relative select-none pointer-events-auto"
          aria-label="Contact us on WhatsApp"
        >
          <div className="relative pointer-events-none">
            <FaWhatsapp size={28} className="animate-in fade-in duration-300" />
          </div>
        </motion.button>
      </motion.div>
    </>
  );
}