import { BigInt } from "@graphprotocol/graph-ts"
import {
  TrustDrops,
  OwnershipTransferred,
  Staked,
  TokensClaimed,
  Unstaked
} from "../generated/TrustDrops/TrustDrops"
import { Stake, User } from "../generated/schema"

export function handleStaked(event: Staked): void {
  let candidate = User.load(event.params.candidate)
  if (candidate == null) {
    candidate = new User(event.params.candidate)
    candidate.id = event.params.candidate
    candidate.address = event.params.candidate
    candidate.tokenStaked = BigInt.fromI32(0)
    candidate.tokenBalance = BigInt.fromI32(0)
    candidate.credScoreAccrued = BigInt.fromI32(0)
    candidate.credScoreDistributed = BigInt.fromI32(0)

    candidate.save()
  } 

  // check if staker is already a user, throw error if not
  let staker = User.load(event.params.staker)
  if (staker == null) {
    // throw error
    throw new Error('Staker is not a user')
  } 

  // update staker's cred score distributed
  staker.credScoreDistributed = staker.credScoreDistributed.plus(event.params.cred)
  staker.tokenBalance = staker.tokenBalance.minus(event.params.amount)
  staker.save()

  // update candidate's cred score received
  candidate.credScoreAccrued = candidate.credScoreAccrued.plus(event.params.cred)
  candidate.save()

  // update Stakes entity
  // id is staker-candidate-currentTimestamp
  // let id = event.params.staker.toHex() + '-' + event.params.candidate.toHex() + '-' + event.block.timestamp.toString()
  let id = event.transaction.hash.toHex()
  let stake = new Stake(id)
  stake.staker = staker.id
  stake.candidate = candidate.id
  stake.amount = event.params.amount
  stake.timestamp = event.block.timestamp
  stake.credScoreGiven = event.params.cred
  stake.save()
}

export function handleTokensClaimed(event: TokensClaimed): void {
  // create user if not already created
  let user = User.load(event.params.candidate)
}

export function handleUnstaked(event: Unstaked): void {
  let candidate = User.load(event.params.candidate)
  if (candidate == null) {
    candidate = new User(event.params.candidate)
    candidate.save()
  } 

  // check if staker is already a user
  let staker = User.load(event.params.staker)
  if (staker == null) {
    staker = new User(event.params.staker)
    staker.save()
  }

  // TODO: Update amount with cred when cred is implemented
  // update staker's cred score distributed
  staker.credScoreDistributed = staker.credScoreDistributed.minus(event.params.cred)
  staker.save()

  // update candidate's cred score received
  candidate.credScoreAccrued = candidate.credScoreAccrued.minus(event.params.cred)
  candidate.save()

  // update Stakes entity
  // id is staker-candidate-currentTimestamp
  let id = event.params.staker.toHex() + '-' + event.params.candidate.toHex() + '-' + event.block.timestamp.toString()
  let stake = new Stake(id)
  stake.staker = staker.id
  stake.candidate = candidate.id
  stake.amount = event.params.amount
  stake.timestamp = event.block.timestamp
  stake.credScoreGiven = event.params.cred
  stake.save()
}
