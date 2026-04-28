export const restaurantSchema = `
  type Dish {
    id: String!
    nom: String!
    description: String!
    prix: Float!
    imageUrl: String!
  }

  type OrderItem {
    id: String!
    quantite: Int!
    prixUnitaire: Float
  }

  type Order {
    id: String!
    total: Float!
    status: String!
    createdAt: String!
    items: [OrderItem!]!
  }

  type Restaurant {
    id: String!
    nom: String!
    lieu: String!
    description: String!
    imageUrl: String!
    dishes: [Dish!]!
  }

  type Query {
    restaurants: [Restaurant!]!
    restaurant(id: String!): Restaurant
  }
`;
