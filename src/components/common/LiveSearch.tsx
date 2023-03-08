import clsx from "clsx";
import { useEffect, useState } from "react";

export interface LiveSearchProps<T> {
  onEnter: (suggestion: T) => void;
  suggestions: T[];
  queryState: [string, React.Dispatch<string>];
  extractQuery: (suggestions: T) => string;
  renderSuggestion: (item: T, isSelected: boolean) => React.ReactNode;
  extractSuggestionKey: (item: T) => string;
}

const LiveSearch = <T,>({
  onEnter,
  suggestions,
  extractQuery,
  renderSuggestion,
  extractSuggestionKey,
  queryState: [query, setQuery],
}: LiveSearchProps<T>) => {
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (suggestions[selectedSuggestionIndex] === undefined) {
      setSelectedSuggestionIndex(-1);
    }
  }, [extractQuery, selectedSuggestionIndex, suggestions]);

  return (
    <div className="flex flex-col space-y-3 rounded bg-zinc-900 p-2">
      <div className="text-xl font-semibold">Search threads</div>
      <input
        placeholder="Type anything..."
        className="p-3 text-lg"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (suggestions[selectedSuggestionIndex] !== undefined) {
              onEnter(suggestions[selectedSuggestionIndex] as T);
              console.log(suggestions[selectedSuggestionIndex]);
            }
            return;
          }
          if (e.key === "ArrowDown") {
            setSelectedSuggestionIndex(
              selectedSuggestionIndex >= suggestions.length - 1
                ? 0
                : selectedSuggestionIndex + 1
            );
            return;
          }
          if (e.key === "ArrowUp") {
            setSelectedSuggestionIndex(
              selectedSuggestionIndex <= 0
                ? suggestions.length - 1
                : selectedSuggestionIndex - 1
            );
            return;
          }
        }}
        autoFocus
      />
      {showSuggestions ? (
        <div tabIndex={0} className="bg-zinc-800">
          {suggestions.map((suggestion, suggestionIndex) => (
            <button
              className={clsx(
                "flex w-full flex-col px-2 py-1",
                selectedSuggestionIndex === suggestionIndex
                  ? "bg-red-900 transition-all duration-200 ease-in-out"
                  : "hover:bg-red-900/50"
              )}
              //   setSelectedSuggestionIndex(suggestionIndex)
              onClick={() => {
                setSelectedSuggestionIndex(suggestionIndex);
                if (suggestions[selectedSuggestionIndex] !== undefined) {
                  onEnter(suggestions[selectedSuggestionIndex] as T);
                }
              }}
              key={extractSuggestionKey(suggestion)}
            >
              {renderSuggestion(
                suggestion,
                suggestionIndex === selectedSuggestionIndex
              )}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default LiveSearch;
