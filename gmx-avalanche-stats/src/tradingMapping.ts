// import { BigInt } from "@graphprotocol/graph-ts"

// import {
//   timestampToDay,
//   timestampToPeriod
// } from "./helpers"

// import {
//   ClosePosition,
//   IncreasePosition,
//   DecreasePosition,
//   LiquidatePosition
// } from "../generated/Vault/Vault"

// import {
//   TradingStat
// } from "../generated/schema"

// let ZERO = BigInt.fromI32(0)

// function _loadOrCreateEntity(id: string, period: string, timestamp: BigInt): TradingStat {
//   let entity = TradingStat.load(id)
//   if (entity == null) {
//     entity = new TradingStat(id)
//     entity.period = period
//     entity.profit = BigInt.fromI32(0)
//     entity.loss = BigInt.fromI32(0)
//     entity.profitCumulative = BigInt.fromI32(0)
//     entity.lossCumulative = BigInt.fromI32(0)

//     entity.longOpenInterest = BigInt.fromI32(0)
//     entity.shortOpenInterest = BigInt.fromI32(0)

//     entity.liquidatedCollateral = BigInt.fromI32(0)
//     entity.liquidatedCollateralCumulative = BigInt.fromI32(0)
//   }
//   entity.timestamp = timestamp.toI32()
//   return entity as TradingStat
// }

// function _updateOpenInterest(timestamp: BigInt, increase: boolean, isLong: boolean, delta: BigInt): void {
//   let dayTimestamp = timestampToDay(timestamp)
//   let totalId = "total"
//   let totalEntity = _loadOrCreateEntity(totalId, "total", dayTimestamp)

//   if (isLong) {
//     totalEntity.longOpenInterest = increase ? totalEntity.longOpenInterest.plus(delta) : totalEntity.longOpenInterest.minus(delta)
//   } else {
//     totalEntity.shortOpenInterest = increase ? totalEntity.shortOpenInterest.plus(delta) : totalEntity.shortOpenInterest.minus(delta)
//   }
//   totalEntity.save()

//   _updateOpenInterestForPeriod(timestamp, "hourly", totalEntity.longOpenInterest, totalEntity.shortOpenInterest)
//   _updateOpenInterestForPeriod(timestamp, "daily", totalEntity.longOpenInterest, totalEntity.shortOpenInterest)
//   _updateOpenInterestForPeriod(timestamp, "weekly", totalEntity.longOpenInterest, totalEntity.shortOpenInterest)
// }

// function _updateOpenInterestForPeriod(
//   timestamp: BigInt,
//   period: string,
//   longOpenInterest: BigInt,
//   shortOpenInterest: BigInt
// ): void {
//   let id: string
//   let timestampGroup: BigInt

//   timestampGroup = timestampToPeriod(timestamp, period)
//   id = timestampGroup.toString() + ":" + period

//   let entity = _loadOrCreateEntity(id, period, timestampGroup)
//   entity.longOpenInterest = longOpenInterest
//   entity.shortOpenInterest = shortOpenInterest
//   entity.save()
// }

// export function handleIncreasePosition(event: IncreasePosition): void {
//   _updateOpenInterest(event.block.timestamp, true, event.params.isLong, event.params.sizeDelta)
// }

// export function handleLiquidatePosition(event: LiquidatePosition): void {
//   _updateOpenInterest(event.block.timestamp, false, event.params.isLong, event.params.size)
//   _storePnl(event.block.timestamp, event.params.collateral.times(BigInt.fromI32(-1)), true)
// }

// export function handleDecreasePosition(event: DecreasePosition): void {
//   _updateOpenInterest(event.block.timestamp, false, event.params.isLong, event.params.sizeDelta)
// }

// export function handleClosePosition(event: ClosePosition): void {
//   _storePnl(event.block.timestamp, event.params.realisedPnl, false)
// }

// function _storePnl(timestamp: BigInt, pnl: BigInt, isLiquidated: boolean): void {
//   let dayTimestamp = timestampToDay(timestamp)

//   let totalId = "total"
//   let totalEntity = _loadOrCreateEntity(totalId, "total", dayTimestamp)
//   if (pnl > ZERO) {
//     totalEntity.profit = totalEntity.profit.plus(pnl) 
//     totalEntity.profitCumulative = totalEntity.profitCumulative.plus(pnl)
//   } else {
//     totalEntity.loss = totalEntity.loss.minus(pnl)
//     totalEntity.lossCumulative = totalEntity.lossCumulative.minus(pnl)
//     if (isLiquidated) {
//       totalEntity.liquidatedCollateral = totalEntity.liquidatedCollateral.minus(pnl)
//       totalEntity.liquidatedCollateralCumulative = totalEntity.liquidatedCollateralCumulative.minus(pnl)
//     }
//   }
//   totalEntity.timestamp = dayTimestamp.toI32()
//   totalEntity.save()

//   _storePnlForPeriod(timestamp, "hourly", pnl, isLiquidated, totalEntity)
//   _storePnlForPeriod(timestamp, "daily", pnl, isLiquidated, totalEntity)
//   _storePnlForPeriod(timestamp, "weekly", pnl, isLiquidated, totalEntity)
// }

// function _storePnlForPeriod(
//   timestamp: BigInt,
//   period: string,
//   pnl: BigInt,
//   isLiquidated: boolean,
//   totalEntity: TradingStat
// ): void {
//   let timestampGroup = timestampToPeriod(timestamp, period)
//   let id = timestampGroup.toString() + ":" + period
//   let entity = _loadOrCreateEntity(id, period, timestampGroup)

//   if (pnl > ZERO) {
//     entity.profit = entity.profit.plus(pnl)
//   } else {
//     entity.loss = entity.loss.minus(pnl)
//     if (isLiquidated) {
//       entity.liquidatedCollateral = entity.liquidatedCollateral.minus(pnl)
//     }
//   }
//   entity.profitCumulative = totalEntity.profitCumulative
//   entity.lossCumulative = totalEntity.lossCumulative
//   entity.liquidatedCollateralCumulative = totalEntity.liquidatedCollateralCumulative
//   entity.save()
// }
