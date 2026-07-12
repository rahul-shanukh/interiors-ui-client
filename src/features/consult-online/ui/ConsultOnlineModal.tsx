// src/features/consult-online/ui/ConsultOnlineModal.tsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QuoteContactStep } from "../../calculator/components/reuse_components/QuoteContactStep";
import { useConsultMutation } from "../model/useConsultMutation";
import type { CustomerDetails } from "../../../entities/quote/model/quote.types";

export const ConsultOnlineModal: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: isOpen } = useQuery({
    queryKey: ["consultModalOpen"],
    initialData: false,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const { mutateAsync, isPending } = useConsultMutation();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (data: CustomerDetails) => {
    try {
      await mutateAsync(data);
      setIsSuccess(true);
    } catch (err) {
      console.error("Consultation submit failed:", err);
    }
  };

  const handleResetAndClose = () => {
    queryClient.setQueryData(["consultModalOpen"], false);
    // Reset success state after modal finishes closing animation
    setTimeout(() => {
      setIsSuccess(false);
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Minimal Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleResetAndClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
          />

          {/* Minimalist Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative bg-[#F4F0EA] rounded-sm p-8 max-w-md w-full shadow-2xl border border-[#13503B]/20 z-10 max-h-[90vh] overflow-y-auto"
          >
            {/* Simple Close Button */}
            <button
              onClick={handleResetAndClose}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-800 transition-colors p-1 cursor-pointer z-50"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {!isSuccess ? (
              <div className="pt-2">
                <QuoteContactStep
                  onSubmit={handleSubmit}
                  loading={isPending}
                  headingText="Book Free Consultation"
                  descriptionText="Enter your details and pin your site to request an expert design consultation."
                  submitButtonText="Submit"
                  minimal={true}
                />
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="flex justify-center mb-4 text-[#13503B]">
                  <CheckCircle2 size={36} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-serif text-[#13503B] tracking-wide mb-3">
                  Request Received!
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed max-w-xs mx-auto mb-6">
                  Thank you for reaching out. A modular design expert will contact you
                  within 24 hours to schedule your consultation and share design ideas.
                </p>
                <button
                  onClick={handleResetAndClose}
                  className="w-full border border-gray-200 hover:border-gray-800 text-gray-700 hover:text-gray-900 py-3 rounded-xl font-bold text-[10px] tracking-widest uppercase transition-colors duration-300 cursor-pointer"
                >
                  Close Window
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
