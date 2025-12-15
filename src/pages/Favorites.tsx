import { Heart } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { AppCard } from '@/components/apps/AppCard';
import { EmptyState } from '@/components/common/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { useUserFavorites, useToggleFavorite } from '@/hooks/useApps';

function FavoritesContent() {
  const { data: favorites, isLoading } = useUserFavorites();
  const { mutate: toggleFavorite } = useToggleFavorite();

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Favorites</h1>
          <p className="text-muted-foreground">Apps you've saved for later</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        ) : favorites && favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {favorites.map(fav => fav.app && (
              <AppCard
                key={fav.id}
                app={fav.app}
                isFavorite
                onToggleFavorite={() => toggleFavorite({ appId: fav.app_id, isFavorite: true })}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Heart}
            title="No favorites yet"
            description="Start exploring and save apps you like"
            actionLabel="Browse Apps"
            actionLink="/browse"
          />
        )}
      </div>
    </Layout>
  );
}

export default function Favorites() {
  return (
    <ProtectedRoute>
      <FavoritesContent />
    </ProtectedRoute>
  );
}
