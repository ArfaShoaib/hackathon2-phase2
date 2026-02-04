import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Home,
  Calendar,
  CheckSquare,
  Star,
  Clock,
  Filter,
  X
} from 'lucide-react';

interface FilterSidebarProps {
  onFilterChange: (filter: string) => void;
  activeFilter: string;
  collapsed?: boolean;
  onCollapseToggle?: () => void;
}

export default function FilterSidebar({
  onFilterChange,
  activeFilter,
  collapsed = false,
  onCollapseToggle
}: FilterSidebarProps) {
  const [showLabels, setShowLabels] = useState(true);

  const filters = [
    { id: 'all', label: 'All Tasks', icon: Home, count: 12 },
    { id: 'today', label: 'Today', icon: Calendar, count: 3 },
    { id: 'completed', label: 'Completed', icon: CheckSquare, count: 5 },
    { id: 'important', label: 'Important', icon: Star, count: 7 },
    { id: 'upcoming', label: 'Upcoming', icon: Clock, count: 4 },
  ];

  const labels = [
    { id: 'work', label: 'Work', color: 'bg-[hsl(190,92%,65%)]' },
    { id: 'personal', label: 'Personal', color: 'bg-[hsl(160,80%,64%)]' },
    { id: 'urgent', label: 'Urgent', color: 'bg-[hsl(38,92%,65%)]' },
  ];

  if (collapsed) {
    return (
      <div className="w-20 flex flex-col items-center py-4 space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCollapseToggle}
          className="glass-button p-2 self-center"
        >
          <Filter className="h-5 w-5 text-[hsl(0,0%,98.5%)]" />
        </Button>

        {filters.map((filter) => {
          const IconComponent = filter.icon;
          return (
            <Button
              key={filter.id}
              variant="ghost"
              size="sm"
              onClick={() => onFilterChange(filter.id)}
              className={cn(
                "p-2 rounded-lg transition-colors w-12 h-12 flex flex-col items-center justify-center",
                activeFilter === filter.id
                  ? "bg-[hsl(190,92%,65%,0.2)] text-[hsl(190,92%,65%)] border border-[hsl(190,92%,65%,0.3)]"
                  : "text-[hsl(0,0%,72%)] hover:text-[hsl(0,0%,98.5%)] hover:bg-[hsl(25,30,70,0.2)]"
              )}
            >
              <IconComponent className="h-5 w-5" />
              <span className="text-xs mt-1">{filter.count}</span>
            </Button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="w-64 flex flex-col h-full">
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold bg-gradient-to-r from-[hsl(190,92%,65%)] to-[hsl(160,80%,64%)] bg-clip-text text-transparent">
            Filters
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCollapseToggle}
            className="glass-button p-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2 mb-8">
          {filters.map((filter) => {
            const IconComponent = filter.icon;
            return (
              <Button
                key={filter.id}
                variant="ghost"
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-[hsl(0,0%,98.5%)]",
                  activeFilter === filter.id
                    ? "bg-[hsl(190,92%,65%,0.2)] text-[hsl(190,92%,65%)] border border-[hsl(190,92%,65%,0.3)]"
                    : "hover:bg-[hsl(25,30,70,0.2)]"
                )}
                onClick={() => onFilterChange(filter.id)}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className="h-4 w-4" />
                  <span>{filter.label}</span>
                </div>
                <Badge variant="secondary" className="bg-[hsl(25,30,70,0.2)] text-[hsl(0,0%,98.5%)]">
                  {filter.count}
                </Badge>
              </Button>
            );
          })}
        </div>

        <div className="pt-4 border-t border-[hsl(120,190,255,0.1)]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-[hsl(0,0%,72%)] uppercase tracking-wider">
              Labels
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLabels(!showLabels)}
              className="h-6 w-6 p-0 glass-button"
            >
              <X className={`h-3 w-3 transition-transform ${showLabels ? '' : 'rotate-180'}`} />
            </Button>
          </div>

          {showLabels && (
            <div className="space-y-2">
              {labels.map((label) => (
                <Button
                  key={label.id}
                  variant="ghost"
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[hsl(0,0%,98.5%)] hover:bg-[hsl(25,30,70,0.2)]"
                >
                  <div className={`w-3 h-3 rounded-full ${label.color}`}></div>
                  <span>{label.label}</span>
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}