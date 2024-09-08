import { create } from 'zustand'

export const useVideoEventStore = create((set) => ({
    event: null,
    publish: (name, value) => set((state) => ({ event: { name, value } }))
}))
