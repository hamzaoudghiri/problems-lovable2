import { useEffect } from 'react';
import { DashboardHeader } from './DashboardHeader';
import { StatsCards } from './StatsCards';
import { ProblemList } from './ProblemList';
import { ProblemsOverTimeChart, ImpactedEntitiesChart, ProblemTypesChart, SeverityDistributionChart, EntityProblemChart } from './Charts';
import { AIInsights } from './AIInsights';
import { ProblemDetailsModal } from './ProblemDetailsModal';
import { EntityProblemGrouping } from './EntityProblemGrouping';
import { useMonitoringStore } from '@/store/monitoring';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Loader2 } from 'lucide-react';
export const MonitoringDashboard = () => {
  const {
    fetchProblems,
    isLoading,
    error
  } = useMonitoringStore();
  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);
  if (isLoading && !error) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading monitoring data...</span>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="px-6 py-6 space-y-6">
        {error && <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>}

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

        {/* Entity Problem Chart */}
        <EntityProblemChart />

        {/* Entity Problem Grouping */}
        <EntityProblemGrouping />

        {/* AI Insights */}
        <AIInsights />

        {/* Problems List */}
        <ProblemList />

        {/* API Configuration Notice */}
        
      </main>

      <ProblemDetailsModal />
    </div>;
};