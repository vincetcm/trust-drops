import { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import trustdropABI from '../abis/trustdropABI.json';
import daoTokenABI from '../abis/erc20ABI.json';
import {
  createLightNode,
  createDecoder,
  createEncoder,
  waitForRemotePeer,
  Protocols,
} from "@waku/sdk"
import protobuf from 'protobufjs';
import { PageDirection } from "@waku/sdk";

const DataContext = createContext();

const ContentTopic = `/trustdrops/debug5/proto`
const Encoder = createEncoder({ contentTopic: ContentTopic })
const decoder = createDecoder(ContentTopic)

// Create a message structure using Protobuf
const ChatMessage = new protobuf.Type("ChatMessage")
  .add(new protobuf.Field("timestamp", 1, "uint64"))
  .add(new protobuf.Field("type", 2, "string"))
  .add(new protobuf.Field("from", 3, "string"))
  .add(new protobuf.Field("to", 4, "string"))
  .add(new protobuf.Field("amount", 5, "string"));

const DataProvider = ({ children }) => {
  const [accountAddress, setAccountAddress] = useState('');
  const [stakedAmount, setStakedAmount] = useState(0);
  const [stakedOnAddress, setStakedOnAddress] = useState('');

  const [feedItems, setFeedItems] = useState([]);

  const [waku, setWaku] = useState(undefined)
  const [wakuStatus, setWakuStatus] = useState("None")

  const [messages, setMessages] = useState([]);

  console.log('DataProvider');

  const contractABI = trustdropABI.abi
  const CONTRACT_ADDRESS = "0x02dbD309e070d88e4EA9A18bc59b9b31ECDCDFD0"

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

  const erc20ABI = daoTokenABI.abi
  const erc20Address = "0xeb8E96B5cf725a76C5B579BeCA8aD027A6769513"
  const erc20Contract = new ethers.Contract(erc20Address, erc20ABI, signer);

  function decodeMessage(wakuMessage) {
    if (!wakuMessage.payload) return

    const {
      timestamp,
      from,
      to,
      type,
      amount
    } = ChatMessage.decode(
      wakuMessage.payload
    )

    if (!timestamp || !from || !to || !type || !amount) return

    const time = new Date()
    time.setTime(Number(timestamp))

    // const utf8Text = bytesToUtf8(text);

    return {
      timestamp: timestamp,
      from: from,
      to: to,
      type: type,
      amount: amount
    }
  }

  // Send the message using Light Push
  async function sendMessage(messageType, stakeForAddress, stakeAmount) {
    const timestamp = new Date()
    const time = timestamp.getTime()

    console.log('Sending message', time, accountAddress, stakeForAddress, stakeAmount)

    // Encode to protobuf
    const protoMsg = ChatMessage.create({
      timestamp: time,
      from: accountAddress,
      type: messageType,
      to: stakeForAddress,
      amount: messageType !== 'winked' ? stakeAmount : 'na',
    })
    const serialisedMessage = ChatMessage.encode(protoMsg).finish()

    // Send the message using Light Push
    const res = await waku.lightPush.send(Encoder, {
      payload: serialisedMessage,
    });
    console.log('Message sent', res)
  }

  const fetchMessages = async () => {
    // const startTime = new Date()
    // // 7 days/week, 24 hours/day, 60min/hour, 60secs/min, 100ms/sec
    // startTime.setTime(startTime.getTime() - 7 * 24 * 60 * 60 * 1000)

    await new Promise((resolve) => setTimeout(resolve, 200))

    try {
      for await (const messagesPromises of waku.store.queryGenerator(
        [decoder],
        {
          pageDirection: PageDirection.BACKWARD,
        }
      )) {
        const messages = await Promise.all(
          messagesPromises.map(async (p) => {
            const msg = await p
            return decodeMessage(msg)
          })
        )

        console.log({ messages })
        const filteredData = messages.filter(item => item !== null && item !== undefined);
        const feed = filteredData.map(msg => {
          if (msg !== undefined)
            return {
              type: msg.type,
              from: msg.from,
              to: msg.to
            }
        })

        console.log('feed', feed)

        // concatenate the feed items
        setFeedItems((currentFeedItems) => {
          return currentFeedItems.concat(feed.filter(Boolean).reverse())
        })

        setMessages((currentMessages) => {
          return currentMessages.concat(messages.filter(Boolean).reverse())
        })
      }
    } catch (e) {
      console.log("Failed to retrieve messages", e)
      setWakuStatus("Error Encountered")
    }

  }

  useEffect(() => {
    console.log('Waku setup')
    if (wakuStatus !== "None") return

    setWakuStatus("Starting")
    console.log('Waku status', wakuStatus)

    createLightNode({ defaultBootstrap: true }).then((waku) => {
      waku.start().then(() => {
        setWaku(waku)
        setWakuStatus("Connecting")
      })
    })
  }, [waku, wakuStatus])

  useEffect(() => {
    if (!waku) return
    console.log('waku 2')
    // We do not handle disconnection/re-connection in this example
    if (wakuStatus === "Connected") return

    waitForRemotePeer(waku, [
      Protocols.LightPush,
      Protocols.Filter,
      Protocols.Store,
    ]).then(() => {
      // We are now connected to a store node
      setWakuStatus("Connected")
    })
  }, [waku, wakuStatus])

  useEffect(() => {
    if (!waku) return

    if (wakuStatus !== "Connected") return
    // Trigger message fetching initially
    fetchMessages();

    // // Start fetching messages periodically using setInterval
    // const interval = setInterval(() => {
    //   fetchMessages();
    // }, 5000); // Adjust interval duration as needed

    // return () => {
    //   clearInterval(interval); // Clear interval on component unmount
    // };
  }, [waku, wakuStatus]); // Add necessary dependencies

  const data = {
    accountAddress,
    setAccountAddress,
    stakedAmount,
    setStakedAmount,
    stakedOnAddress,
    setStakedOnAddress,
    contract,
    erc20Contract,
    feedItems,
    setFeedItems,
    messages,
    setMessages,
    sendMessage
  }

  return (
    <DataContext.Provider value={data}>
      {children}
    </DataContext.Provider>
  );
};

export { DataContext, DataProvider };
