import useSsr from "./useSsr"

function useScrollTo(options: ScrollToOptions) {
    const {isBrowser} = useSsr()

    return () => {
        if (isBrowser) {
            window.scrollTo(options)
        }
    }
}

export default useScrollTo