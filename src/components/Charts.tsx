import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Server, PieChart as PieChartIcon, BarChart3 } from 'lucide-react';
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
  const { chartData } = useMonitoringStore();
  
  return (
    <Card>
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
    </Card>
  );
};
export const ImpactedEntitiesChart = () => {
  const { chartData } = useMonitoringStore();
  
  return (
    <Card>
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
    </Card>
  );
};
export const ProblemTypesChart = () => {
  const { chartData } = useMonitoringStore();
  
  return (
    <Card>
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
    </Card>
  );
};
export const SeverityDistributionChart = () => {
  const { chartData } = useMonitoringStore();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="h-5 w-5" />
          Severity Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData.severityDistribution}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.severityDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={SEVERITY_COLORS[entry.severity as keyof typeof SEVERITY_COLORS] || '#8884d8'} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export const EntityProblemChart = () => {
  const { problems } = useMonitoringStore();
  
  // Group entities by problem title and calculate durations
  const entityProblemData = problems.map(problem => {
    const duration = problem.endTime 
      ? problem.endTime - problem.startTime 
      : Date.now() - problem.startTime;
    
    return {
      problemTitle: problem.title.length > 30 ? problem.title.substring(0, 30) + '...' : problem.title,
      entityCount: problem.affectedEntities.length,
      duration: Math.floor(duration / (1000 * 60)), // Convert to minutes
      status: problem.status
    };
  }).filter(item => item.entityCount > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          Entities by Problem (Duration Chart)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={entityProblemData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis 
              type="category" 
              dataKey="problemTitle" 
              width={200}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value, name) => [
                name === 'entityCount' ? `${value} entities` : `${value} minutes`,
                name === 'entityCount' ? 'Affected Entities' : 'Duration'
              ]}
            />
            <Legend />
            <Bar dataKey="entityCount" fill="#10b981" name="Affected Entities" />
            <Bar dataKey="duration" fill="#f59e0b" name="Duration (minutes)" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};