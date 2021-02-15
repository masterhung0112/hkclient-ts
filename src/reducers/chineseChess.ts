import { UserTypes } from 'action-types/users'
import { combineReducers } from 'redux'
import { PieceCoordinate, PieceCoordinateId, ChineseChessPlayer } from 'types/chineseChess'
import { createEntityAdapter, createReducer, createSlice } from '@reduxjs/toolkit'
import {
  boardInitialize,
  boardPieceChangeCoordinate,
  setActivePlayer,
  setPlayer1Id,
  setPlayer2Id,
  upsertManyPlayer,
  upsertPlayer,
} from 'actions/chineseChess'
import { CHINESE_CHESS_BOARD_HORIZONTAL, CHINESE_CHESS_BOARD_VERTICAL } from 'hkconstants/chineseChess'

const player1Id = createReducer('', (builder) => {
  builder
    .addCase(setPlayer1Id, (_, action) => action.payload)
    .addMatcher(
      (action) => action.type == UserTypes.LOGOUT_SUCCESS,
      () => ''
    )
})

const player2Id = createReducer('', (builder) => {
  builder
    .addCase(setPlayer2Id, (_, action) => action.payload)
    .addMatcher(
      (action) => action.type == UserTypes.LOGOUT_SUCCESS,
      () => ''
    )
})

const activePlayerId = createReducer('', (builder) => {
  builder
    .addCase(setActivePlayer, (_, action) => action.payload)
    .addMatcher(
      (action) => action.type == UserTypes.LOGOUT_SUCCESS,
      () => ''
    )
})

export const playersAdapter = createEntityAdapter<ChineseChessPlayer>({
  selectId: (player) => player.id,
})

const playersSlice = createSlice({
  name: 'players',
  initialState: playersAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(upsertPlayer, playersAdapter.upsertOne)
      .addCase(upsertManyPlayer, playersAdapter.upsertMany)
      .addMatcher(
        (action) => action.type == UserTypes.LOGOUT_SUCCESS,
        () => playersAdapter.getInitialState()
      )
  },
})

export function generateIdFromPieceCoordinateId(avatarCoordinateId: PieceCoordinateId) {
  return `${avatarCoordinateId.x},${avatarCoordinateId.y}`
}

export function generatePieceCoordinateId(x: number, y: number) {
  return `${x},${y}`
}

export const boardPiecesAdapter = createEntityAdapter<PieceCoordinate>()

const currentBoard = createReducer(boardPiecesAdapter.getInitialState(), (builder) => {
  builder
    // Initialize the chess board with all avatar
    .addCase(boardInitialize, (state) => {
      const board: PieceCoordinate[] = []
      for (let colIdx = 0; colIdx < CHINESE_CHESS_BOARD_VERTICAL; ++colIdx) {
        for (let rowIdx = 0; rowIdx < CHINESE_CHESS_BOARD_HORIZONTAL; ++rowIdx) {
          board.push({
            // Generate ID from column and row index
            id: generatePieceCoordinateId(colIdx, rowIdx),
            x: colIdx,
            y: rowIdx,
          })
        }
      }
      return boardPiecesAdapter.setAll(state, board)
    })
    .addCase(boardPieceChangeCoordinate, (state, action) => {
      // Change the avatar of old coordinate
      state = boardPiecesAdapter.updateOne(state, {
        id: action.payload.oldCoordinateId,
        changes: {
          piece: null,
        },
      })
      // Change the avatar of new coordinate
      state = boardPiecesAdapter.updateOne(state, {
        id: action.payload.newCoordinateId,
        changes: {
          piece: null,
        },
      })
      return state
    })
    .addMatcher(
      (action) => action.type == UserTypes.LOGOUT_SUCCESS,
      () => boardPiecesAdapter.getInitialState()
    )
})

export default combineReducers({
  player1Id,
  player2Id,
  activePlayerId,
  players: playersSlice.reducer,
  currentBoard,
})
