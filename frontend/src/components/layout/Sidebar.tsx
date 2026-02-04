'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Home,
  Calendar,
  CheckSquare,
  Star,
  Bell,
  Settings,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  collapsed?: boolean;
  onCollapseToggle?: () => void;
}

export default function Sidebar({
  collapsed = false,
  onCollapseToggle
}: SidebarProps) {
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All Tasks', icon: Home },
    { id: 'today', label: 'Today', icon: Calendar },
    { id: 'completed', label: 'Completed', icon: CheckSquare },
    { id: 'important', label: 'Important', icon: Star },
    { id: 'upcoming', label: 'Upcoming', icon: Bell },
  ];

  return (
    <aside
      className={cn(
        "h-full bg-[#05040f] bg-opacity-80 backdrop-blur-22px border-r border-[hsl(120,190,255,0.1)] transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="p-4">
        {!collapsed && (
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
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        )}

        {collapsed ? (
          <div className="flex flex-col items-center space-y-4 py-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onCollapseToggle}
              className="glass-button p-2 mb-4"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            {filters.map((filter) => {
              const IconComponent = filter.icon;
              return (
                <Link
                  key={filter.id}
                  href={`/tasks?filter=${filter.id}`}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    activeFilter === filter.id
                      ? "bg-[hsl(190,92%,65%,0.2)] text-[hsl(190,92%,65%)]"
                      : "text-[hsl(0,0%,72%)] hover:text-[hsl(0,0%,98.5%)] hover:bg-[hsl(25,30,70,0.2)]"
                  )}
                >
                  <IconComponent className="h-5 w-5" />
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            <Button className="w-full bg-gradient-to-r from-[hsl(190,92%,65%)] to-[hsl(160,80%,64%)] hover:opacity-90 mb-6">
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>

            <div className="space-y-1">
              {filters.map((filter) => {
                const IconComponent = filter.icon;
                return (
                  <Link
                    key={filter.id}
                    href={`/tasks?filter=${filter.id}`}
                    className={cn(
                      "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors text-[hsl(0,0%,98.5%)]",
                      activeFilter === filter.id
                        ? "bg-[hsl(190,92%,65%,0.2)] text-[hsl(190,92%,65%)] border border-[hsl(190,92%,65%,0.3)]"
                        : "hover:bg-[hsl(25,30,70,0.2)]"
                    )}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{filter.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-[hsl(120,190,255,0.1)]">
              <h3 className="text-xs font-semibold text-[hsl(0,0%,72%)] uppercase tracking-wider mb-3">
                Labels
              </h3>
              <div className="space-y-1">
                <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-[hsl(0,0%,98.5%)] hover:bg-[hsl(25,30,70,0.2)]">
                  <div className="w-3 h-3 rounded-full bg-[hsl(190,92%,65%)]"></div>
                  <span>Work</span>
                </button>
                <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-[hsl(0,0%,98.5%)] hover:bg-[hsl(25,30,70,0.2)]">
                  <div className="w-3 h-3 rounded-full bg-[hsl(160,80%,64%)]"></div>
                  <span>Personal</span>
                </button>
                <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-[hsl(0,0%,98.5%)] hover:bg-[hsl(25,30,70,0.2)]">
                  <div className="w-3 h-3 rounded-full bg-[hsl(38,92%,65%)]"></div>
                  <span>Urgent</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}