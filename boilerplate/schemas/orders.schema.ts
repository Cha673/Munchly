import { Type, Static } from "@sinclair/typebox";

export const CreateOrderSchema = Type.Object({
  restaurantId: Type.String(),
  items: Type.Array(
    Type.Object({
      platId: Type.String(),
      quantite: Type.Integer({ minimum: 1 }),
    }),
    { minItems: 1 }
  ),
});

export const UpdateOrderStatusSchema = Type.Object({
  status: Type.Union([
    Type.Literal("PENDING"),
    Type.Literal("CONFIRMED"),
    Type.Literal("SHIPPED"),
    Type.Literal("DELIVERED"),
  ]),
});

export type CreateOrderRequest = Static<typeof CreateOrderSchema>;
export type UpdateOrderStatusRequest = Static<typeof UpdateOrderStatusSchema>;
