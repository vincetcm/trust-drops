import { Request, Response } from 'express';
import httpStatus from 'http-status';
import {
  create,
  read,
  update,
  authClient,
  twitterClient,
  isSignatureValid,
  queueApproval,
} from '@components/user/user.service';
import { IUser } from '@components/user/user.interface';
import config from '@config/config';
const STATE = 'trustdrops';
const CODE_CHALLENGE= 'a543d136-2cc0-4651-b571-e972bf116556';

const readUser = async (req: Request, res: Response) => {
  res.status(httpStatus.OK);
  res.send({ message: 'Read', output: await read(req.params.address) });
};

const getUserOauthUrl = async (req: Request, res: Response) => {
  const authUrl = authClient.generateAuthURL({
    state: STATE,
    code_challenge_method: 'plain',
    code_challenge: CODE_CHALLENGE
  });
  res.send({ url: authUrl });
};

const twitterCallback = async (req: Request, res: Response) => {
  const { code, state } = req.query;
  if (state !== STATE) return res.status(500).send("State isn't matching");
  res.redirect(`${config.uiEndpoint}/airdrop?twitterAuthCode=${code}`);
};

const queueTest = async (req: Request, res: Response) => {
  const user = {
    address: (Math.random() + 1).toString(36).substring(7),
    signature: (Math.random() + 1).toString(36).substring(7),
    twitterId: (Math.random() + 1).toString(36).substring(7),
  } as IUser;
  await create(user);
  queueApproval(user);
  res.send({ message: 'queued' });
};

const linkUserTwitter = async (req: Request, res: Response) => {
  try {
    const { code, address, signature } = req.body;

    if (!isSignatureValid(address as string, signature as string)) {
      return res.send({ error: 'Signature invalid!' });
    }
    authClient.generateAuthURL({
      state: STATE,
      code_challenge_method: 'plain',
      code_challenge: CODE_CHALLENGE
    });
    await authClient.requestAccessToken(code as string);
    const userData = await twitterClient.users.findMyUser();
    console.log('userData - ', userData);

    const user = {
      address,
      signature,
      twitterId: userData.data.id,
    } as IUser;
    const dbUser = await read(address);
    try {
      if (dbUser) {
        await update(dbUser, {twitterId: userData.data.id})
      } else {
        await create(user);
      }
      queueApproval(user);
    } catch (err) {
      res.status(httpStatus.BAD_REQUEST).send({ message: 'Twitter already linked to some other wallet' });
      return;
    }


    res.status(httpStatus.OK);
    res.send({ message: 'Linked' });
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};

export {
  readUser,
  getUserOauthUrl,
  twitterCallback,
  linkUserTwitter,
  queueTest,
};
