import { z } from "zod";

export const paymentSchema = z.object({
  paymentStatus: z.enum(["Paid", "Failed", "Refunded"]).default("Paid"),
  paymentMethod: z.enum(["Cash", "UPI", "Card", "Wallet", "Split Payment"]),
  transactionId: z.string().trim().max(150).optional(),
  paymentNotes: z.string().trim().max(500).optional(),
});
