import { Category as GrpcCategory } from '@/grpc/__generated__/trip.js';

export const toPrismaCategory = (category: GrpcCategory | undefined) => {
  switch (category) {
    case GrpcCategory.TRANSPORTATION:
      return 'TRANSPORTATION';
    case GrpcCategory.ACCOMMODATION:
      return 'ACCOMMODATION';
    case GrpcCategory.ATTRACTION:
      return 'ATTRACTION';
    case GrpcCategory.FOOD:
      return 'FOOD';
    case GrpcCategory.ENTERTAINMENT:
      return 'ENTERTAINMENT';
    case GrpcCategory.OTHER:
    case GrpcCategory.CATEGORY_UNSPECIFIED:
    default:
      return 'OTHER';
  }
};

export const toGrpcCategory = (category: string | null | undefined): GrpcCategory => {
  switch (category) {
    case 'TRANSPORTATION':
      return GrpcCategory.TRANSPORTATION;
    case 'ACCOMMODATION':
      return GrpcCategory.ACCOMMODATION;
    case 'ATTRACTION':
      return GrpcCategory.ATTRACTION;
    case 'FOOD':
      return GrpcCategory.FOOD;
    case 'ENTERTAINMENT':
      return GrpcCategory.ENTERTAINMENT;
    case 'OTHER':
      return GrpcCategory.OTHER;
    default:
      return GrpcCategory.CATEGORY_UNSPECIFIED;
  }
};
