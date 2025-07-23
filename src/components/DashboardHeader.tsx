import { Activity, RefreshCw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useMonitoringStore } from '@/store/monitoring';

export const DashboardHeader = () => {
  const { autoRefresh, refreshInterval, setAutoRefresh, refreshData, isLoading } = useMonitoringStore();

  const handleRefresh = async () => {
    await refreshData();
  };

  return (
    <header className="monitoring-header px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Activity className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dynatrace Monitor</h1>
            <p className="text-sm text-muted-foreground">System Problems Overview</p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <div className="flex items-center space-x-2">
          <Switch
            id="auto-refresh"
            checked={autoRefresh}
            onCheckedChange={setAutoRefresh}
          />
          <Label htmlFor="auto-refresh" className="text-sm">
            Auto-refresh ({Math.floor(refreshInterval / 60000)}min)
          </Label>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>

        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};