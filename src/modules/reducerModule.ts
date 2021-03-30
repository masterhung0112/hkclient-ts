import { IModule } from 'redux-dynamic-modules-core'

import entitiesReducer from '../reducers/entities'
import { EntitiesState } from '../types/store'

export interface EntityAwareState {
  entities: EntitiesState
}

export const EntitiesModule: IModule<EntityAwareState> = {
  id: 'entity',
  reducerMap: {
    entities: entitiesReducer as any,
  },
}
