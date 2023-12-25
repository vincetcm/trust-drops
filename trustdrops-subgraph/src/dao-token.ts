import { BigInt } from "@graphprotocol/graph-ts"
import {Transfer} from '../generated/DAOToken/DAOToken'
import { User } from "../generated/schema"

export function handleTokenTransfer(event: Transfer): void {
  let user = User.load(event.params.to)
  if (user == null) {
    user = new User(event.params.to)
    user.id = event.params.to
    user.address = event.params.to
    user.tokenBalance = event.params.value
    user.tokenStaked = BigInt.fromI32(0)
    user.credScoreAccrued = BigInt.fromI32(0)
    user.credScoreDistributed = BigInt.fromI32(0)
    user.save()
  } else {
    user.tokenBalance = user.tokenBalance.plus(event.params.value)
    user.save()
  }
}