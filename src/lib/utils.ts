import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const zodSettingsFormSchema = () =>
  z
    .object({
      autoplay: z.boolean(),
      repeat: z.boolean(),
    })
    .partial();

const fs = zodSettingsFormSchema();
export const defaultSettings: z.infer<typeof fs> = {
  autoplay: false,
  repeat: false,
};
