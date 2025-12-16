import { Link } from 'react-router-dom';
import { Category } from '@/types/database';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { 
  Folder, Gamepad2, Briefcase, Users, Film, Wrench, 
  GraduationCap, Building2, Heart, type LucideIcon 
} from 'lucide-react';

// Safe icon map with only valid icon components
const iconMap: Record<string, LucideIcon> = {
  Folder,
  Gamepad2,
  Briefcase,
  Users,
  Film,
  Wrench,
  GraduationCap,
  Building2,
  Heart,
};

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Safe icon lookup with fallback
  const IconComponent = category.icon && iconMap[category.icon] 
    ? iconMap[category.icon] 
    : Folder;

  return (
    <Link
      to={`/category/${category.slug}`}
      className="group block p-6 rounded-xl bg-card border border-border/50 transition-all duration-300 hover:border-primary/30 hover:shadow-glow hover-lift text-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={cn(
        "w-14 h-14 mx-auto mb-4 rounded-xl gradient-primary flex items-center justify-center transition-all duration-500",
        isHovered && "scale-110 shadow-glow"
      )}>
        <IconComponent className={cn(
          "h-7 w-7 text-primary-foreground transition-transform duration-300",
          isHovered && "scale-110"
        )} />
      </div>
      <h3 className={cn(
        "font-semibold mb-1 transition-colors duration-300",
        isHovered && "text-primary"
      )}>
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
