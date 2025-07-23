import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Server, PieChart as PieChartIcon, BarChart3 } from 'lucide-react';
import { useMonitoringStore } from '@/store/monitoring';

const SEVERITY_COLORS = {
  'Critical': '#dc2626', // red-600
  'High': '#ea580c',     // orange-600
  'Medium': '#d97706',   // amber-600
  'Low': '#0891b2',      // cyan-600
  'Info': '#3b82f6',     // blue-600
};

const CHART_COLORS = ['#0891b2', '#3b82f6', '#8b5cf6', '#06b6d4', '#10b981'];

export const ProblemsOverTimeChart = () => {
  const { chartData } = useMonitoringStore();

  return (
    <Card className="monitoring-card">
      <CardHeader className="border-b border-border/50">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Problems Over Time (24 Hours)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData.problemsOverTime}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem',
                color: 'hsl(var(--popover-foreground))',
              }}
              labelFormatter={(label) => `Time: ${label}`}
              formatter={(value) => [`${value}`, 'Problems']}
            />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export const ImpactedEntitiesChart = () => {
  const { chartData } = useMonitoringStore();

  return (
    <Card className="monitoring-card">
      <CardHeader className="border-b border-border/50">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Top Impacted Entities (by Downtime)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData.impactedEntities}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="entityName"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem',
                color: 'hsl(var(--popover-foreground))',
              }}
              formatter={(value) => [`${value} minutes`, 'Downtime']}
            />
            <Bar 
              dataKey="totalDowntime" 
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export const ProblemTypesChart = () => {
  const { chartData } = useMonitoringStore();

  return (
    <Card className="monitoring-card">
      <CardHeader className="border-b border-border/50">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <PieChartIcon className="h-5 w-5 text-primary" />
          Problem Types Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData.problemTypes}
              dataKey="count"
              nameKey="type"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={40}
              paddingAngle={2}
              label={({ type, percentage }) => `${type}: ${percentage}%`}
            >
              {chartData.problemTypes.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={CHART_COLORS[index % CHART_COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem',
                color: 'hsl(var(--popover-foreground))',
              }}
              formatter={(value, name) => [`${value} problems`, name]}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              wrapperStyle={{ color: 'hsl(var(--foreground))' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export const SeverityDistributionChart = () => {
  const { chartData } = useMonitoringStore();

  return (
    <Card className="monitoring-card">
      <CardHeader className="border-b border-border/50">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Server className="h-5 w-5 text-primary" />
          Severity Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData.severityDistribution}
              dataKey="count"
              nameKey="severity"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={40}
              paddingAngle={2}
              label={({ severity, percentage }) => `${severity}: ${percentage}%`}
            >
              {chartData.severityDistribution.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={SEVERITY_COLORS[entry.severity as keyof typeof SEVERITY_COLORS] || CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem',
                color: 'hsl(var(--popover-foreground))',
              }}
              formatter={(value, name) => [`${value} problems`, name]}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              wrapperStyle={{ color: 'hsl(var(--foreground))' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};