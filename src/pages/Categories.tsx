import { Layout } from '@/components/layout/Layout';
import { CategoryCard } from '@/components/apps/CategoryCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useCategories } from '@/hooks/useApps';

export default function Categories() {
  const { data: categories, isLoading } = useCategories();

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">All Categories</h1>
          <p className="text-muted-foreground">Browse apps by category</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-36 rounded-xl" />
              ))
            : categories?.map(category => (
                <CategoryCard key={category.id} category={category} />
              ))}
        </div>
      </div>
    </Layout>
  );
}
