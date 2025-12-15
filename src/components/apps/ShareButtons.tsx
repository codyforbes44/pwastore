import { Twitter, Facebook, Linkedin, Link2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface ShareButtonsProps {
  title: string;
  url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const shareLinks = [
    { icon: Twitter, href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`, label: 'Twitter' },
    { icon: Facebook, href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, label: 'Facebook' },
    { icon: Linkedin, href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`, label: 'LinkedIn' },
  ];

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast({ title: 'Link copied!' });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">Share:</span>
      {shareLinks.map(({ icon: Icon, href, label }) => (
        <Button key={label} variant="ghost" size="icon" className="h-8 w-8" asChild>
          <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
            <Icon className="h-4 w-4" />
          </a>
        </Button>
      ))}
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyLink}>
        {copied ? <Check className="h-4 w-4 text-success" /> : <Link2 className="h-4 w-4" />}
      </Button>
    </div>
  );
}
