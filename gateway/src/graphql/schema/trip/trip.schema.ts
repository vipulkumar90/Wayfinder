import { gql } from "graphql-tag";

export const tripTypeDefs = gql`
  scalar DateTime

  enum Category {
    CATEGORY_UNSPECIFIED
    TRANSPORTATION
    ACCOMMODATION
    ATTRACTION
    FOOD
    ENTERTAINMENT
    OTHER
  }

  type Trip {
    id: ID!
    title: String
    destination: String!
    startDate: DateTime
    endDate: DateTime
    budget: Float!
    currency: String!
    createdAt: DateTime
    updatedAt: DateTime
  }

  type TripConnection {
    items: [Trip!]!
    nextPageToken: String
  }

  type Event {
    id: ID!
    tripId: ID!
    title: String!
    startTime: DateTime
    endTime: DateTime
    locationName: String
    locationLat: Float
    locationLng: Float
    cost: Float
    category: Category!
    notes: String
    createdAt: DateTime
    updatedAt: DateTime
  }

  type TimelineDay {
    date: DateTime!
    events: [Event!]!
  }

  type Timeline {
    days: [TimelineDay!]!
  }

  type MapPoint {
    eventId: ID!
    title: String!
    lat: Float!
    lng: Float!
    order: Int!
  }

  type MapDay {
    date: DateTime!
    points: [MapPoint!]!
  }

  type MapView {
    days: [MapDay!]!
  }

  type BudgetCategoryBreakdown {
    category: String!
    amount: Float!
  }

  type BudgetSummary {
    tripId: ID!
    totalBudget: Float!
    amountSpent: Float!
    remaining: Float!
    spentByCategory: [BudgetCategoryBreakdown!]!
  }

  type DeleteResponse {
    success: Boolean!
  }

  input CreateTripInput {
    title: String
    destination: String!
    startDate: DateTime!
    endDate: DateTime!
    budget: Float!
    currency: String!
  }

  input UpdateTripInput {
    title: String
    destination: String
    startDate: DateTime
    endDate: DateTime
    budget: Float
    currency: String
  }

  input CreateEventInput {
    tripId: ID!
    title: String!
    startTime: DateTime!
    endTime: DateTime
    locationName: String
    locationLat: Float
    locationLng: Float
    cost: Float
    category: Category
    notes: String
  }

  input UpdateEventInput {
    title: String
    startTime: DateTime
    endTime: DateTime
    locationName: String
    locationLat: Float
    locationLng: Float
    cost: Float
    category: Category
    notes: String
  }

  extend type Query {
    trip(id: ID!): Trip @auth
    trips(pageSize: Int, pageToken: String): TripConnection! @auth
    event(id: ID!): Event @auth
    events(tripId: ID!, fromDate: DateTime, toDate: DateTime): [Event!]! @auth
    timeline(tripId: ID!, fromDate: DateTime, toDate: DateTime): Timeline! @auth
    mapView(tripId: ID!, date: DateTime): MapView! @auth
    budget(tripId: ID!): BudgetSummary! @auth
  }

  extend type Mutation {
    createTrip(input: CreateTripInput!): Trip! @auth
    updateTrip(id: ID!, input: UpdateTripInput!): Trip! @auth
    deleteTrip(id: ID!): DeleteResponse! @auth

    createEvent(input: CreateEventInput!): Event! @auth
    updateEvent(id: ID!, input: UpdateEventInput!): Event! @auth
    deleteEvent(id: ID!): DeleteResponse! @auth
  }
`;
