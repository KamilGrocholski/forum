import { create } from 'zustand'

interface AppStoreState {
    layoutWidth: 'full' | 'container'
    setLayoutWidth: (width: 'full' | 'container') => void
    postThreadModal: boolean
    setPostThreadModal: (bool: boolean) => void
}

export const appStore = create<AppStoreState>(set => ({
    layoutWidth: 'container',
    setLayoutWidth: (width) => set(() => ({ layoutWidth: width })),
    postThreadModal: false,
    setPostThreadModal: (bool) => set(() => ({ postThreadModal: bool }))
}))
