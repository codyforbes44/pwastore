import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { AppGrid } from '@/components/apps/AppGrid';
import { EmptyState } from '@/components/common/EmptyState';
import { useSearchApps } from '@/hooks/useApps';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { data: apps, isLoading } = useSearchApps(query);

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Search Results</h1>
          <p className="text-muted-foreground">
            {query ? `Showing results for "${query}"` : 'Enter a search term to find apps'}
          </p>
        </div>

        {!query ? (
          <EmptyState
            icon={SearchIcon}
            title="Start searching"
            description="Enter a search term in the search bar to find apps"
          />
        ) : apps && apps.length === 0 && !isLoading ? (
          <EmptyState
            icon={SearchIcon}
            title="No apps found"
            description={`We couldn't find any apps matching "${query}". Try a different search term.`}
            actionLabel="Browse All Apps"
            actionLink="/browse"
          />
        ) : (
          <AppGrid apps={apps || []} loading={isLoading} columns={4} />
        )}
      </div>
    </Layout>
  );
}
