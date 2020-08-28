import { UsersState } from './users';

export type GlobalState = {
  entities: {
    users: UsersState
  }
  // errors: Array<any>
}
