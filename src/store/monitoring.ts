import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export interface Problem {
  problemId: string;
  displayId: string;
  title: string;
  impactLevel: 'APPLICATION' | 'SERVICE' | 'INFRASTRUCTURE';
  severityLevel: 'AVAILABILITY' | 'ERROR' | 'PERFORMANCE' | 'RESOURCE' | 'CUSTOM';
  status: 'OPEN' | 'RESOLVED' | 'CLOSED';
  startTime: number;
  endTime?: number;
  affectedEntities: Array<{
    entityId: string;
    displayName: string;
    entityType: string;
  }>;
  rootCauseEntity?: {
    entityId: string;
    displayName: string;
    entityType: string;
  };
  managementZones: Array<{
    id: string;
    name: string;
  }>;
  evidenceDetails?: {
    displayName: string;
    entity?: {
      entityId: string;
      displayName: string;
      entityType: string;
    };
    evidenceType: string;
    groupingEntity?: {
      entityId: string;
      displayName: string;
      entityType: string;
    };
    rootCauseRelevant: boolean;
    startTime: number;
    unit?: string;
    details?: {
      displayName: string;
      data: number[][];
      tags?: string[];
    };
  };
  recentComments?: Array<{
    id: string;
    content: string;
    context: string;
    createdAtTimestamp: number;
    authorName: string;
  }>;
}

export interface DashboardStats {
  totalProblems: number;
  openProblems: number;
  resolvedProblems: number;
  criticalProblems: number;
  averageResolutionTime: number;
}

export interface ChartData {
  problemsOverTime: Array<{
    timestamp: number;
    count: number;
    date: string;
  }>;
  impactedEntities: Array<{
    entityName: string;
    totalDowntime: number;
    problemCount: number;
  }>;
  problemTypes: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  severityDistribution: Array<{
    severity: string;
    count: number;
    percentage: number;
  }>;
}

interface MonitoringState {
  problems: Problem[];
  stats: DashboardStats;
  chartData: ChartData;
  selectedProblem: Problem | null;
  isLoading: boolean;
  error: string | null;
  autoRefresh: boolean;
  refreshInterval: number;
  timeRange: {
    from: string;
    to: string;
  };
  filters: {
    status: string[];
    severity: string[];
    entityTypes: string[];
    searchQuery: string;
  };

  // Actions
  setProblems: (problems: Problem[]) => void;
  setStats: (stats: DashboardStats) => void;
  setChartData: (chartData: ChartData) => void;
  setSelectedProblem: (problem: Problem | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setAutoRefresh: (autoRefresh: boolean) => void;
  setRefreshInterval: (interval: number) => void;
  setTimeRange: (timeRange: { from: string; to: string }) => void;
  setFilters: (filters: Partial<MonitoringState['filters']>) => void;
  fetchProblems: () => Promise<void>;
  refreshData: () => Promise<void>;
}

export const useMonitoringStore = create<MonitoringState>()(
  subscribeWithSelector((set, get) => ({
    problems: [],
    stats: {
      totalProblems: 0,
      openProblems: 0,
      resolvedProblems: 0,
      criticalProblems: 0,
      averageResolutionTime: 0,
    },
    chartData: {
      problemsOverTime: [],
      impactedEntities: [],
      problemTypes: [],
      severityDistribution: [],
    },
    selectedProblem: null,
    isLoading: false,
    error: null,
    autoRefresh: false,
    refreshInterval: 300000, // 5 minutes default
    timeRange: {
      from: 'now-1M',
      to: 'now',
    },
    filters: {
      status: [],
      severity: [],
      entityTypes: [],
      searchQuery: '',
    },

    setProblems: (problems) => set({ problems }),
    setStats: (stats) => set({ stats }),
    setChartData: (chartData) => set({ chartData }),
    setSelectedProblem: (problem) => set({ selectedProblem: problem }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    setAutoRefresh: (autoRefresh) => set({ autoRefresh }),
    setRefreshInterval: (interval) => set({ refreshInterval: interval }),
    setTimeRange: (timeRange) => set({ timeRange }),
    setFilters: (newFilters) =>
      set((state) => ({
        filters: { ...state.filters, ...newFilters },
      })),

    fetchProblems: async () => {
      const state = get();
      state.setLoading(true);
      state.setError(null);

      try {
        // This will be replaced with actual API call
        const { fetchDynatraceProblems } = await import('../services/api');
        const data = await fetchDynatraceProblems(state.timeRange);
        
        state.setProblems(data.problems);
        state.setStats(data.stats);
        state.setChartData(data.chartData);
      } catch (error) {
        state.setError(error instanceof Error ? error.message : 'Failed to fetch problems');
      } finally {
        state.setLoading(false);
      }
    },

    refreshData: async () => {
      await get().fetchProblems();
    },
  }))
);

// Auto refresh subscription
let refreshInterval: NodeJS.Timeout | null = null;

useMonitoringStore.subscribe(
  (state) => ({ autoRefresh: state.autoRefresh, refreshInterval: state.refreshInterval }),
  ({ autoRefresh, refreshInterval: interval }) => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
      refreshInterval = null;
    }

    if (autoRefresh) {
      refreshInterval = setInterval(() => {
        useMonitoringStore.getState().refreshData();
      }, interval);
    }
  }
);