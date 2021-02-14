import { EntityState } from '@reduxjs/toolkit'
import { CHINESE_CHESS_MODULE_NAME } from 'hkconstants/chineseChess'

export type ChineseChessPlayer = {
  id: string
  fraction: string
  opponentId?: string
}

// export default class CChessPlayer {
//   faction: string
//   avatars: any[]
//   selectedAvatar: string | null
//   opponent: CChessPlayer

//   constructor({ faction, opponent }: { faction: string, opponent: CChessPlayer } = {}) {
//     this.faction = faction
//     this.avatars = []
//     this.selectedAvatar = null

//     this.opponent = opponent
//   }

//   set addAvatar(avatar: string) {
//     this.avatars.push(avatar)
//     avatar.player = this
//   }

//   set setOpponent(opponent: CChessPlayer | null | undefined) {
//     if (opponent) {
//       this.opponent = opponent
//       opponent.opponent = this
//     }
//   }

//   set addAvatars(allPieces: string[]) {
//     allPieces.forEach((avatar) => {
//       this.addAvatar(avatar)
//     })
//   }

//   set setSelectedAvatar(avatar: string) {
//     matrix.extinguish()
//     this.opponent.avatars.filter((avatar) => avatar.isHaloed()).map((avatar) => avatar.active())

//     if (avatar === null) {
//       this.selectedAvatar = avatar
//     } else if (this.selectedAvatar === avatar) {
//       this.selectedAvatar = null
//     } else if (this.avatars.indexOf(avatar) !== -1) {
//       this.selectedAvatar = avatar

//       this.selectedAvatar.getMoveOptions.map((coord) => {
//         coord[`${this.faction}Highlighted`]()
//       })

//       this.selectedAvatar.getKillOptions.map((coord) => {
//         coord.avatar.haloed()
//       })
//     }
//   }

//   get getSelectedAvatar() {
//     return this.selectedAvatar
//   }
// }

export type ChineseChessState = Readonly<{
  player1Id: string
  player2Id: string
  activePlayerId: string
  players: EntityState<ChineseChessPlayer>
}>

export interface ChineseChessStateAwareState {
  [CHINESE_CHESS_MODULE_NAME]: ChineseChessState
}
