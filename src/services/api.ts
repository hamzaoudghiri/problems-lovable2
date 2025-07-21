import axios from 'axios';
import { Problem, DashboardStats, ChartData } from '../store/monitoring';

// Dynatrace API configuration
const DYNATRACE_BASE_URL = 'https://YOUR_ENVIRONMENT.live.dynatrace.com/api/v2';
const API_TOKEN = 'YOUR_API_TOKEN'; // This should be configured by the user

const dynatraceApi = axios.create({
  baseURL: DYNATRACE_BASE_URL,
  headers: {
    'Authorization': `Api-Token ${API_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

// Mock data for demonstration purposes
const generateMockProblems = (): Problem[] => {
  const mockProblems: Problem[] = [
    {
      problemId: 'PROBLEM-1A2B3C4D5E6F',
      displayId: 'P-23001',
      title: 'High response time on easyTravel Frontend',
      impactLevel: 'APPLICATION',
      severityLevel: 'PERFORMANCE',
      status: 'OPEN',
      startTime: Date.now() - 3600000, // 1 hour ago
      affectedEntities: [
        {
          entityId: 'APPLICATION-EA7C4B59F27D43EB',
          displayName: 'easyTravel Frontend',
          entityType: 'APPLICATION'
        },
        {
          entityId: 'SERVICE-F2D3E4A5B6C7D8E9',
          displayName: 'AuthenticationService',
          entityType: 'SERVICE'
        }
      ],
      rootCauseEntity: {
        entityId: 'SERVICE-F2D3E4A5B6C7D8E9',
        displayName: 'AuthenticationService',
        entityType: 'SERVICE'
      },
      managementZones: [
        {
          id: 'MZ-1234567890',
          name: 'Production Environment'
        }
      ],
      evidenceDetails: {
        displayName: 'Response time degradation',
        evidenceType: 'METRIC_EVENT',
        rootCauseRelevant: true,
        startTime: Date.now() - 3600000,
        unit: 'MicroSecond',
        details: {
          displayName: 'Service response time',
          data: [[Date.now() - 3600000, 1500], [Date.now() - 1800000, 2300], [Date.now(), 3200]],
        }
      }
    },
    {
      problemId: 'PROBLEM-2B3C4D5E6F7G',
      displayId: 'P-23002',
      title: 'Database connection failures',
      impactLevel: 'INFRASTRUCTURE',
      severityLevel: 'AVAILABILITY',
      status: 'RESOLVED',
      startTime: Date.now() - 7200000, // 2 hours ago
      endTime: Date.now() - 1800000, // 30 minutes ago
      affectedEntities: [
        {
          entityId: 'DATABASE-1A2B3C4D5E6F',
          displayName: 'CustomerDB',
          entityType: 'DATABASE'
        }
      ],
      rootCauseEntity: {
        entityId: 'HOST-9F8E7D6C5B4A',
        displayName: 'prod-db-01',
        entityType: 'HOST'
      },
      managementZones: [
        {
          id: 'MZ-1234567890',
          name: 'Production Environment'
        }
      ],
      evidenceDetails: {
        displayName: 'Connection pool exhaustion',
        evidenceType: 'AVAILABILITY_EVENT',
        rootCauseRelevant: true,
        startTime: Date.now() - 7200000,
      }
    },
    {
      problemId: 'PROBLEM-3C4D5E6F7G8H',
      displayId: 'P-23003',
      title: 'CPU utilization spike on web servers',
      impactLevel: 'INFRASTRUCTURE',
      severityLevel: 'RESOURCE',
      status: 'OPEN',
      startTime: Date.now() - 1800000, // 30 minutes ago
      affectedEntities: [
        {
          entityId: 'HOST-A1B2C3D4E5F6',
          displayName: 'web-server-01',
          entityType: 'HOST'
        },
        {
          entityId: 'HOST-B2C3D4E5F6A7',
          displayName: 'web-server-02',
          entityType: 'HOST'
        }
      ],
      managementZones: [
        {
          id: 'MZ-1234567890',
          name: 'Production Environment'
        }
      ],
      evidenceDetails: {
        displayName: 'High CPU usage',
        evidenceType: 'METRIC_EVENT',
        rootCauseRelevant: true,
        startTime: Date.now() - 1800000,
        unit: 'Percent'
      }
    },
    {
      problemId: 'PROBLEM-4D5E6F7G8H9I',
      displayId: 'P-23004',
      title: 'Payment service error rate increase',
      impactLevel: 'SERVICE',
      severityLevel: 'ERROR',
      status: 'OPEN',
      startTime: Date.now() - 900000, // 15 minutes ago
      affectedEntities: [
        {
          entityId: 'SERVICE-C3D4E5F6A7B8',
          displayName: 'PaymentService',
          entityType: 'SERVICE'
        }
      ],
      managementZones: [
        {
          id: 'MZ-1234567890',
          name: 'Production Environment'
        }
      ],
      evidenceDetails: {
        displayName: 'Increased failure rate',
        evidenceType: 'ERROR_EVENT',
        rootCauseRelevant: true,
        startTime: Date.now() - 900000,
        unit: 'Percent'
      }
    }
  ];

  return mockProblems;
};

const generateMockStats = (problems: Problem[]): DashboardStats => {
  const openProblems = problems.filter(p => p.status === 'OPEN').length;
  const resolvedProblems = problems.filter(p => p.status === 'RESOLVED').length;
  const criticalProblems = problems.filter(p => 
    p.severityLevel === 'AVAILABILITY' || p.severityLevel === 'ERROR'
  ).length;
  
  const resolvedWithDuration = problems.filter(p => p.status === 'RESOLVED' && p.endTime);
  const averageResolutionTime = resolvedWithDuration.length > 0
    ? resolvedWithDuration.reduce((sum, p) => sum + (p.endTime! - p.startTime), 0) / resolvedWithDuration.length / 1000 / 60 // in minutes
    : 0;

  return {
    totalProblems: problems.length,
    openProblems,
    resolvedProblems,
    criticalProblems,
    averageResolutionTime: Math.round(averageResolutionTime),
  };
};

const generateMockChartData = (problems: Problem[]): ChartData => {
  // Problems over time (last 24 hours)
  const now = Date.now();
  const problemsOverTime = [];
  for (let i = 23; i >= 0; i--) {
    const timestamp = now - (i * 60 * 60 * 1000);
    const date = new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const count = Math.floor(Math.random() * 8) + 1;
    problemsOverTime.push({ timestamp, count, date });
  }

  // Impacted entities by downtime
  const entityDowntime: { [key: string]: { totalDowntime: number; problemCount: number } } = {};
  problems.forEach(problem => {
    problem.affectedEntities.forEach(entity => {
      if (!entityDowntime[entity.displayName]) {
        entityDowntime[entity.displayName] = { totalDowntime: 0, problemCount: 0 };
      }
      const duration = problem.endTime 
        ? (problem.endTime - problem.startTime) / 1000 / 60 // minutes
        : (now - problem.startTime) / 1000 / 60; // minutes for ongoing problems
      entityDowntime[entity.displayName].totalDowntime += duration;
      entityDowntime[entity.displayName].problemCount += 1;
    });
  });

  const impactedEntities = Object.entries(entityDowntime)
    .map(([entityName, data]) => ({
      entityName,
      totalDowntime: Math.round(data.totalDowntime),
      problemCount: data.problemCount,
    }))
    .sort((a, b) => b.totalDowntime - a.totalDowntime)
    .slice(0, 10);

  // Problem types distribution
  const typeCount: { [key: string]: number } = {};
  problems.forEach(problem => {
    typeCount[problem.severityLevel] = (typeCount[problem.severityLevel] || 0) + 1;
  });

  const totalProblems = problems.length;
  const problemTypes = Object.entries(typeCount).map(([type, count]) => ({
    type,
    count,
    percentage: Math.round((count / totalProblems) * 100),
  }));

  // Severity distribution
  const severityLabels: { [key: string]: string } = {
    'AVAILABILITY': 'Critical',
    'ERROR': 'High',
    'PERFORMANCE': 'Medium',
    'RESOURCE': 'Low',
    'CUSTOM': 'Info'
  };

  const severityDistribution = Object.entries(typeCount).map(([severity, count]) => ({
    severity: severityLabels[severity] || severity,
    count,
    percentage: Math.round((count / totalProblems) * 100),
  }));

  return {
    problemsOverTime,
    impactedEntities,
    problemTypes,
    severityDistribution,
  };
};

export const fetchDynatraceProblems = async (timeRange: { from: string; to: string }) => {
  try {
    // For now, we'll use mock data since the user hasn't configured their API token yet
    // In production, this would make the actual API call:
    /*
    const response = await dynatraceApi.get('/problems', {
      params: {
        from: timeRange.from,
        to: timeRange.to,
        fields: '+evidenceDetails,+recentComments,+impactAnalysis'
      }
    });
    const problems = response.data.problems;
    */

    // Using mock data for demonstration
    const problems = generateMockProblems();
    const stats = generateMockStats(problems);
    const chartData = generateMockChartData(problems);

    return { problems, stats, chartData };
  } catch (error) {
    console.error('Error fetching Dynatrace problems:', error);
    throw new Error('Failed to fetch problems from Dynatrace API');
  }
};

export const configureDynatraceAPI = (environment: string, token: string) => {
  dynatraceApi.defaults.baseURL = `https://${environment}.live.dynatrace.com/api/v2`;
  dynatraceApi.defaults.headers['Authorization'] = `Api-Token ${token}`;
};

// Utility function to format duration
export const formatDuration = (milliseconds: number): string => {
  const minutes = Math.floor(milliseconds / 1000 / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else {
    return `${minutes}m`;
  }
};

// Utility function to get status color
export const getStatusColor = (status: Problem['status']) => {
  switch (status) {
    case 'OPEN':
      return 'monitoring-critical';
    case 'RESOLVED':
      return 'monitoring-resolved';
    case 'CLOSED':
      return 'muted';
    default:
      return 'muted';
  }
};

// Utility function to get severity color
export const getSeverityColor = (severity: Problem['severityLevel']) => {
  switch (severity) {
    case 'AVAILABILITY':
      return 'monitoring-critical';
    case 'ERROR':
      return 'monitoring-high';
    case 'PERFORMANCE':
      return 'monitoring-medium';
    case 'RESOURCE':
      return 'monitoring-low';
    case 'CUSTOM':
      return 'primary';
    default:
      return 'muted';
  }
};