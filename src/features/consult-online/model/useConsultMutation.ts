// src/features/consult-online/model/useConsultMutation.ts
import { useMutation } from "@tanstack/react-query";
import httpClient from "../../../infrastructure/http/api-client";
import type { CustomerDetails } from "../../../entities/quote/model/quote.types";

interface ConsultResponse {
  success: boolean;
  message: string;
}

const sendConsultRequest = async (
  data: CustomerDetails,
): Promise<ConsultResponse> => {
  return httpClient.post<ConsultResponse>("/consultations/request", data);
};

export const useConsultMutation = () => {
  return useMutation({
    mutationFn: sendConsultRequest,
    onSuccess: (response) => {
      console.log("Consultation request successfully submitted:", response);
    },
    onError: (error) => {
      console.error("Failed to submit consultation request:", error);
    },
  });
};
