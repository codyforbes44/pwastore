import { Wifi, WifiOff, Bell, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface PWABadgesProps {
  offline: boolean;
  pushNotifications: boolean;
  installable: boolean;
  size?: 'sm' | 'md';
}

export function PWABadges({ offline, pushNotifications, installable, size = 'md' }: PWABadgesProps) {
  const badges = [
    { show: installable, icon: Download, label: 'Installable', description: 'Can be installed to your device', color: 'border-success/30 text-success' },
    { show: offline, icon: WifiOff, label: 'Offline', description: 'Works without internet connection', color: 'border-info/30 text-info' },
    { show: pushNotifications, icon: Bell, label: 'Push Notifications', description: 'Supports push notifications', color: 'border-warning/30 text-warning' },
  ];

  const iconSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className="flex flex-wrap gap-2">
      {badges.filter(b => b.show).map(({ icon: Icon, label, description, color }) => (
        <Tooltip key={label}>
          <TooltipTrigger>
            <Badge variant="outline" className={`${color} ${textSize} gap-1`}>
              <Icon className={iconSize} />
              {label}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>{description}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
