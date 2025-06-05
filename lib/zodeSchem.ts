import { z } from "zod";

export const accountNumberSchema = z.object({
  accountNumber: z
    .string()
    .min(10, "Account number must be 10 digits")
    .max(10, "Account number must be 10 digits")
    .regex(/^\d+$/, "Account number must be digits only"),
});

export const simCardSchema = z.object({
  simNumber: z
    .string()
    .min(11, "SIM number must be at least 11 digits")
    .regex(/^\d+$/, "SIM number must be digits only"),
});

export const pinSchema = z.object({
  pin: z
    .string()
    .min(4, "PIN must be 4 digits")
    .max(4, "PIN must be 4 digits")
    .regex(/^\d+$/, "PIN must be digits only"),
});