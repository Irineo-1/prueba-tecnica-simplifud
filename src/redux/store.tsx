import { configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import {usuario} from './usuario'

const persistConfig = {
  key: 'root',
  storage,
}

const usuarioPersistente = persistReducer(persistConfig, usuario.reducer)

export const store = configureStore({
  reducer: {
    user: usuarioPersistente
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
  }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store