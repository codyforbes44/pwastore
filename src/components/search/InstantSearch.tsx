import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Clock, TrendingUp, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface SearchSuggestion {
  id: string;
  name: string;
  slug: string;
  icon_url: string | null;
}

interface InstantSearchProps {
  className?: string;
  size?: 'default' | 'large';
  placeholder?: string;
}

const RECENT_SEARCHES_KEY = 'pwa-store-recent-searches';
const MAX_RECENT = 5;

export function InstantSearch({ className, size = 'default', placeholder = 'Search apps...' }: InstantSearchProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load recent searches
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  // Save recent search
  const saveRecentSearch = useCallback((term: string) => {
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, MAX_RECENT);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  }, [recentSearches]);

  // Clear recent search
  const clearRecentSearch = (term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentSearches.filter(s => s !== term);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      const { data } = await supabase
        .from('apps')
        .select('id, name, slug, icon_url')
        .eq('status', 'published')
        .ilike('name', `%${query}%`)
        .limit(5);
      
      setSuggestions(data || []);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = query ? suggestions : recentSearches;
    const maxIndex = items.length - 1;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < maxIndex ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : maxIndex));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && query && suggestions[selectedIndex]) {
          navigate(`/app/${suggestions[selectedIndex].slug}`);
        } else if (selectedIndex >= 0 && !query && recentSearches[selectedIndex]) {
          handleSearch(recentSearches[selectedIndex]);
        } else if (query.trim()) {
          handleSearch(query);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSearch = (term: string) => {
    saveRecentSearch(term);
    setIsOpen(false);
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      handleSearch(query.trim());
    }
  };

  const isLarge = size === 'large';

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground",
            isLarge ? "h-5 w-5" : "h-4 w-4"
          )} />
          <Input
            ref={inputRef}
            type="search"
            placeholder={placeholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(-1);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            className={cn(
              "bg-card border-border/50 focus:border-primary transition-all",
              isLarge ? "pl-12 pr-28 h-14 text-lg rounded-xl" : "pl-10 pr-4"
            )}
          />
          {isLarge && (
            <Button 
              type="submit" 
              size="lg" 
              className="absolute right-2 top-1/2 -translate-y-1/2 gradient-primary shadow-glow"
            >
              Search
            </Button>
          )}
        </div>
      </form>

      {/* Dropdown */}
      {isOpen && (query || recentSearches.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border/50 rounded-xl shadow-lg overflow-hidden z-50 animate-fade-in">
          {/* Recent Searches */}
          {!query && recentSearches.length > 0 && (
            <div className="p-2">
              <p className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Clock className="h-3 w-3" />
                Recent Searches
              </p>
              {recentSearches.map((term, i) => (
                <button
                  key={term}
                  onClick={() => handleSearch(term)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                    selectedIndex === i ? "bg-primary/10 text-primary" : "hover:bg-secondary"
                  )}
                >
                  <span>{term}</span>
                  <X 
                    className="h-4 w-4 text-muted-foreground hover:text-foreground" 
                    onClick={(e) => clearRecentSearch(term, e)}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Search Suggestions */}
          {query && (
            <div className="p-2">
              {isLoading ? (
                <div className="px-3 py-4 text-center text-muted-foreground text-sm">
                  Searching...
                </div>
              ) : suggestions.length > 0 ? (
                <>
                  <p className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="h-3 w-3" />
                    Suggestions
                  </p>
                  {suggestions.map((app, i) => (
                    <button
                      key={app.id}
                      onClick={() => navigate(`/app/${app.slug}`)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                        selectedIndex === i ? "bg-primary/10 text-primary" : "hover:bg-secondary"
                      )}
                    >
                      {app.icon_url ? (
                        <img src={app.icon_url} alt="" className="w-8 h-8 rounded-lg object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
                          {app.name.charAt(0)}
                        </div>
                      )}
                      <span className="font-medium">{app.name}</span>
                    </button>
                  ))}
                </>
              ) : (
                <div className="px-3 py-4 text-center text-muted-foreground text-sm">
                  No apps found for "{query}"
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
