import { BigInt } from "@graphprotocol/graph-ts"
import {Transfer} from '../generated/DAOToken/DAOToken'
import { User } from "../generated/schema"

export function handleTokenTransfer(event: Transfer): void {
  let receiver = User.load(event.params.to)
  let sender = User.load(event.params.from)
  if (receiver == null) {
    receiver = new User(event.params.to)
    receiver.id = event.params.to
    receiver.address = event.params.to
    receiver.tokenBalance = event.params.value
    receiver.tokenStaked = BigInt.fromI32(0)
    receiver.credScoreAccrued = BigInt.fromI32(0)
    receiver.credScoreDistributed = BigInt.fromI32(0)
    receiver.save()
  } else {
    receiver.tokenBalance = receiver.tokenBalance.plus(event.params.value)
    receiver.save()
  }

  if(sender == null) {
    sender = new User(event.params.from)
    sender.id = event.params.from
    sender.address = event.params.from
    sender.tokenBalance = BigInt.fromI32(0)
    sender.tokenStaked = BigInt.fromI32(0)
    sender.credScoreAccrued = BigInt.fromI32(0)
    sender.credScoreDistributed = BigInt.fromI32(0)
    sender.save()
  } else {
    sender.tokenBalance = sender.tokenBalance.minus(event.params.value)
    sender.save()
  }
}