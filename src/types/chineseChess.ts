import { EntityState } from '@reduxjs/toolkit'
import { CHINESE_CHESS_MODULE_NAME } from 'hkconstants/chineseChess'

export type ChineseChessPlayer = {
  id: string
  fraction: string
  opponentId?: string
}

export type PieceCoordinateId = {
  x: number
  y: number
}

export type PieceCoordinate = {
  id: string
  x: number
  y: number
  piece?: string
  hidden?: boolean
  redHighlighted?: boolean
  blackHighlighted?: boolean
}

export type PieceMove = {
  oldCoordinateId: string
  newCoordinateId: string
}

// export default class CChessPlayer {
//   faction: string
//   avatars: any[]
//   selectedPiece: string | null
//   opponent: CChessPlayer

//   constructor({ faction, opponent }: { faction: string, opponent: CChessPlayer } = {}) {
//     this.faction = faction
//     this.avatars = []
//     this.selectedPiece = null

//     this.opponent = opponent
//   }

//   set addPiece(avatar: string) {
//     this.avatars.push(avatar)
//     avatar.player = this
//   }

//   set setOpponent(opponent: CChessPlayer | null | undefined) {
//     if (opponent) {
//       this.opponent = opponent
//       opponent.opponent = this
//     }
//   }

//   set addPieces(allPieces: string[]) {
//     allPieces.forEach((avatar) => {
//       this.addPiece(avatar)
//     })
//   }

//   set setSelectedPiece(avatar: string) {
//     matrix.extinguish()
//     this.opponent.avatars.filter((avatar) => avatar.isHaloed()).map((avatar) => avatar.active())

//     if (avatar === null) {
//       this.selectedPiece = avatar
//     } else if (this.selectedPiece === avatar) {
//       this.selectedPiece = null
//     } else if (this.avatars.indexOf(avatar) !== -1) {
//       this.selectedPiece = avatar

//       this.selectedPiece.getMoveOptions.map((coord) => {
//         coord[`${this.faction}Highlighted`]()
//       })

//       this.selectedPiece.getKillOptions.map((coord) => {
//         coord.avatar.haloed()
//       })
//     }
//   }

//   get getSelectedPiece() {
//     return this.selectedPiece
//   }
// }

export type ChineseChessState = Readonly<{
  player1Id: string
  player2Id: string
  activePlayerId: string
  player1SelectedPieceId: PieceCoordinateId
  player2SelectedPieceId: PieceCoordinateId
  players: EntityState<ChineseChessPlayer>
  currentBoard: EntityState<PieceCoordinate>
}>

export interface ChineseChessStateAwareState {
  [CHINESE_CHESS_MODULE_NAME]: ChineseChessState
}
