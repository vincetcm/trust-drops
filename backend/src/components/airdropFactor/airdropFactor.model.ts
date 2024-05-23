import mongoose from 'mongoose';
import { IAirdropFactor } from './airdropFactor.interface';

const airdropFactorSchema = new mongoose.Schema<IAirdropFactor>({
  k: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  n: { type: Number, default: 0 },
});

const AirdropFactorModel = mongoose.model<IAirdropFactor>('AirdropFactor', airdropFactorSchema);

// eslint-disable-next-line import/prefer-default-export
export { AirdropFactorModel };
