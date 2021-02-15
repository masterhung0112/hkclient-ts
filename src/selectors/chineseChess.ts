import { createSelector } from '@reduxjs/toolkit'
import { CHINESE_CHESS_MODULE_NAME } from 'hkconstants/chineseChess'
import { boardPiecesAdapter, generateIdFromPieceCoordinateId, playersAdapter } from 'hkreducers/chineseChess'
import { PieceCoordinateId, ChineseChessState, ChineseChessStateAwareState } from 'types/chineseChess'

export const chineseChessSelector = (state: ChineseChessStateAwareState): ChineseChessState => {
  return state[CHINESE_CHESS_MODULE_NAME]
}

export const getPlayer1Id = createSelector(chineseChessSelector, (chineseChess) => chineseChess.player1Id)
export const getPlayer2Id = createSelector(chineseChessSelector, (chineseChess) => chineseChess.player2Id)
export const getActivePlayerId = createSelector(chineseChessSelector, (chineseChess) => chineseChess.activePlayerId)
export const getPlayer1SelectedPieceId = createSelector(
  chineseChessSelector,
  (chineseChess) => chineseChess.player1SelectedPieceId
)
export const getPlayer1SelectedPiece = createSelector(getPlayer1SelectedPieceId, (player1SelectedPieceId) =>
  getPieceById(player1SelectedPieceId)
)

export const getPlayer2SelectedPieceId = createSelector(
  chineseChessSelector,
  (chineseChess) => chineseChess.player2SelectedPieceId
)
export const getPlayer2SelectedPiece = createSelector(getPlayer2SelectedPieceId, (player2SelectedPieceId) =>
  getPieceById(player2SelectedPieceId)
)

export const getActiveSelectedPiece = createSelector(
  getActivePlayerId,
  getPlayer1Id,
  getPlayer2Id,
  (activePlayerId, player1Id, player2Id) =>
    activePlayerId == player1Id
      ? getPlayer1SelectedPiece
      : activePlayerId == player2Id
      ? getPlayer2SelectedPiece
      : null
)

const playersSelectors = playersAdapter.getSelectors<ChineseChessState>((state) => state.players)
export const getPlayerFromId = (playerId: string) =>
  createSelector(chineseChessSelector, (chineseChess) => playersSelectors.selectById(chineseChess, playerId))

const boardPiecesSelectors = boardPiecesAdapter.getSelectors<ChineseChessState>((state) => state.currentBoard)
export const getPieceById = (avatarId: PieceCoordinateId) =>
  createSelector(chineseChessSelector, (chineseChess) =>
    boardPiecesSelectors.selectById(chineseChess, generateIdFromPieceCoordinateId(avatarId))
  )
export const getAllPieces = createSelector(chineseChessSelector, (chineseChess) =>
  boardPiecesSelectors.selectAll(chineseChess)
)
// Get all avatars by row index
export const getPieceByRow = (rowIndex: number) =>
  createSelector(getAllPieces, (allPieces) =>
    allPieces.filter((avatarCoordinator) => avatarCoordinator.x == rowIndex)
  )
// Get all avatars by col index
export const getPieceByCol = (colIndex: number) =>
  createSelector(getAllPieces, (allPieces) =>
    allPieces.filter((avatarCoordinator) => avatarCoordinator.y == colIndex)
  )
