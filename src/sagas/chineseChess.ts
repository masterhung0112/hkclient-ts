import { put, takeEvery } from 'redux-saga/effects'
import { Action, ActionResultType } from 'types/actions'
import { ChineseChessTypes } from 'action-types/chineseChess'
import { setActivePlayer, upsertManyPlayer } from 'actions/chineseChess'
import { ChineseChessPlayer } from 'types/chineseChess'

export function* startGameSaga(): Generator<Action, ActionResultType, any> {
  // Create the default player 1 and player 2
  const player1: ChineseChessPlayer = {
    id: 'player1',
    fraction: 'red',
  }
  const player2: ChineseChessPlayer = {
    id: 'player2',
    fraction: 'black',
  }
  yield put(upsertManyPlayer([player1, player2]))

  // Set the active player
  yield put(setActivePlayer(player1.id))

  return [{ data: true }]
}

export function* startChineseChess(): any {
  yield takeEvery(ChineseChessTypes.GAME_START, startGameSaga)
}
