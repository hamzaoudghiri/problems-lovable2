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
  const {
    chartData
  } = useMonitoringStore();
  return;
};
export const ImpactedEntitiesChart = () => {
  const {
    chartData
  } = useMonitoringStore();
  return;
};
export const ProblemTypesChart = () => {
  const {
    chartData
  } = useMonitoringStore();
  return;
};
export const SeverityDistributionChart = () => {
  const {
    chartData
  } = useMonitoringStore();
  return;
};