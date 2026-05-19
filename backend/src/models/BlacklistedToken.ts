import mongoose, { Schema, type HydratedDocument } from "mongoose";

export interface IBlacklistedToken {
  tokenHash: string;
  expiresAt: Date;
}

export type BlacklistedTokenDoc = HydratedDocument<IBlacklistedToken>;

const blacklistedTokenSchema = new Schema<IBlacklistedToken>(
  {
    tokenHash: { type: String, required: true, unique: true, index: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: false }
);

blacklistedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const BlacklistedToken = mongoose.model<IBlacklistedToken>(
  "BlacklistedToken",
  blacklistedTokenSchema
);
