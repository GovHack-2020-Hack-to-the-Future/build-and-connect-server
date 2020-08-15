import { ModuleContext } from '@graphql-modules/core';
import { GraphQLResolveInfo } from 'graphql';

import { MessageDocument } from '../../models/message.model';
import { FeaturesProvider } from '../../providers/features.provider';
import {
  ResolverFn,
  QueryMessageByIdArgs,
} from '../../../../graphql-codegen-types';

type Args = QueryMessageByIdArgs;
type Parent = any;
type Result = MessageDocument | null;

export const messageByIdAsync: ResolverFn<
  Result,
  Parent,
  ModuleContext,
  Args
> = async (
  parent: Parent,
  { id }: Args,
  { injector }: ModuleContext,
  { cacheControl }: GraphQLResolveInfo
): Promise<Result> => {
  return injector
    .get(FeaturesProvider)
    .getMessageByIdAsync(id, { ttl: cacheControl.cacheHint.maxAge });
};
