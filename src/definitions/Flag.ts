import { object, boolean, string, record, z } from "zod";

export const FlagSchema = object({
    value: boolean(),
    default: boolean(),
    description: string(),
});

export const FlagMapSchema = record(string(), FlagSchema.optional())

export type Flag = z.infer<typeof FlagSchema>;
export type FlagMap = z.infer<typeof FlagMapSchema>;
