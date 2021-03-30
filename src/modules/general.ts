import generalReducer from 'hkreducers/entities/general'
import { General } from 'hkconstants/general'
import { IModule } from 'redux-dynamic-modules-core'
import { GeneralAwareState } from 'types/general'

export const GeneralModule: IModule<GeneralAwareState> = {
  id: General.GENERAL_MODULE_NAME,
  reducerMap: {
    [General.GENERAL_MODULE_NAME]: generalReducer,
  },
}
