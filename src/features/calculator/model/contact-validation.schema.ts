import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name is too long" }),
  phone: z
    .string()
    .regex(/^\d{10}$/, { message: "Enter a valid 10-digit WhatsApp number" }),
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  city: z
    .string()
    .min(1, { message: "Please search or select a city from the list" }),
  state: z
    .string()
    .min(1, { message: "Please select a location with a valid state" }),
  country: z
    .string()
    .min(1, { message: "Please select a location with a valid country" }),

  // ✅ Swapped required_error to message for Zod v4 compatibility
  latitude: z.number({
    message: "Please select a location on the interactive map",
  }),
  longitude: z.number({
    message: "Please select a location on the interactive map",
  }),
});

export type ContactFormData = z.infer<typeof contactSchema>;
