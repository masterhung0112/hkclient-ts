import { call, put, select, takeEvery } from 'redux-saga/effects'
import { Action, ActionResultType } from 'types/actions'
import { ChineseChessTypes } from 'action-types/chineseChess'
import {
  activePlayerMove,
  activePlayerSelectPiece,
  boardInitialize,
  boardPieceChangeCoordinate,
  setActivePlayer,
  upsertManyPlayer,
} from 'actions/chineseChess'
import { PieceCoordinateId, ChineseChessPlayer, PieceCoordinate } from 'types/chineseChess'
import { getActivePlayerId, getActiveSelectedPiece, getPlayer1Id, getPlayer2Id } from 'selectors/chineseChess'
import { generateIdFromPieceCoordinateId } from 'hkreducers/chineseChess'

/* Piece      | Vectors
   +++++++++++++++++++++++
 * General (King)       -1,0;0,1;1,0;0,-1
 * Guard (Advisor)      -1,1;1,1;1,-1;-1,-1
 * Bishop (Elephant)    All scalar multiples (n=1-7) of 1,1;1,-1;-1,1;-1,-1
 * Knight (Horse)       -1,2;-2,1;1,2;2,1;-2,-1;-1,-2;1,-2;2,-1
 * Rook (Chariot)       All scalar multiples (n=1-7) of 1,0;0,1;-1,0;0,-1
 * Cannon
 * Pawn (Soldier)
 */
const GeneralDirections = [-0x10, 0x01, 0x10, -0x01]
const HorseDirections = [-0x12, -0x21, -0x1f, -0x0e, +0x12, +0x21, +0x1f, +0x0e]
// Used to check if there is any piece at the foot of the horse
const HorseEyes = [-0x01, -0x10, -0x10, +0x01, +0x01, +0x10, +0x10, -0x01]
const AdvisorDirections = [-0x11, -0x0f, 0x11, 0x0f]
const ElephantDirections = [-0x22, -0x1e, +0x22, +0x1e]
const ElephantEyes = [-0x11, -0x0f, +0x11, +0x0f]
const ChariotDirections = [-0x01, -0x10, 0x01, 0x10]
const CannonDirections = [-0x01, -0x10, 0x01, 0x10]
const SoldierDirections = [
  [-0x01, 0x01, -0x10],
  [-0x01, 0x01, 0x10],
]

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

  // Initialize the current board
  yield put(boardInitialize())

  //TODO: Generate the pieces on chess board

  return [{ data: true }]
}

export function* switchTurnSaga(): Generator<Action, ActionResultType, any> {
  const player1 = yield select(getPlayer1Id)
  const player2 = yield select(getPlayer2Id)
  let activePlayerId = yield select(getActivePlayerId)
  activePlayerId = activePlayerId === player1 ? player2 : player1
  yield put(setActivePlayer(activePlayerId))
  return [{ data: activePlayerId }]
}

export function* activePlayerSelectPieceSaga(action): Generator<Action, ActionResultType, any> {
  if (!activePlayerSelectPiece.match(action)) {
    return [{ error: 'actionNotMatch' }]
  }
  // Select the selected avatar

  // Deselect the selected avatar
}

export function* activePlayerMoveSaga(action): Generator<Action, ActionResultType, any> {
  if (!activePlayerMove.match(action)) {
    return [{ error: 'actionNotMatch' }]
  }
  // Retrieve the active avatar
  const selectedPiece = yield select(getActiveSelectedPiece)
  // No avatar selected for the current active player
  if (!selectedPiece) {
    return [{ error: `active player has no selected avatar` }]
  }
  if (selectedPiece.hidden) {
    return [{ error: 'coord is not highlighted, unable to move' }]
  }

  // Move the selected avatar to the target coordinator
  const result = yield call(avatarMoveToCoordinate, selectedPiece, action.payload)
  if (result && result[0] && result[0].error) {
    // Probably we cannot make this move
    return result
  }

  return yield call(switchTurnSaga)
}

export function* avatarMoveToCoordinate(
  avatar: PieceCoordinate,
  newCoordinate: PieceCoordinateId
): Generator<Action, ActionResultType, any> {
  // Check if this avatar can make this move
  // if (!this.moveOptions.map(move => move.xy).find(({x, y}) =>  x === toX && y === toY )) {
  //   throw new Error('Cannot make an illegal move')
  // }

  // Place the piece at the specified cordinate
  yield put(
    boardPieceChangeCoordinate({
      oldCoordinateId: avatar.id,
      newCoordinateId: generateIdFromPieceCoordinateId(newCoordinate),
    })
  )

  return [{ data: true }]
}

export function* startChineseChess(): Generator<Action, void, unknown> {
  yield takeEvery(ChineseChessTypes.GAME_START, startGameSaga)
}
