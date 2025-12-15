import { History as HistoryIcon, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Layout } from '@/components/layout/Layout';
import { AppCard } from '@/components/apps/AppCard';
import { EmptyState } from '@/components/common/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { useAppHistory } from '@/hooks/useDeveloper';

function HistoryContent() {
  const { data: history, isLoading } = useAppHistory();

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Apps</h1>
            <p className="text-muted-foreground">Apps you've viewed and installed</p>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        ) : history && history.length > 0 ? (
          <div className="space-y-3">
            {history.map(item => item.app && (
              <div key={item.id} className="flex items-center gap-4">
                <div className="flex-1">
                  <AppCard app={item.app} variant="compact" />
                </div>
                <div className="text-xs text-muted-foreground text-right">
                  <div className="capitalize">{item.action_type}</div>
                  <div>{formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={HistoryIcon}
            title="No history yet"
            description="Apps you view will appear here"
            actionLabel="Browse Apps"
            actionLink="/browse"
          />
        )}
      </div>
    </Layout>
  );
}

export default function History() {
  return (
    <ProtectedRoute>
      <HistoryContent />
    </ProtectedRoute>
  );
}
