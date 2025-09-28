import { gql } from "graphql-tag";
import { tripTypeDefs } from "./trip/trip.schema.js";
const baseTypeDefs = gql`
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
  type Subscription {
    _empty: String
  }
`;

export const typeDefs = [baseTypeDefs, tripTypeDefs];
