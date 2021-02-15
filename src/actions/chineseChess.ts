import { createAction } from '@reduxjs/toolkit'
import { ChineseChessTypes } from 'action-types/chineseChess'
import { PieceCoordinateId, ChineseChessPlayer, PieceMove } from 'types/chineseChess'

export const setPlayer1Id = createAction<string>(ChineseChessTypes.GAME_SET_PLAYER1)
export const setPlayer2Id = createAction<string>(ChineseChessTypes.GAME_SET_PLAYER2)
export const setActivePlayer = createAction<string>(ChineseChessTypes.GAME_SET_ACTIVE_PLAYER)
export const activePlayerMove = createAction<PieceCoordinateId>(ChineseChessTypes.GAME_ACTIVE_PLAYER_MOVE)
export const activePlayerSelectPiece = createAction<PieceCoordinateId>(
  ChineseChessTypes.GAME_ACTIVE_PLAYER_SELECT_AVATAR
)
export const upsertPlayer = createAction<ChineseChessPlayer>(ChineseChessTypes.PLAYER_UPSERT)
export const upsertManyPlayer = createAction<ChineseChessPlayer[]>(ChineseChessTypes.PLAYER_UPSERT_MANY)
export const boardInitialize = createAction(ChineseChessTypes.BOARD_INITIALIZE)
export const boardPieceChangeCoordinate = createAction<PieceMove>(ChineseChessTypes.BOARD_PIECE_CHANGE_CORDINATE)
