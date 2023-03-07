import { toastsStore } from '../store/toastsStore'
import { shallow } from 'zustand/shallow'

const useToasts = () => {
    const actions = toastsStore(
        store => ({
            push: store.push,
            clear: store.clear,
            close: store.close
        }),
        shallow
    )

    return actions
}

export default useToasts