import { create } from 'zustand'

export const useConnectionStore = create((set) => ({
    connection: null,
    set: (conn) => set((state) => ({ connection: conn }))
}))
