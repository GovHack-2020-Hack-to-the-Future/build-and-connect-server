import { Document, Schema } from 'mongoose';

export type NodeDocument = Document;

export const nodeSchema = new Schema(
  {
    id: {
      type: String,
      index: true,
      required: true,
      trim: true,
      unique: true,
    },
  },
  { _id: false }
);
