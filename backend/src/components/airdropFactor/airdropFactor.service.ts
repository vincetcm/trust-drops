import { AirdropFactorModel } from '@components/airdropFactor/airdropFactor.model';
import { IAirdropFactor } from '@components/airdropFactor/airdropFactor.interface';

const create = async (airdropFactor: IAirdropFactor): Promise<boolean> => {
  try {
    await AirdropFactorModel.create(airdropFactor);
    console.log("AirdropFactor created");
    return true;
  } catch (err) {
    console.log(`AirdropFactor create err: %O`, err.message);
  }
};

const readLatest = async (): Promise<IAirdropFactor> => {
  const airdropFactor = await AirdropFactorModel.find().limit(1).sort({$natural:-1})
  return airdropFactor[0] as IAirdropFactor;
};

export {
  create,
  readLatest,
};
