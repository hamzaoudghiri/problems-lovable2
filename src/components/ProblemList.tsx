import { useState } from 'react';
import { AlertCircle, CheckCircle, Clock, Server, Database, Globe, ChevronRight, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useMonitoringStore } from '@/store/monitoring';
import { formatDuration, getStatusColor, getSeverityColor } from '@/services/api';
import type { Problem } from '@/store/monitoring';
const getEntityIcon = (entityType: string) => {
  switch (entityType.toLowerCase()) {
    case 'application':
      return Globe;
    case 'service':
      return Server;
    case 'database':
      return Database;
    case 'host':
      return Server;
    default:
      return AlertCircle;
  }
};
const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString();
};
const getSeverityLabel = (severity: Problem['severityLevel']): string => {
  const labels = {
    'AVAILABILITY': 'Critical',
    'ERROR': 'High',
    'PERFORMANCE': 'Medium',
    'RESOURCE': 'Low',
    'CUSTOM': 'Info'
  };
  return labels[severity] || severity;
};
export const ProblemList = () => {
  const {
    problems,
    setSelectedProblem,
    filters,
    setFilters
  } = useMonitoringStore();
  const [searchQuery, setSearchQuery] = useState('');
  const filteredProblems = problems.filter(problem => {
    const matchesSearch = searchQuery === '' || problem.title.toLowerCase().includes(searchQuery.toLowerCase()) || problem.displayId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filters.status.length === 0 || filters.status.includes(problem.status);
    const matchesSeverity = filters.severity.length === 0 || filters.severity.includes(problem.severityLevel);
    return matchesSearch && matchesStatus && matchesSeverity;
  });
  const handleRowClick = (problem: Problem) => {
    setSelectedProblem(problem);
  };
  const getDuration = (problem: Problem): string => {
    const now = Date.now();
    const duration = problem.endTime ? problem.endTime - problem.startTime : now - problem.startTime;
    return formatDuration(duration);
  };
  return;
};