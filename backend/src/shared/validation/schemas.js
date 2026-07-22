import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1).max(200),
});

export const kitchenLoginSchema = z.object({
  employeeId: z.string().trim().min(1).max(50),
  password: z.string().min(1).max(200),
});

const orderItemSchema = z.object({
  menuItem: z.string().optional(),
  productId: z.string().optional(),
  id: z.string().optional(),
  _id: z.string().optional(),
  quantity: z.coerce.number().int().min(1).max(100).optional(),
  qty: z.coerce.number().int().min(1).max(100).optional(),
}).refine((item) => item.menuItem || item.productId || item.id || item._id, "Menu item is required");

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1).max(100),
  tableNo: z.coerce.number().int().positive().nullable().optional(),
  note: z.string().max(500).optional(),
});

export const orderStatusSchema = z.object({
  status: z.enum(["pending", "preparing", "ready", "served", "cancelled"]),
});

export const createReviewSchema = z.object({
  orderId: z.string().min(1),
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().max(1200).optional(),
  anonymous: z.union([z.boolean(), z.string()]).optional(),
  selectedItems: z.union([z.array(z.unknown()), z.string()]).optional(),
});
