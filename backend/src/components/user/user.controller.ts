import { Request, Response } from 'express';
import httpStatus from 'http-status';
import {
  create,
  read,
  authClient,
  twitterClient,
  isSignatureValid,
  queueApproval,
} from '@components/user/user.service';
import { IUser } from '@components/user/user.interface';
const STATE = 'trustdrops';

const readUser = async (req: Request, res: Response) => {
  res.status(httpStatus.OK);
  res.send({ message: 'Read', output: await read(req.params.id) });
};

const getUserOauthUrl = async (req: Request, res: Response) => {
  const authUrl = authClient.generateAuthURL({
    state: STATE,
    code_challenge_method: 's256',
  });
  res.redirect(authUrl);
};

const twitterCallback = async (req: Request, res: Response) => {
  const { code, state } = req.query;
  if (state !== STATE) return res.status(500).send("State isn't matching");
  res.send({ code: code });
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

    await authClient.requestAccessToken(code as string);
    const userData = await twitterClient.users.findMyUser();
    console.log('userData - ', userData);

    const user = {
      address,
      signature,
      twitterId: userData.data.id,
    } as IUser;
    await create(user);

    queueApproval(user);

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
