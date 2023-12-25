import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  OwnershipTransferred,
  Staked,
  TokensClaimed,
  Unstaked
} from "../generated/TrustDrops/TrustDrops"
import { Transfer } from "../generated/DAOToken/DAOToken"

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createStakedEvent(
  staker: Address,
  candidate: Address,
  amount: BigInt,
  cred: BigInt
): Staked {
  let stakedEvent = changetype<Staked>(newMockEvent())

  stakedEvent.parameters = new Array()

  stakedEvent.parameters.push(
    new ethereum.EventParam("staker", ethereum.Value.fromAddress(staker))
  )
  stakedEvent.parameters.push(
    new ethereum.EventParam("candidate", ethereum.Value.fromAddress(candidate))
  )
  stakedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  stakedEvent.parameters.push(
    new ethereum.EventParam("cred", ethereum.Value.fromUnsignedBigInt(cred))
  )

  return stakedEvent
}

export function createTokensClaimedEvent(
  candidate: Address,
  amount: BigInt
): TokensClaimed {
  let tokensClaimedEvent = changetype<TokensClaimed>(newMockEvent())

  tokensClaimedEvent.parameters = new Array()

  tokensClaimedEvent.parameters.push(
    new ethereum.EventParam("candidate", ethereum.Value.fromAddress(candidate))
  )
  tokensClaimedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return tokensClaimedEvent
}

export function createUnstakedEvent(
  staker: Address,
  candidate: Address,
  amount: BigInt,
  cred: BigInt
): Unstaked {
  let unstakedEvent = changetype<Unstaked>(newMockEvent())

  unstakedEvent.parameters = new Array()

  unstakedEvent.parameters.push(
    new ethereum.EventParam("staker", ethereum.Value.fromAddress(staker))
  )
  unstakedEvent.parameters.push(
    new ethereum.EventParam("candidate", ethereum.Value.fromAddress(candidate))
  )
  unstakedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  unstakedEvent.parameters.push(
    new ethereum.EventParam("cred", ethereum.Value.fromUnsignedBigInt(cred))
  )

  return unstakedEvent
}


export function createTokenTransferEvent(
  from: Address,
  to: Address,
  amount: BigInt
): Transfer {
  let tokenTransferEvent = changetype<Transfer>(newMockEvent())

  tokenTransferEvent.parameters = new Array()

  tokenTransferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  tokenTransferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  tokenTransferEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return tokenTransferEvent
}