import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const zodSettingsFormSchema = () =>
  z.object({
    autoplay: z.boolean().optional(),
    repeat: z.boolean().optional(),
    mode: z.enum(["light", "dark", "system"], {
      required_error: "You need to select a notification type.",
    }),
    // mode: z.union([
    //   z.literal("light"),
    //   z.literal("dark"),
    //   z.literal("system"),
    // ]),
  });

const fs = zodSettingsFormSchema();
export const defaultSettings: z.infer<typeof fs> = {
  autoplay: false,
  repeat: false,
  mode: "system",
};
