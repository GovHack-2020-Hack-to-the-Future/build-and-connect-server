import { messageByIdAsync } from './message-by-id.resolver';

export const queryResolvers = {
  messageById: messageByIdAsync,
};
