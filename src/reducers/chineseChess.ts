import { UserTypes } from 'action-types/users'
import { combineReducers } from 'redux'
import { ChineseChessPlayer } from 'types/chineseChess'
import { createEntityAdapter, createReducer, createSlice } from '@reduxjs/toolkit'
import { setActivePlayer, setPlayer1Id, setPlayer2Id, upsertManyPlayer, upsertPlayer } from 'actions/chineseChess'

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

const playersAdapter = createEntityAdapter<ChineseChessPlayer>({
  selectId: (player) => player.id,
})

const playersSlice = createSlice({
  name: 'players',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(upsertPlayer, playersAdapter.upsertOne).addCase(upsertManyPlayer, playersAdapter.upsertMany)
  },
})

export default combineReducers({
  player1Id,
  player2Id,
  activePlayerId,
  players: playersSlice.reducer,
})
