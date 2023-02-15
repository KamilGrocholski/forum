interface StateWrapperProps<T> {
    data: T
    isLoading: boolean
    isError: boolean
    isEmpty?: boolean
    NonEmpty: (data: NonNullable<T>) => JSX.Element
    Empty?: React.ReactNode
    Error?: React.ReactNode
    Loading?: React.ReactNode
}

const StateWrapper = <T,>({
    data,
    isLoading,
    isError,
    isEmpty,
    NonEmpty,
    Empty = DefaultEmpty,
    Error = DefaultError,
    Loading = DefaultLoading
}: StateWrapperProps<T>) => {
    if (isLoading) return <>{Loading}</>
    if (isError) return <>{Error}</>

    if (isEmpty) return <>{Empty}</>
    // When data is an array
    if (Array.isArray(data) && data.length === 0) return <>{Empty}</>

    if (data === undefined || data === null) return <>{Empty}</>

    return NonEmpty(data)
}

export default StateWrapper

const DefaultEmpty = <div>Empty</div>
const DefaultLoading = <div>Loading</div>
const DefaultError = <div>Error</div>