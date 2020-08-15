import { isAuthenticated } from '../shared/resolver-guards';

export const resolversComposition = {
  'Mutation.signIn': [isAuthenticated()],
};
