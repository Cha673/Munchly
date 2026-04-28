import { Type, Static } from "@sinclair/typebox";

export const CreateRestaurantSchema = Type.Object({
  nom: Type.String({ minLength: 2 }),
  lieu: Type.String(),
  description: Type.String(),
  imageUrl: Type.Optional(Type.String({ format: "uri" })),
  ownerId: Type.String(),
});

export const UpdateRestaurantSchema = Type.Partial(
  Type.Object({
    nom: Type.String({ minLength: 2 }),
    lieu: Type.String(),
    description: Type.String(),
    imageUrl: Type.String({ format: "uri" }),
  }),
);

export type CreateRestaurantRequest = Static<typeof CreateRestaurantSchema>;
export type UpdateRestaurantRequest = Static<typeof UpdateRestaurantSchema>;
