// Everything transactions
import { IUpdateUser, IUser } from '@components/user/user.interface';
import config from '@config/config';
import amqp from 'amqplib';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils'
import {
  update
} from '@components/user/user.service';
const web3 = new Web3(process.env.HTTP_RPC_URL);

class TransactionsQueue {
  public channel: any;
  public connection: any;

  public async connectQueue() {   
    try {
        this.connection = await amqp.connect(config.rabbitMqUrl);
        this.channel = await this.connection.createChannel();
        this.channel.prefetch(1)
        await this.channel.assertQueue("approvalQueue");
    } catch (error) {
        console.log(error)
    }
  }

  public async queueApprovalTransaction(user: IUser) {
    try {
      var data = JSON.stringify(user);
      await this.channel.sendToQueue('approvalQueue', Buffer.from(data));
    } catch (error) {
      console.log(error);
    }
  }

  public async processTransactionsQueue() {
    if (!this.channel) {
      await this.connectQueue();
    }

    await this.channel.assertQueue('approvalQueue');

    this.channel.consume(
      'approvalQueue',
      async function (payload) {
        if (payload != null) {
          let user: IUser = JSON.parse(payload.content.toString());
          console.log('===== Receive =====');
          console.log(user);

          const abi = [
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "_user",
                  "type": "address"
                },
                {
                  "internalType": "bytes32",
                  "name": "_id",
                  "type": "bytes32"
                }
              ],
              "name": "approve",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
          ];
          const trustDropsContract = new web3.eth.Contract(
            abi as AbiItem[],
            config.trustdropsContractAddress,
          );
          const adminAddress = web3.eth.accounts.privateKeyToAccount(
            config.adminKey,
          );
          try {
            const gas = await trustDropsContract.methods
              .approve(
                user.address,
                web3.utils.keccak256(user.twitterId),
              )
              .estimateGas({ from: adminAddress.address });
            const encoded = trustDropsContract.methods
              .approve(user.address, web3.utils.keccak256(user.twitterId))
              .encodeABI();
            const tx = {
              gas: gas,
              gasPrice: 50000000000,
              to: config.trustdropsContractAddress,
              data: encoded,
              from: adminAddress.address,
            };
            console.log(tx);
            const signed = await web3.eth.accounts.signTransaction(
              tx,
              config.adminKey,
            );
            await web3.eth
              .sendSignedTransaction(signed.rawTransaction)
              .on('receipt', async (receipt) => {
                console.log('Approval receipt - ', receipt);
                update(user, {approved: true} as IUpdateUser);
              })
              .on('error', async (err) => {
                console.log('Approval failure - ', err);
              });
          } catch(error) {
            console.log("errored for user - ", user, error);
          }
        }
      },
      {
        noAck: true,
      },
    );
  }
}

export default new TransactionsQueue();
