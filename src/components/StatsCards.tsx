import { AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMonitoringStore } from '@/store/monitoring';

export const StatsCards = () => {
  const { stats } = useMonitoringStore();

  const statsData = [
    {
      title: 'Total Problems',
      value: stats.totalProblems,
      icon: TrendingUp,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Open Problems',
      value: stats.openProblems,
      icon: AlertTriangle,
      color: 'text-monitoring-critical',
      bgColor: 'bg-monitoring-critical/10',
      pulse: stats.openProblems > 0,
    },
    {
      title: 'Resolved Today',
      value: stats.resolvedProblems,
      icon: CheckCircle,
      color: 'text-monitoring-resolved',
      bgColor: 'bg-monitoring-resolved/10',
    },
    {
      title: 'Avg Resolution Time',
      value: `${stats.averageResolutionTime}m`,
      icon: Clock,
      color: 'text-monitoring-medium',
      bgColor: 'bg-monitoring-medium/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {statsData.map((stat, index) => (
        <Card 
          key={stat.title} 
          className={`monitoring-card border-border/50 ${
            stat.pulse ? 'animate-pulse-monitoring' : ''
          } animate-fade-in`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};