import type { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import type { MyContext } from '@/types/index.js';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: string; output: string; }
};

export type BudgetCategoryBreakdown = {
  __typename?: 'BudgetCategoryBreakdown';
  amount: Scalars['Float']['output'];
  category: Scalars['String']['output'];
};

export type BudgetSummary = {
  __typename?: 'BudgetSummary';
  amountSpent: Scalars['Float']['output'];
  remaining: Scalars['Float']['output'];
  spentByCategory: Array<BudgetCategoryBreakdown>;
  totalBudget: Scalars['Float']['output'];
  tripId: Scalars['ID']['output'];
};

export type Category =
  | 'ACCOMMODATION'
  | 'ATTRACTION'
  | 'CATEGORY_UNSPECIFIED'
  | 'ENTERTAINMENT'
  | 'FOOD'
  | 'OTHER'
  | 'TRANSPORTATION';

/** A generic connection type, conforming to the Relay Cursor Connections Specification. */
export type Connection = {
  edges: Array<Edge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type CreateEventInput = {
  category?: InputMaybe<Category>;
  cost?: InputMaybe<Scalars['Float']['input']>;
  endTime?: InputMaybe<Scalars['DateTime']['input']>;
  locationLat?: InputMaybe<Scalars['Float']['input']>;
  locationLng?: InputMaybe<Scalars['Float']['input']>;
  locationName?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  startTime: Scalars['DateTime']['input'];
  title: Scalars['String']['input'];
  tripId: Scalars['ID']['input'];
};

export type CreateTripInput = {
  budget: Scalars['Float']['input'];
  currency: Scalars['String']['input'];
  destination: Scalars['String']['input'];
  endDate: Scalars['DateTime']['input'];
  startDate: Scalars['DateTime']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};

export type DeleteResponse = {
  __typename?: 'DeleteResponse';
  success: Scalars['Boolean']['output'];
};

/** Represents a single "edge" in a connection, connecting a node to a cursor. */
export type Edge = {
  cursor: Scalars['ID']['output'];
};

export type Event = {
  __typename?: 'Event';
  category: Category;
  cost?: Maybe<Scalars['Float']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  endTime?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  locationLat?: Maybe<Scalars['Float']['output']>;
  locationLng?: Maybe<Scalars['Float']['output']>;
  locationName?: Maybe<Scalars['String']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  startTime?: Maybe<Scalars['DateTime']['output']>;
  title: Scalars['String']['output'];
  tripId: Scalars['ID']['output'];
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

/**
 * A standard response for mutations that don't return a specific object.
 * Indicates the success status and provides a user-friendly message.
 */
export type GenericResponse = {
  __typename?: 'GenericResponse';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type MapDay = {
  __typename?: 'MapDay';
  date: Scalars['DateTime']['output'];
  points: Array<MapPoint>;
};

export type MapPoint = {
  __typename?: 'MapPoint';
  eventId: Scalars['ID']['output'];
  lat: Scalars['Float']['output'];
  lng: Scalars['Float']['output'];
  order: Scalars['Int']['output'];
  title: Scalars['String']['output'];
};

export type MapView = {
  __typename?: 'MapView';
  days: Array<MapDay>;
};

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']['output']>;
  createEvent: Event;
  createTrip: Trip;
  deleteEvent: DeleteResponse;
  deleteTrip: DeleteResponse;
  updateEvent: Event;
  updateTrip: Trip;
};


export type MutationCreateEventArgs = {
  input: CreateEventInput;
};


export type MutationCreateTripArgs = {
  input: CreateTripInput;
};


export type MutationDeleteEventArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTripArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateEventArgs = {
  id: Scalars['ID']['input'];
  input: UpdateEventInput;
};


export type MutationUpdateTripArgs = {
  id: Scalars['ID']['input'];
  input: UpdateTripInput;
};

/** Contians information about page in a connection */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** The cursor of the last edge in the connection. */
  endCursor?: Maybe<Scalars['String']['output']>;
  /** Indicates if there are more pages when paginating forwards. */
  hasNextPage: Scalars['Boolean']['output'];
};

export type Query = {
  __typename?: 'Query';
  _empty?: Maybe<Scalars['String']['output']>;
  budget: BudgetSummary;
  event?: Maybe<Event>;
  events: Array<Event>;
  mapView: MapView;
  timeline: Timeline;
  trip?: Maybe<Trip>;
  trips: TripConnection;
};


export type QueryBudgetArgs = {
  tripId: Scalars['ID']['input'];
};


export type QueryEventArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEventsArgs = {
  fromDate?: InputMaybe<Scalars['DateTime']['input']>;
  toDate?: InputMaybe<Scalars['DateTime']['input']>;
  tripId: Scalars['ID']['input'];
};


export type QueryMapViewArgs = {
  date?: InputMaybe<Scalars['DateTime']['input']>;
  tripId: Scalars['ID']['input'];
};


export type QueryTimelineArgs = {
  fromDate?: InputMaybe<Scalars['DateTime']['input']>;
  toDate?: InputMaybe<Scalars['DateTime']['input']>;
  tripId: Scalars['ID']['input'];
};


export type QueryTripArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTripsArgs = {
  pageSize?: InputMaybe<Scalars['Int']['input']>;
  pageToken?: InputMaybe<Scalars['String']['input']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  _empty?: Maybe<Scalars['String']['output']>;
};

export type Timeline = {
  __typename?: 'Timeline';
  days: Array<TimelineDay>;
};

export type TimelineDay = {
  __typename?: 'TimelineDay';
  date: Scalars['DateTime']['output'];
  events: Array<Event>;
};

export type Trip = {
  __typename?: 'Trip';
  budget: Scalars['Float']['output'];
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  currency: Scalars['String']['output'];
  destination: Scalars['String']['output'];
  endDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  startDate?: Maybe<Scalars['DateTime']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type TripConnection = {
  __typename?: 'TripConnection';
  items: Array<Trip>;
  nextPageToken?: Maybe<Scalars['String']['output']>;
};

export type UpdateEventInput = {
  category?: InputMaybe<Category>;
  cost?: InputMaybe<Scalars['Float']['input']>;
  endTime?: InputMaybe<Scalars['DateTime']['input']>;
  locationLat?: InputMaybe<Scalars['Float']['input']>;
  locationLng?: InputMaybe<Scalars['Float']['input']>;
  locationName?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  startTime?: InputMaybe<Scalars['DateTime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateTripInput = {
  budget?: InputMaybe<Scalars['Float']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  destination?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;




/** Mapping of interface types */
export type ResolversInterfaceTypes<_RefType extends Record<string, unknown>> = {
  Connection: never;
  Edge: never;
};

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  BudgetCategoryBreakdown: ResolverTypeWrapper<BudgetCategoryBreakdown>;
  BudgetSummary: ResolverTypeWrapper<BudgetSummary>;
  Category: Category;
  Connection: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Connection']>;
  CreateEventInput: CreateEventInput;
  CreateTripInput: CreateTripInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  DeleteResponse: ResolverTypeWrapper<DeleteResponse>;
  Edge: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Edge']>;
  Event: ResolverTypeWrapper<Event>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  GenericResponse: ResolverTypeWrapper<GenericResponse>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  MapDay: ResolverTypeWrapper<MapDay>;
  MapPoint: ResolverTypeWrapper<MapPoint>;
  MapView: ResolverTypeWrapper<MapView>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subscription: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Timeline: ResolverTypeWrapper<Timeline>;
  TimelineDay: ResolverTypeWrapper<TimelineDay>;
  Trip: ResolverTypeWrapper<Trip>;
  TripConnection: ResolverTypeWrapper<TripConnection>;
  UpdateEventInput: UpdateEventInput;
  UpdateTripInput: UpdateTripInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  BudgetCategoryBreakdown: BudgetCategoryBreakdown;
  BudgetSummary: BudgetSummary;
  Connection: ResolversInterfaceTypes<ResolversParentTypes>['Connection'];
  CreateEventInput: CreateEventInput;
  CreateTripInput: CreateTripInput;
  DateTime: Scalars['DateTime']['output'];
  DeleteResponse: DeleteResponse;
  Edge: ResolversInterfaceTypes<ResolversParentTypes>['Edge'];
  Event: Event;
  Float: Scalars['Float']['output'];
  GenericResponse: GenericResponse;
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  MapDay: MapDay;
  MapPoint: MapPoint;
  MapView: MapView;
  Mutation: Record<PropertyKey, never>;
  PageInfo: PageInfo;
  Query: Record<PropertyKey, never>;
  String: Scalars['String']['output'];
  Subscription: Record<PropertyKey, never>;
  Timeline: Timeline;
  TimelineDay: TimelineDay;
  Trip: Trip;
  TripConnection: TripConnection;
  UpdateEventInput: UpdateEventInput;
  UpdateTripInput: UpdateTripInput;
};

export type AuthDirectiveArgs = { };

export type AuthDirectiveResolver<Result, Parent, ContextType = MyContext, Args = AuthDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type BudgetCategoryBreakdownResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['BudgetCategoryBreakdown'] = ResolversParentTypes['BudgetCategoryBreakdown']> = {
  amount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  category?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type BudgetSummaryResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['BudgetSummary'] = ResolversParentTypes['BudgetSummary']> = {
  amountSpent?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  remaining?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  spentByCategory?: Resolver<Array<ResolversTypes['BudgetCategoryBreakdown']>, ParentType, ContextType>;
  totalBudget?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  tripId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type ConnectionResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['Connection'] = ResolversParentTypes['Connection']> = {
  __resolveType: TypeResolveFn<null, ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DeleteResponseResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['DeleteResponse'] = ResolversParentTypes['DeleteResponse']> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type EdgeResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['Edge'] = ResolversParentTypes['Edge']> = {
  __resolveType: TypeResolveFn<null, ParentType, ContextType>;
};

export type EventResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['Event'] = ResolversParentTypes['Event']> = {
  category?: Resolver<ResolversTypes['Category'], ParentType, ContextType>;
  cost?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  endTime?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  locationLat?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  locationLng?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  locationName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  startTime?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tripId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
};

export type GenericResponseResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['GenericResponse'] = ResolversParentTypes['GenericResponse']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type MapDayResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['MapDay'] = ResolversParentTypes['MapDay']> = {
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  points?: Resolver<Array<ResolversTypes['MapPoint']>, ParentType, ContextType>;
};

export type MapPointResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['MapPoint'] = ResolversParentTypes['MapPoint']> = {
  eventId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lat?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  lng?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  order?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type MapViewResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['MapView'] = ResolversParentTypes['MapView']> = {
  days?: Resolver<Array<ResolversTypes['MapDay']>, ParentType, ContextType>;
};

export type MutationResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createEvent?: Resolver<ResolversTypes['Event'], ParentType, ContextType, RequireFields<MutationCreateEventArgs, 'input'>>;
  createTrip?: Resolver<ResolversTypes['Trip'], ParentType, ContextType, RequireFields<MutationCreateTripArgs, 'input'>>;
  deleteEvent?: Resolver<ResolversTypes['DeleteResponse'], ParentType, ContextType, RequireFields<MutationDeleteEventArgs, 'id'>>;
  deleteTrip?: Resolver<ResolversTypes['DeleteResponse'], ParentType, ContextType, RequireFields<MutationDeleteTripArgs, 'id'>>;
  updateEvent?: Resolver<ResolversTypes['Event'], ParentType, ContextType, RequireFields<MutationUpdateEventArgs, 'id' | 'input'>>;
  updateTrip?: Resolver<ResolversTypes['Trip'], ParentType, ContextType, RequireFields<MutationUpdateTripArgs, 'id' | 'input'>>;
};

export type PageInfoResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = {
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type QueryResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  _empty?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  budget?: Resolver<ResolversTypes['BudgetSummary'], ParentType, ContextType, RequireFields<QueryBudgetArgs, 'tripId'>>;
  event?: Resolver<Maybe<ResolversTypes['Event']>, ParentType, ContextType, RequireFields<QueryEventArgs, 'id'>>;
  events?: Resolver<Array<ResolversTypes['Event']>, ParentType, ContextType, RequireFields<QueryEventsArgs, 'tripId'>>;
  mapView?: Resolver<ResolversTypes['MapView'], ParentType, ContextType, RequireFields<QueryMapViewArgs, 'tripId'>>;
  timeline?: Resolver<ResolversTypes['Timeline'], ParentType, ContextType, RequireFields<QueryTimelineArgs, 'tripId'>>;
  trip?: Resolver<Maybe<ResolversTypes['Trip']>, ParentType, ContextType, RequireFields<QueryTripArgs, 'id'>>;
  trips?: Resolver<ResolversTypes['TripConnection'], ParentType, ContextType, Partial<QueryTripsArgs>>;
};

export type SubscriptionResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  _empty?: SubscriptionResolver<Maybe<ResolversTypes['String']>, "_empty", ParentType, ContextType>;
};

export type TimelineResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['Timeline'] = ResolversParentTypes['Timeline']> = {
  days?: Resolver<Array<ResolversTypes['TimelineDay']>, ParentType, ContextType>;
};

export type TimelineDayResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['TimelineDay'] = ResolversParentTypes['TimelineDay']> = {
  date?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  events?: Resolver<Array<ResolversTypes['Event']>, ParentType, ContextType>;
};

export type TripResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['Trip'] = ResolversParentTypes['Trip']> = {
  budget?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  currency?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  destination?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  endDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  startDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
};

export type TripConnectionResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['TripConnection'] = ResolversParentTypes['TripConnection']> = {
  items?: Resolver<Array<ResolversTypes['Trip']>, ParentType, ContextType>;
  nextPageToken?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type Resolvers<ContextType = MyContext> = {
  BudgetCategoryBreakdown?: BudgetCategoryBreakdownResolvers<ContextType>;
  BudgetSummary?: BudgetSummaryResolvers<ContextType>;
  Connection?: ConnectionResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  DeleteResponse?: DeleteResponseResolvers<ContextType>;
  Edge?: EdgeResolvers<ContextType>;
  Event?: EventResolvers<ContextType>;
  GenericResponse?: GenericResponseResolvers<ContextType>;
  MapDay?: MapDayResolvers<ContextType>;
  MapPoint?: MapPointResolvers<ContextType>;
  MapView?: MapViewResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Timeline?: TimelineResolvers<ContextType>;
  TimelineDay?: TimelineDayResolvers<ContextType>;
  Trip?: TripResolvers<ContextType>;
  TripConnection?: TripConnectionResolvers<ContextType>;
};

export type DirectiveResolvers<ContextType = MyContext> = {
  auth?: AuthDirectiveResolver<any, any, ContextType>;
};
