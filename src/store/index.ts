/* eslint-disable @typescript-eslint/no-var-requires */
const config =
  process.env.NODE_ENV === 'production'
    ? require('./configureStore.dev').default
    : require('./configureStore.dev').default
export default config
