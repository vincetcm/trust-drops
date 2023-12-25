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
    candidate.save()
  } 

  // check if staker is already a user
  let staker = User.load(event.params.staker)
  if (staker == null) {
    staker = new User(event.params.staker)
    staker.save()
  }

  // update staker's cred score distributed
  staker.credScoreDistributed = staker.credScoreDistributed.plus(event.params.amount)
  staker.save()

  // update candidate's cred score received
  candidate.credScoreAccrued = candidate.credScoreAccrued.plus(event.params.amount)
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

export function handleTokensClaimed(event: TokensClaimed): void {}

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
  staker.credScoreDistributed = staker.credScoreDistributed.minus(event.params.amount)
  staker.save()

  // update candidate's cred score received
  candidate.credScoreAccrued = candidate.credScoreAccrued.minus(event.params.amount)
  candidate.save()

  // update Stakes entity
  // id is staker-candidate-currentTimestamp
  let id = event.params.staker.toHex() + '-' + event.params.candidate.toHex() + '-' + event.block.timestamp.toString()
  let stake = new Stake(id)
  stake.staker = staker.id
  stake.candidate = candidate.id
  stake.amount = event.params.amount
  stake.timestamp = event.block.timestamp
  stake.credScoreGiven = event.params.amount
  stake.save()
}
