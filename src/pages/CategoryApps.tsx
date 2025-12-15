import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { AppGrid } from '@/components/apps/AppGrid';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/common/EmptyState';
import { useAppsByCategory, useCategories } from '@/hooks/useApps';
import { Folder } from 'lucide-react';

export default function CategoryApps() {
  const { slug } = useParams<{ slug: string }>();
  const { data: apps, isLoading } = useAppsByCategory(slug);
  const { data: categories } = useCategories();

  const category = categories?.find(c => c.slug === slug);
  const IconComponent = category?.icon
    ? (Icons[category.icon as keyof typeof Icons] as LucideIcon)
    : Folder;

  return (
    <Layout>
      <div className="container py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/categories"><ArrowLeft className="mr-2 h-4 w-4" /> All Categories</Link>
        </Button>

        <div className="flex items-center gap-4 mb-8">
          {category && (
            <div className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center">
              <IconComponent className="h-8 w-8 text-primary-foreground" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold">{category?.name || 'Category'}</h1>
            {category?.description && (
              <p className="text-muted-foreground mt-1">{category.description}</p>
            )}
          </div>
        </div>

        {apps && apps.length === 0 && !isLoading ? (
          <EmptyState
            icon={Folder}
            title="No apps in this category"
            description="There are no published apps in this category yet."
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
