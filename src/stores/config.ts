import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createSelectors } from './withSelectors'

type TTheme = 'light' | 'dark'

interface IStore {
  theme: TTheme
  actions: {
    updateTheme: (theme: TTheme) => void
  }
}

const initialState: Omit<IStore, 'actions'> = {
  theme: 'dark',
}

const configStore = create<IStore>()(
  persist<IStore>(
    set => ({
      ...initialState,
      actions: {
        updateTheme: theme => set({ theme }),
      },
    }),
    {
      name: 'WA_CONFIG_STORAGE',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ actions, ...rest }: IStore) => ({ ...rest }) as IStore,
    },
  ),
)

export const useConfigStore = createSelectors(configStore)
