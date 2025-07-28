import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ScatterChart, Scatter } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Server, PieChart as PieChartIcon, BarChart3, Timer, Users } from 'lucide-react';
import { useMonitoringStore } from '@/store/monitoring';
const SEVERITY_COLORS = {
  'Critical': '#dc2626',
  // red-600
  'High': '#ea580c',
  // orange-600
  'Medium': '#d97706',
  // amber-600
  'Low': '#0891b2',
  // cyan-600
  'Info': '#3b82f6' // blue-600
};
const CHART_COLORS = ['#0891b2', '#3b82f6', '#8b5cf6', '#06b6d4', '#10b981'];
export const ProblemsOverTimeChart = () => {
  const {
    chartData
  } = useMonitoringStore();
  return <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Problems Over Time
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData.problemsOverTime}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#0891b2" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>;
};
export const ImpactedEntitiesChart = () => {
  const {
    chartData
  } = useMonitoringStore();
  return <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          Impacted Entities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData.impactedEntities}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="entityType" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>;
};
export const ProblemTypesChart = () => {
  const {
    chartData
  } = useMonitoringStore();
  return <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Problem Types
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData.problemTypes}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>;
};
export const SeverityDistributionChart = () => {
  const {
    chartData
  } = useMonitoringStore();
  return <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="h-5 w-5" />
          Severity Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={chartData.severityDistribution} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="count" label={({
            name,
            percent
          }) => `${name} ${(percent * 100).toFixed(0)}%`}>
              {chartData.severityDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={SEVERITY_COLORS[entry.severity as keyof typeof SEVERITY_COLORS] || '#8884d8'} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>;
};
export const EntityProblemChart = () => {
  const {
    problems
  } = useMonitoringStore();

  // Group entities by problem title and calculate durations
  const entityProblemData = problems.map(problem => {
    const duration = problem.endTime ? problem.endTime - problem.startTime : Date.now() - problem.startTime;
    return {
      problemTitle: problem.title.length > 30 ? problem.title.substring(0, 30) + '...' : problem.title,
      entityCount: problem.affectedEntities.length,
      duration: Math.floor(duration / (1000 * 60)),
      // Convert to minutes
      status: problem.status
    };
  }).filter(item => item.entityCount > 0);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Entity Problem Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={entityProblemData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="problemTitle" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="entityCount" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// New charts for the entity-problem grouping section
export const ProblemEntityDurationChart = () => {
  const {
    problems
  } = useMonitoringStore();

  // Example data when no problems available
  const exampleData = [
    { problemTitle: "Database Connection...", entityName: "database-01", totalDuration: 245, status: "RESOLVED" },
    { problemTitle: "High CPU Usage", entityName: "server-web-01", totalDuration: 180, status: "OPEN" },
    { problemTitle: "Memory Leak", entityName: "app-backend", totalDuration: 320, status: "RESOLVED" },
    { problemTitle: "Network Timeout", entityName: "api-gateway", totalDuration: 95, status: "OPEN" },
    { problemTitle: "Disk Space Alert", entityName: "storage-01", totalDuration: 150, status: "RESOLVED" },
    { problemTitle: "Service Unavailable", entityName: "auth-service", totalDuration: 275, status: "OPEN" },
    { problemTitle: "Load Balancer Issue", entityName: "lb-01", totalDuration: 65, status: "RESOLVED" },
    { problemTitle: "Cache Miss Rate High", entityName: "redis-cluster", totalDuration: 120, status: "OPEN" }
  ];

  // Group by problem-title and entity combination (same logic as EntityProblemGrouping)
  const groupMap = new Map<string, {
    problemTitle: string;
    entityName: string;
    totalDuration: number;
    status: string;
  }>();
  
  if (problems.length > 0) {
    problems.forEach(problem => {
      if (problem.affectedEntities.length === 0) return;
      const duration = problem.endTime ? problem.endTime - problem.startTime : Date.now() - problem.startTime;
      problem.affectedEntities.forEach(entity => {
        const groupKey = `${problem.title}|${entity.entityId}`;
        if (groupMap.has(groupKey)) {
          const existingGroup = groupMap.get(groupKey)!;
          existingGroup.totalDuration += duration;
        } else {
          groupMap.set(groupKey, {
            problemTitle: problem.title.length > 25 ? problem.title.substring(0, 25) + '...' : problem.title,
            entityName: entity.displayName,
            totalDuration: Math.floor(duration / (1000 * 60)),
            // Convert to minutes
            status: problem.status
          });
        }
      });
    });
  }
  
  const chartData = problems.length > 0 ? Array.from(groupMap.values()).slice(0, 15) : exampleData;

  return <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="h-5 w-5" />
          Problem-Entity Duration Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="entityName" width={150} tick={{
            fontSize: 11
          }} />
            <Tooltip formatter={value => [`${value} minutes`, 'Duration']} labelFormatter={label => `Entity: ${label}`} />
            <Bar dataKey="totalDuration" fill="#dc2626" name="Duration (minutes)" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>;
};
export const ProblemEntityScatterChart = () => {
  const {
    problems
  } = useMonitoringStore();

  // Example data when no problems available
  const exampleScatterData = [
    { entityType: "APPLICATION", duration: 145, problemTitle: "Database Connection Issue", x: 1, y: 145 },
    { entityType: "SERVICE", duration: 280, problemTitle: "High CPU Usage", x: 2, y: 280 },
    { entityType: "INFRASTRUCTURE", duration: 95, problemTitle: "Network Timeout", x: 3, y: 95 },
    { entityType: "APPLICATION", duration: 320, problemTitle: "Memory Leak", x: 1.5, y: 320 },
    { entityType: "SERVICE", duration: 180, problemTitle: "Service Unavailable", x: 2.5, y: 180 },
    { entityType: "INFRASTRUCTURE", duration: 210, problemTitle: "Disk Space Alert", x: 3.5, y: 210 },
    { entityType: "APPLICATION", duration: 75, problemTitle: "Cache Miss Rate High", x: 1.2, y: 75 },
    { entityType: "SERVICE", duration: 165, problemTitle: "Load Balancer Issue", x: 2.3, y: 165 }
  ];

  // Create scatter plot data showing relationship between entity types and duration
  const scatterData: Array<{
    entityType: string;
    duration: number;
    problemTitle: string;
    x: number;
    y: number;
  }> = [];
  
  if (problems.length > 0) {
    problems.forEach(problem => {
      if (problem.affectedEntities.length === 0) return;
      const duration = problem.endTime ? problem.endTime - problem.startTime : Date.now() - problem.startTime;
      problem.affectedEntities.forEach((entity, index) => {
        scatterData.push({
          entityType: entity.entityType,
          duration: Math.floor(duration / (1000 * 60)),
          problemTitle: problem.title,
          x: index + Math.random() * 0.5,
          // Add some jitter for better visibility
          y: Math.floor(duration / (1000 * 60))
        });
      });
    });
  }

  // Use example data if no real data available
  const dataToUse = problems.length > 0 ? scatterData : exampleScatterData;

  // Group by entity type for better visualization
  const entityTypeGroups = dataToUse.reduce((acc, item) => {
    if (!acc[item.entityType]) {
      acc[item.entityType] = [];
    }
    acc[item.entityType].push(item);
    return acc;
  }, {} as Record<string, typeof dataToUse>);
  return <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Entity Type vs Duration Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" dataKey="x" domain={[0, 'dataMax']} tick={false} />
            <YAxis type="number" dataKey="y" name="Duration (min)" />
            <Tooltip formatter={(value, name, props) => [`${value} minutes`, 'Duration', `Problem: ${props.payload.problemTitle}`, `Entity Type: ${props.payload.entityType}`]} />
            <Legend />
            {Object.entries(entityTypeGroups).map(([entityType, data], index) => <Scatter key={entityType} name={entityType} data={data} fill={CHART_COLORS[index % CHART_COLORS.length]} />)}
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>;
};
export const EntityProblemSummaryChart = () => {
  const {
    problems
  } = useMonitoringStore();

  // Aggregate data by problem title showing total entities and total duration
  const summaryMap = new Map<string, {
    problemTitle: string;
    totalEntities: number;
    totalDuration: number;
    avgDuration: number;
  }>();
  problems.forEach(problem => {
    if (problem.affectedEntities.length === 0) return;
    const duration = problem.endTime ? problem.endTime - problem.startTime : Date.now() - problem.startTime;
    const durationMinutes = Math.floor(duration / (1000 * 60));
    const entityCount = problem.affectedEntities.length;
    if (summaryMap.has(problem.title)) {
      const existing = summaryMap.get(problem.title)!;
      existing.totalEntities += entityCount;
      existing.totalDuration += durationMinutes * entityCount; // Sum for all entity combinations
      existing.avgDuration = existing.totalDuration / existing.totalEntities;
    } else {
      summaryMap.set(problem.title, {
        problemTitle: problem.title.length > 30 ? problem.title.substring(0, 30) + '...' : problem.title,
        totalEntities: entityCount,
        totalDuration: durationMinutes * entityCount,
        avgDuration: durationMinutes
      });
    }
  });
  const summaryData = Array.from(summaryMap.values()).slice(0, 10);
  return <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Problem Summary: Entities & Duration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={summaryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="problemTitle" angle={-45} textAnchor="end" height={100} tick={{
            fontSize: 10
          }} />
            <YAxis yAxisId="entities" orientation="left" />
            <YAxis yAxisId="duration" orientation="right" />
            <Tooltip formatter={(value, name) => [name === 'totalEntities' ? `${value} entities` : `${value} minutes`, name === 'totalEntities' ? 'Total Entities' : 'Total Duration']} />
            <Legend />
            <Bar yAxisId="entities" dataKey="totalEntities" fill="#10b981" name="Total Entities" />
            <Bar yAxisId="duration" dataKey="totalDuration" fill="#f59e0b" name="Total Duration (min)" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>;
};

export const ProblemEntitiesChart = () => {
  const {
    problems
  } = useMonitoringStore();

  // Aggregate data by problem title showing total entities
  const summaryMap = new Map<string, {
    problemTitle: string;
    totalEntities: number;
  }>();
  problems.forEach(problem => {
    if (problem.affectedEntities.length === 0) return;
    const entityCount = problem.affectedEntities.length;
    if (summaryMap.has(problem.title)) {
      const existing = summaryMap.get(problem.title)!;
      existing.totalEntities += entityCount;
    } else {
      summaryMap.set(problem.title, {
        problemTitle: problem.title.length > 30 ? problem.title.substring(0, 30) + '...' : problem.title,
        totalEntities: entityCount
      });
    }
  });
  const entitiesData = Array.from(summaryMap.values()).slice(0, 10);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Total Entities by Problem
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={entitiesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="problemTitle" angle={-45} textAnchor="end" height={100} tick={{
            fontSize: 10
          }} />
            <YAxis />
            <Tooltip formatter={(value) => [`${value} entities`, 'Total Entities']} />
            <Bar dataKey="totalEntities" fill="#10b981" name="Total Entities" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export const ProblemDurationChart = () => {
  const {
    problems
  } = useMonitoringStore();

  // Aggregate data by problem title showing total duration
  const summaryMap = new Map<string, {
    problemTitle: string;
    totalDuration: number;
  }>();
  problems.forEach(problem => {
    if (problem.affectedEntities.length === 0) return;
    const duration = problem.endTime ? problem.endTime - problem.startTime : Date.now() - problem.startTime;
    const durationMinutes = Math.floor(duration / (1000 * 60));
    const entityCount = problem.affectedEntities.length;
    if (summaryMap.has(problem.title)) {
      const existing = summaryMap.get(problem.title)!;
      existing.totalDuration += durationMinutes * entityCount;
    } else {
      summaryMap.set(problem.title, {
        problemTitle: problem.title.length > 30 ? problem.title.substring(0, 30) + '...' : problem.title,
        totalDuration: durationMinutes * entityCount
      });
    }
  });
  const durationData = Array.from(summaryMap.values()).slice(0, 10);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="h-5 w-5" />
          Total Duration by Problem
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={durationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="problemTitle" angle={-45} textAnchor="end" height={100} tick={{
            fontSize: 10
          }} />
            <YAxis />
            <Tooltip formatter={(value) => [`${value} minutes`, 'Total Duration']} />
            <Bar dataKey="totalDuration" fill="#f59e0b" name="Total Duration (min)" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};