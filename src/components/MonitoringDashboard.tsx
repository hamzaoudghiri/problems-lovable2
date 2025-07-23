import { useEffect } from 'react';
import { DashboardHeader } from './DashboardHeader';
import { StatsCards } from './StatsCards';
import { ProblemList } from './ProblemList';
import { ProblemsOverTimeChart, ImpactedEntitiesChart, ProblemTypesChart, SeverityDistributionChart } from './Charts';
import { AIInsights } from './AIInsights';
import { ProblemDetailsModal } from './ProblemDetailsModal';
import { useMonitoringStore } from '@/store/monitoring';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Loader2 } from 'lucide-react';

export const MonitoringDashboard = () => {
  const { fetchProblems, isLoading, error } = useMonitoringStore();

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  if (isLoading && !error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading monitoring data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="px-6 py-6 space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}

        <StatsCards />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProblemsOverTimeChart />
          <ImpactedEntitiesChart />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProblemTypesChart />
          <SeverityDistributionChart />
        </div>

        {/* AI Insights */}
        <AIInsights />

        {/* Problems List */}
        <ProblemList />

        {/* API Configuration Notice */}
        <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            📋 API Configuration Required
          </h3>
          <p className="text-muted-foreground mb-4">
            This dashboard is currently showing mock data. To connect to your Dynatrace environment:
          </p>
          <div className="space-y-2 text-sm">
            <p>1. Replace <code className="bg-muted px-2 py-1 rounded text-foreground">YOUR_ENVIRONMENT</code> in <code className="bg-muted px-2 py-1 rounded text-foreground">src/services/api.ts</code></p>
            <p>2. Add your API token to <code className="bg-muted px-2 py-1 rounded text-foreground">YOUR_API_TOKEN</code></p>
            <p>3. Get your API token from Dynatrace: Settings → Integration → Dynatrace API</p>
          </div>
        </div>
      </main>

      <ProblemDetailsModal />
    </div>
  );
};