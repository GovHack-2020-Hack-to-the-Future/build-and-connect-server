import { Schema } from 'mongoose';

import { NodeDocument, nodeSchema } from '../../common/models/node.model';

export const userSchema = new Schema(
  {
    name: { type: String, trim: true },
    nickname: { type: String, trim: true },
    pictureUrl: { type: String, trim: true },
    ...nodeSchema.obj,
  },
  { id: false, strict: 'throw', timestamps: true }
);

export type UserDocument = {
  name?: string;
  nickname?: string;
  pictureUrl?: string;
} & NodeDocument;
