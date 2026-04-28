import { Type, Static } from "@sinclair/typebox";

export const CreatePlatSchema = Type.Object({
  nom: Type.String({ minLength: 2 }),
  description: Type.String(),
  prix: Type.Number({ minimum: 0 }),
  imageUrl: Type.Optional(Type.String({ format: "uri" })),
});

export const UpdatePlatSchema = Type.Partial(CreatePlatSchema);

export type CreatePlatRequest = Static<typeof CreatePlatSchema>;
export type UpdatePlatRequest = Static<typeof UpdatePlatSchema>;
