import { z } from "zod";

export const subnameTextSchema = z.object({
  key: z
    .string()
    .min(1, "Key must not be empty")
    .max(50, "Key must be less than 50 characters")
    .regex(
      /^[a-zA-Z0-9._-]+$/,
      "Key can only contain letters, numbers, dots, underscores, and hyphens",
    ),
  value: z
    .string()
    .min(1, "Value must not be empty")
    .max(255, "Value must be less than 255 characters"),
});

export const subnameAddressSchema = z.object({
  coin: z
    .number()
    .min(0, "Coin type must be non-negative")
    .max(9999, "Coin type must be less than 9999"),
  value: z
    .string()
    .min(1, "Address must not be empty")
    .max(255, "Address must be less than 255 characters")
    .regex(/^[a-fA-F0-9x]+$/, "Address must be a valid hexadecimal string"),
});

export const createSubnameSchema = z.object({
  parentName: z
    .string()
    .min(1, "Parent name must not be empty")
    .max(255, "Parent name must be less than 255 characters")
    .regex(/^[a-zA-Z0-9.-]+\.eth$/, "Parent name must be a valid .eth name"),
  label: z
    .string()
    .min(2, "Label must be at least 2 characters")
    .max(63, "Label must be less than 63 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Label can only contain lowercase letters, numbers, and hyphens",
    )
    .regex(
      /^[a-z0-9].*[a-z0-9]$/,
      "Label must start and end with a letter or number",
    ),
  contenthash: z
    .string()
    .regex(/^0x[a-fA-F0-9]+$/, "Contenthash must be a valid hexadecimal string")
    .optional(),
  subscriptionPackId: z.string(),
  texts: z.array(subnameTextSchema).max(50, "Maximum 50 text records allowed"),
  addresses: z
    .array(subnameAddressSchema)
    .max(20, "Maximum 20 address records allowed"),
  ensOwner: z.string().optional(),
});

export const updateSubnameSchema = z.object({
  contenthash: z
    .string()
    .regex(/^0x[a-fA-F0-9]+$/, "Contenthash must be a valid hexadecimal string")
    .optional(),
  texts: z
    .array(subnameTextSchema)
    .max(50, "Maximum 50 text records allowed")
    .optional(),
  addresses: z
    .array(subnameAddressSchema)
    .max(20, "Maximum 20 address records allowed")
    .optional(),
});
