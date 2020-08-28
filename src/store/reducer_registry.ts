import { Reducer, AnyAction } from 'redux'

type EmitChange = (x: { [x: string]: Reducer<any, AnyAction> }) => void

// Reference: http://nicolasgallagher.com/redux-modules-and-code-splitting/
class ReducerRegistry {
  emitChange?: EmitChange
  reducers: Record<string, Reducer> = {}

  getReducers(): {
    [x: string]: Reducer<any, AnyAction>
  } {
    return { ...this.reducers }
  }

  setReducers = (reducers: Record<string, Reducer>) => {
    this.reducers = reducers
  }

  register(name, reducer) {
    this.reducers = { ...this.reducers, [name]: reducer }
    if (this.emitChange) {
      this.emitChange(this.getReducers())
    }
  }

  setChangeListener(listener) {
    this.emitChange = listener
  }
}

const reducerRegistry = new ReducerRegistry()
export default reducerRegistry
