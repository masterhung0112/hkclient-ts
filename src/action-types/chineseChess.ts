import keyMirror from 'utils/key_mirror'

export const ChineseChessTypes = keyMirror({
  GAME_START: null,
  GAME_SWITCH_TURN: null,
  GAME_COMPUTER_THINK: null,
  GAME_SET_PLAYER1: null,
  GAME_SET_PLAYER2: null,
  GAME_SET_ACTIVE_PLAYER: null,
  GAME_ACTIVE_PLAYER_MOVE: null,
  GAME_ACTIVE_PLAYER_SELECT_AVATAR: null,
  PLAYER_UPSERT: null,
  PLAYER_UPSERT_MANY: null,
  PLAYER_SET_OPPONENT: null,
  BOARD_INITIALIZE: null,
  BOARD_PIECE_CHANGE_CORDINATE: null,
})
