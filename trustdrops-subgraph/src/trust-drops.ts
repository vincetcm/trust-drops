import { BigInt, log } from "@graphprotocol/graph-ts"
import {
  TrustDrops,
  OwnershipTransferred,
  Staked,
  TokensClaimed,
  Unstaked
} from "../generated/TrustDrops/TrustDrops"
import { Stake, User } from "../generated/schema"

export function handleStaked(event: Staked): void {
  log.info('Entered handler!', [])
  let candidate = User.load(event.params.candidate)
  if (candidate == null) {
    candidate = new User(event.params.candidate)
    candidate.id = event.params.candidate
    candidate.address = event.params.candidate
    candidate.tokenStaked = BigInt.fromI32(0)
    candidate.tokenBalance = BigInt.fromI32(0)
    candidate.credScoreAccrued = BigInt.fromI32(0)
    candidate.credScoreDistributed = BigInt.fromI32(0)
    log.info('created candidate!', [])
    candidate.save()
  } 

  // check if staker is already a user, throw error if not
  let staker = User.load(event.params.staker)
  if (staker == null) {
    staker = new User(event.params.staker)
    staker.id = event.params.staker
    staker.address = event.params.staker
    staker.tokenStaked = BigInt.fromI32(0)
    staker.tokenBalance = BigInt.fromI32(0)
    staker.credScoreAccrued = BigInt.fromI32(0)
    staker.credScoreDistributed = BigInt.fromI32(0)

    staker.save()
    log.info('created staker!', [])
  } 

  // update staker's cred score distributed
  staker.credScoreDistributed = staker.credScoreDistributed.plus(event.params.cred)
  staker.tokenStaked = staker.tokenStaked.plus(event.params.amount)
  staker.save()

  // update candidate's cred score received
  candidate.credScoreAccrued = candidate.credScoreAccrued.plus(event.params.cred)
  candidate.save()

  // update Stakes entity
  // id is staker-candidate-currentTimestamp
  let id = event.params.staker.toHex() + '-' + event.params.candidate.toHex()
  // let id = event.transaction.hash.toHex()
  let stake = Stake.load(id)
  if (stake == null) {
    stake = new Stake(id)
    stake.staker = staker.id
    stake.candidate = candidate.id
    stake.amount = BigInt.fromI32(0)
    stake.credScore = BigInt.fromI32(0)

    log.info('created stake!', [])
  }
  stake.stakeType = 'STAKE'
  stake.amount = stake.amount.plus(event.params.amount)
  stake.credScore = stake.credScore.plus(event.params.cred)
  
  stake.save()
}

export function handleUnstaked(event: Unstaked): void {
  let candidate = User.load(event.params.candidate)
  if (candidate == null) {
    throw new Error('Candidate is not a user')
  } 

  // check if staker is already a user
  let staker = User.load(event.params.staker)
  if (staker == null) {
    // throw error
    throw new Error('Staker is not a user')
  }

  // update staker's cred score distributed
  staker.credScoreDistributed = staker.credScoreDistributed.minus(event.params.cred)
  staker.tokenStaked = staker.tokenStaked.minus(event.params.amount)
  staker.save()

  // update candidate's cred score received
  candidate.credScoreAccrued = candidate.credScoreAccrued.minus(event.params.cred)
  candidate.save()

  let id = event.params.staker.toHex() + '-' + event.params.candidate.toHex()
  // let id = event.transaction.hash.toHex()
  let stake = Stake.load(id)
  if (stake == null) {
    throw new Error('Stake does not exist')
  }

  stake.stakeType = 'UNSTAKE'
  stake.amount = stake.amount.minus(event.params.amount)
  stake.credScore = stake.credScore.minus(event.params.cred)
  
  stake.save()
}
