// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    loading: false as boolean,
    username: '' as string,
    password: '' as string,
    selectedDate: new Date(),
    currentStore: null as any,
    progress: 0 as number
  }),
  getters: {
    isLoading: (state): boolean => state.loading,
    getAuthCredentials: (state): { username: string; password: string } => {
      return {
        username: state.username,
        password: state.password
      }
    },
    getAPIFormattedDate: (state): string => {
      const year = state.selectedDate.getFullYear()
      const month = state.selectedDate.getMonth() + 1 < 10 ? '0' + (state.selectedDate.getMonth() + 1) : state.selectedDate.getMonth() + 1
      const day = state.selectedDate.getDate() < 10 ? '0' + state.selectedDate.getDate() : state.selectedDate.getDate()
      return  year + '-' + month + '-' + day
    },
    getAPIFormattedDateMinus30: (state): string => {
      const historyDate = new Date(state.selectedDate)
      historyDate.setDate(historyDate.getDate() - 30)
      const year = historyDate.getFullYear()
      const month = historyDate.getMonth() + 1 < 10 ? '0' + (historyDate.getMonth() + 1) : historyDate.getMonth() + 1
      const day = historyDate.getDate() < 10 ? '0' + historyDate.getDate() : historyDate.getDate()
      return  year + '-' + month + '-' + day
    },
    getSelectedDate: (state) => state.selectedDate,
    getCurrentStore: (state) => state.currentStore,
    getProgress: (state) => state.progress
  },
  actions: {
    setLoading(loading: boolean) {
      this.loading = loading
    },
    setAuthCredentials(username: string, password: string) {
      this.username = username
      this.password = password
    },
    setSelectedDate(date: any) {
      this.selectedDate = date
    },
    setCurrentStore(store: any) {
      this.currentStore = store
    },
    setProgress(progress: number) {
      this.progress = progress
    }
  }
})
