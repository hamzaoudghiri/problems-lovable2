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

  // Example data - simplified and clearer
  const exampleData = [
    { entityName: "Database Server", duration: 245, status: "RESOLVED" },
    { entityName: "Web Server", duration: 180, status: "OPEN" },
    { entityName: "API Gateway", duration: 95, status: "RESOLVED" },
    { entityName: "Cache Service", duration: 320, status: "OPEN" },
    { entityName: "Auth Service", duration: 150, status: "RESOLVED" },
    { entityName: "Load Balancer", duration: 65, status: "OPEN" }
  ];

  // Simplified data processing
  let chartData = exampleData;
  
  if (problems.length > 0) {
    const entityDurations = new Map();
    problems.forEach(problem => {
      if (problem.affectedEntities.length === 0) return;
      const duration = problem.endTime ? problem.endTime - problem.startTime : Date.now() - problem.startTime;
      problem.affectedEntities.forEach(entity => {
        const key = entity.displayName;
        const currentDuration = entityDurations.get(key) || 0;
        entityDurations.set(key, currentDuration + Math.floor(duration / (1000 * 60)));
      });
    });
    
    chartData = Array.from(entityDurations.entries())
      .map(([entityName, duration]) => ({
        entityName: entityName.length > 20 ? entityName.substring(0, 20) + '...' : entityName,
        duration,
        status: 'OPEN'
      }))
      .slice(0, 8);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="h-5 w-5" />
          Entity Duration Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="entityName" 
              angle={-45} 
              textAnchor="end" 
              height={80}
              tick={{ fontSize: 11 }}
            />
            <YAxis 
              tick={{ fontSize: 11 }}
              label={{ value: 'Duration (minutes)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value) => [`${value} minutes`, 'Duration']}
              labelStyle={{ color: '#333' }}
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
            <Bar 
              dataKey="duration" 
              fill="#3b82f6" 
              radius={[4, 4, 0, 0]}
              name="Duration (minutes)"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export const ProblemEntityScatterChart = () => {
  const {
    problems
  } = useMonitoringStore();

  // Example data - simplified pie chart showing problem distribution by severity
  const exampleData = [
    { name: "Critical", value: 15, color: "#dc2626" },
    { name: "High", value: 28, color: "#ea580c" },
    { name: "Medium", value: 35, color: "#d97706" },
    { name: "Low", value: 22, color: "#0891b2" }
  ];

  // Process real data if available
  let chartData = exampleData;
  
  if (problems.length > 0) {
    const severityCount = problems.reduce((acc, problem) => {
      const severity = problem.severityLevel;
      acc[severity] = (acc[severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const total = Object.values(severityCount).reduce((sum, count) => sum + count, 0);
    
    chartData = Object.entries(severityCount).map(([severity, count]) => ({
      name: severity,
      value: count,
      percentage: Math.round((count / total) * 100),
      color: SEVERITY_COLORS[severity as keyof typeof SEVERITY_COLORS] || '#8884d8'
    }));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="h-5 w-5" />
          Problem Severity Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value, percentage }) => `${name}: ${value} (${percentage || Math.round((value / chartData.reduce((sum, item) => sum + item.value, 0)) * 100)}%)`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name) => [`${value} problems`, name]}
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
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

  // Example data when no problems available
  const exampleEntitiesData = [
    { problemTitle: "Database Connection Issue", totalEntities: 12 },
    { problemTitle: "High CPU Usage Alert", totalEntities: 8 },
    { problemTitle: "Memory Leak Detection", totalEntities: 15 },
    { problemTitle: "Network Timeout Events", totalEntities: 6 },
    { problemTitle: "Disk Space Warning", totalEntities: 10 },
    { problemTitle: "Service Unavailable", totalEntities: 18 },
    { problemTitle: "Load Balancer Issues", totalEntities: 4 },
    { problemTitle: "Cache Performance", totalEntities: 22 }
  ];

  // Aggregate data by problem title showing total entities
  const summaryMap = new Map<string, {
    problemTitle: string;
    totalEntities: number;
  }>();
  
  if (problems.length > 0) {
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
  }
  
  const entitiesData = problems.length > 0 ? Array.from(summaryMap.values()).slice(0, 10) : exampleEntitiesData;
  
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

  // Example data when no problems available
  const exampleDurationData = [
    { problemTitle: "Database Connection Issue", totalDuration: 2940 },
    { problemTitle: "High CPU Usage Alert", totalDuration: 1440 },
    { problemTitle: "Memory Leak Detection", totalDuration: 4800 },
    { problemTitle: "Network Timeout Events", totalDuration: 570 },
    { problemTitle: "Disk Space Warning", totalDuration: 1500 },
    { problemTitle: "Service Unavailable", totalDuration: 4950 },
    { problemTitle: "Load Balancer Issues", totalDuration: 260 },
    { problemTitle: "Cache Performance", totalDuration: 2640 }
  ];

  // Aggregate data by problem title showing total duration
  const summaryMap = new Map<string, {
    problemTitle: string;
    totalDuration: number;
  }>();
  
  if (problems.length > 0) {
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
  }
  
  const durationData = problems.length > 0 ? Array.from(summaryMap.values()).slice(0, 10) : exampleDurationData;
  
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