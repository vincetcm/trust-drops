// Everything transactions
import { IUpdateUser, IUser } from '@components/user/user.interface';
import config from '@config/config';
import amqp from 'amqplib/callback_api.js';
import { Web3 } from 'web3';
import {
  update
} from '@components/user/user.service';
const web3 = new Web3(process.env.HTTP_RPC_URL);

class TransactionsQueue {
  public queueApprovalTransaction(user: IUser) {
    try {
      amqp.connect(config.rabbitMqUrl, function (error, connection) {
        if (error) {
          throw error;
        }

        connection.createChannel(function (error1, channel) {
          if (error1) {
            throw error1;
          }

          var data = JSON.stringify(user);
          channel.assertQueue('approvalQueue', {
            durable: false,
          });

          channel.sendToQueue('approvalQueue', Buffer.from(data));
        });
      });
    } catch (error) {
      console.log(error);
    }
  }

  public async approveTx(user: IUser) {
    try {
      // mark complete on contract
      const abi = [
        {
          inputs: [
            {
              internalType: 'address',
              name: '_user',
              type: 'address',
            },
          ],
          name: 'approve',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ];
      const trustDropsContract = new web3.eth.Contract(
        abi,
        config.trustdropsContractAddress,
      );
      const adminAddress = web3.eth.accounts.privateKeyToAccount(
        config.adminKey,
      );
      const gas = await trustDropsContract.methods
        .approve(
          user.address,
          web3.utils.keccak256(web3.utils.utf8ToBytes(user.twitterId)),
        )
        .estimateGas({ from: adminAddress.address });
      const gasPrice = await web3.eth.getGasPrice();
      const encoded = trustDropsContract.methods
        .approve(user.address)
        .encodeABI();
      const tx = {
        gas: gas,
        gasPrice: gasPrice,
        to: process.env.BROKER_FACTORY_CONTRACT,
        data: encoded,
      };
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
    } catch (err) {
      console.log('Approval caught - ', err);
    }
  }

  public processTransactionsQueue() {
    amqp.connect(config.rabbitMqUrl, function (error, connection) {
      if (error) {
        throw error;
      }

      connection.createChannel(function (error1, channel) {
        if (error1) {
          throw error1;
        }

        channel.assertQueue('approvalQueue', {
          durable: false,
        });

        channel.consume(
          'approvalQueue',
          function (payload) {
            if (payload != null) {
              let user: IUser = JSON.parse(payload.content.toString());
              console.log('===== Receive =====');
              console.log(user);

              this.approveTx(user);
            }
          },
          {
            noAck: true,
          },
        );
      });
    });
  }
}

export default new TransactionsQueue();
