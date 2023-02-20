import { useEffect, useState } from "react"

export interface LiveSearchProps<
    T
> {
    onSearch: (query: string, options: { close?: boolean, focus?: boolean }) => void
    fetchSuggestions: (query: string) => T[]
    extractQuery: (suggestions: T) => string
    renderSuggestion: (item: T, isSelected: boolean) => React.ReactNode
    extractSuggestionKey: (item: T) => string
}

const LiveSearch = <T,>({
    onSearch,
    fetchSuggestions,
    extractQuery,
    renderSuggestion,
    extractSuggestionKey
}: LiveSearchProps<T>) => {
    const [query, setQuery] = useState<string>('')
    const [suggestions, setSuggestions] = useState<T[]>([])
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
    const [showSuggestions, setShowSuggestions] = useState(false)

    useEffect(() => {
        if (suggestions[selectedSuggestionIndex] !== undefined) {
            setSelectedSuggestionIndex(-1)
            setQuery(extractQuery(suggestions[selectedSuggestionIndex] as T))
        }
    }, [extractQuery, selectedSuggestionIndex, suggestions])

    useEffect(() => {
        const newSuggestions = fetchSuggestions(query)
        setSuggestions(newSuggestions)
    }, [query, fetchSuggestions])

    return (
        <div>
            <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={e => {
                    if (e.key === 'Enter') {
                        onSearch(query, {})
                    }
                }}
                autoFocus
            />
            {showSuggestions ?
                <div tabIndex={0}>
                    {suggestions.map((suggestion, suggestionIndex) => (
                        <button
                            className='flex flex-col'
                            onClick={() => setSelectedSuggestionIndex(suggestionIndex)}
                            key={extractSuggestionKey(suggestion)}
                        >
                            {renderSuggestion(suggestion, suggestionIndex === selectedSuggestionIndex)}
                        </button>
                    ))}
                </div> : null}
        </div>
    )
}

export default LiveSearch