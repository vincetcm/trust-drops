import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { User, Stake } from "../generated/schema"
import { OwnershipTransferred } from "../generated/TrustDrops/TrustDrops"
import { handleStaked, handleUnstaked } from "../src/trust-drops"
import { createOwnershipTransferredEvent, createStakedEvent, createTokenTransferEvent, createUnstakedEvent } from "./trust-drops-utils"
import { handleTokenTransfer } from "../src/dao-token"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0


describe("TrustDrops contract", () => {
  beforeAll(() => {

    // create token transfer event
    let previousOwner = Address
      .fromString("0x0000000000000000000000000000000000000000")
    let newOwner = Address
      .fromString("0x0000000000000000000000000000000000000001")
    let tokenTransferEvent = createTokenTransferEvent(
      previousOwner,
      newOwner,
      BigInt.fromI32(100000)
    )

    handleTokenTransfer(tokenTransferEvent)

    assert.entityCount("User", 1)
    assert.fieldEquals(
      "User",
      newOwner.toHex(),
      "tokenBalance",
      "100000"
    )
    
  }
  )

  test("Stake created", () => {
    let staker = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let candidate = Address.fromString(
      "0x0000000000000000000000000000000000000002"
    )
    let amount = BigInt.fromI32(100)
    let cred = BigInt.fromI32(10)
    let newStakedEvent = createStakedEvent(
      staker,
      candidate,
      amount,
      cred
    )
    handleStaked(newStakedEvent)

    assert.entityCount("Stake", 1)
    assert.fieldEquals(
      "Stake",
      Address.fromString("0xA16081F360e3847006dB660bae1c6d1b2e17eC2A").toHex(),
      "staker",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "Stake",
      Address.fromString("0xA16081F360e3847006dB660bae1c6d1b2e17eC2A").toHex(),
      "candidate",
      "0x0000000000000000000000000000000000000002"
    )
    assert.fieldEquals(
      "Stake",
      Address.fromString("0xA16081F360e3847006dB660bae1c6d1b2e17eC2A").toHex(),
      "amount",
      "100"
    )
    assert.fieldEquals(
      "Stake",
      Address.fromString("0xA16081F360e3847006dB660bae1c6d1b2e17eC2A").toHex(),
      "credScoreGiven",
      "10"
    )
    assert.fieldEquals(
      "User",
      staker.toHex(),
      "credScoreAccrued",
      "0"
    )
  })

  // test("Stake created and stored", () => {
  //   assert.entityCount("Stake", 1)

  //   // 0xA16081F360e3847006dB660bae1c6d1b2e17eC2A is the default address used in newMockEvent() function
  //   assert.fieldEquals(
  //     "Stake",
  //     "0x0000000000000000000000000000000000000001-0x0000000000000000000000000000000000000002-1",
  //     "staker",
  //     "0x0000000000000000000000000000000000000001"
  //   )
  //   assert.fieldEquals(
  //     "Stake",
  //     "0x0000000000000000000000000000000000000001-0x0000000000000000000000000000000000000002-1",
  //     "candidate",
  //     "0x0000000000000000000000000000000000000002"
  //   )
  //   assert.fieldEquals(
  //     "Stake",
  //     "0x0000000000000000000000000000000000000001-0x0000000000000000000000000000000000000002-1",
  //     "amount",
  //     "100"
  //   )
  //   assert.fieldEquals(
  //     "Stake",
  //     "0x0000000000000000000000000000000000000001-0x0000000000000000000000000000000000000002-1",
  //     "credScoreGiven",
  //     "10"
  //   )
  // }
  // )

  test("Staker user created and stored", () => {
    assert.entityCount("User", 2)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "User",
      "0x0000000000000000000000000000000000000001",
      "credScoreDistributed",
      "10"
    )
    assert.fieldEquals(
      "User",
      "0x0000000000000000000000000000000000000001",
      "credScoreAccrued",
      "0"
    )
  }
  )
  
  test("Candidate user created and stored", () => {
    assert.entityCount("User", 2)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "User",
      "0x0000000000000000000000000000000000000002",
      "credScoreDistributed",
      "0"
    )
    assert.fieldEquals(
      "User",
      "0x0000000000000000000000000000000000000002",
      "credScoreAccrued",
      "10"
    )
  }
  )

  // test("User updated and stored", () => {
  //   let staker = Address.fromString(
  //     "0x0000000000000000000000000000000000000001"
  //   )
  //   let candidate = Address.fromString(
  //     "0x0000000000000000000000000000000000000002"
  //   )
  //   let amount = BigInt.fromI32(100)
  //   let cred = BigInt.fromI32(100)
  //   let newUnstakedEvent = createUnstakedEvent(
  //     staker,
  //     candidate,
  //     amount,
  //     cred
  //   )
  //   handleUnstaked(newUnstakedEvent)

  //   assert.entityCount("User", 2)

  //   // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
  //   assert.fieldEquals(
  //     "User",
  //     "0x0000001",
  //     "credScoreDistributed",
  //     "0"
  //   )
  //   assert.fieldEquals(
  //     "User",
  //     "0x0000002",
  //     "credScoreAccrued",
  //     "0"
  //   )
  // }
  // )

  // More test scenarios:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test
}
)


 




