/**
 * Zod schemas for all user-submitted input.
 *
 * Non-negotiable #6: typed tools and Zod validation - every input that
 * could eventually reach a server action or an agent tool is validated
 * here first, client-side, with the SAME schema intended to be reused
 * server-side in the Cloudflare Functions layer (Day 2+) so validation
 * logic is never duplicated or drifted.
 */
import { z } from 'zod';

export const businessTypeSchema = z.enum([
  'Fashion',
  'Food',
  'Phone Accessories',
  'Digital Services',
  'Campus Sales',
  'Beauty',
  'Freelancing',
  'Other',
]);

export const businessGoalSchema = z.enum([
  'Make More Sales',
  'Start a Business',
  'Track Money Better',
  'Grow Online',
]);

export const onboardingSchema = z.object({
  fullName: z.string().trim().min(2, 'Enter at least 2 characters').max(60),
  businessName: z.string().trim().min(2, 'Give your business a name').max(60),
  businessType: businessTypeSchema,
  goal: businessGoalSchema,
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;

export const productSchema = z.object({
  name: z.string().trim().min(2, 'Enter a product name').max(80),
  qty: z.coerce.number().int().min(0, 'Quantity cannot be negative'),
  costPriceNaira: z.coerce.number().min(0, 'Cost price cannot be negative'),
  sellPriceNaira: z.coerce.number().min(0, 'Selling price cannot be negative'),
});

export type ProductInput = z.infer<typeof productSchema>;

export const saleSchema = z.object({
  customerName: z.string().trim().min(1, 'Enter a customer name').max(60),
  itemDescription: z.string().trim().min(1, 'Describe the item sold').max(120),
  totalNaira: z.coerce.number().min(0, 'Total cannot be negative'),
  paidNaira: z.coerce.number().min(0, 'Amount paid cannot be negative'),
});

export type SaleInput = z.infer<typeof saleSchema>;

export const freeTextSaleParseSchema = z.object({
  text: z.string().trim().min(3, 'Describe the sale, e.g. "Sold 2 shirts to Chioma for 12000, she paid 7000"'),
});

export const marketingPromptSchema = z.object({
  product: z.string().trim().min(1, 'Describe the product or offer').max(120),
  type: z.enum(['status', 'promo', 'countdown', 'followup', 'broadcast']),
});

export const ideaPromptSchema = z.object({
  idea: z.string().trim().min(5, 'Describe your hustle idea in a sentence or two').max(500),
});

/** Validate and return a typed result instead of throwing, for form UIs. */
export function safeValidate<T>(
  schema: z.ZodType<T>,
  value: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(value);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = issue.path.join('.') || '_root';
    if (!errors[key]) errors[key] = issue.message;
  }
  return { success: false, errors };
}
