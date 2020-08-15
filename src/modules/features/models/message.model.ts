import { Document, Schema } from 'mongoose';

export type MessageDocument = {
  description: string;
  title: string;
} & Document;

export const messageSchema = new Schema(
  {
    id: {
      type: String,
      index: true,
      required: true,
      trim: true,
      unique: true,
    },
    description: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
  },
  { id: false, strict: 'throw', timestamps: true }
);
