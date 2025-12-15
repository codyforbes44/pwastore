import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { Category } from '@/types/database';
import { LucideIcon } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  // Dynamically get the icon component
  const IconComponent = category.icon 
    ? (Icons[category.icon as keyof typeof Icons] as LucideIcon) 
    : Icons.Folder;

  return (
    <Link
      to={`/category/${category.slug}`}
      className="group block p-6 rounded-xl bg-card border border-border/50 transition-all duration-300 hover:border-primary/30 hover:shadow-glow text-center"
    >
      <div className="w-14 h-14 mx-auto mb-4 rounded-xl gradient-primary flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
        <IconComponent className="h-7 w-7 text-primary-foreground" />
      </div>
      <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
        {category.name}
      </h3>
      {category.description && (
        <p className="text-sm text-muted-foreground line-clamp-2">
          {category.description}
        </p>
      )}
    </Link>
  );
}