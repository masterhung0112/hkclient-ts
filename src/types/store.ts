import { UsersState } from './users';
import { GeneralState } from './general';
import { TeamsState } from './teams';

export type GlobalState = {
  entities: {
    general: GeneralState
    users: UsersState
    teams: TeamsState
  }
  // errors: Array<any>
}
