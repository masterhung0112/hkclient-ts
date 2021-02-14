import { createAction } from '@reduxjs/toolkit'
import { ChineseChessTypes } from 'action-types/chineseChess'
import { ChineseChessPlayer } from 'types/chineseChess'

export const setPlayer1Id = createAction<string>(ChineseChessTypes.GAME_SET_PLAYER1)
export const setPlayer2Id = createAction<string>(ChineseChessTypes.GAME_SET_PLAYER2)
export const setActivePlayer = createAction<string>(ChineseChessTypes.GAME_SET_ACTIVE_PLAYER)
export const upsertPlayer = createAction<ChineseChessPlayer>(ChineseChessTypes.PLAYER_UPSERT)
export const upsertManyPlayer = createAction<ChineseChessPlayer[]>(ChineseChessTypes.PLAYER_UPSERT_MANY)
