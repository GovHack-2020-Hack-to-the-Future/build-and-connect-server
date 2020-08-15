import {
  DateTimeResolver,
  UnsignedFloatResolver,
  UnsignedIntResolver,
  URLResolver,
} from 'graphql-scalars';

export const scalarResolvers = {
  DateTime: DateTimeResolver,
  UnsignedFloat: UnsignedFloatResolver,
  UnsignedInt: UnsignedIntResolver,
  URL: URLResolver,
};
