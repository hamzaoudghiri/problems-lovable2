import { useState } from 'react';
import { AlertCircle, CheckCircle, Clock, Server, Database, Globe, ChevronRight, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useMonitoringStore } from '@/store/monitoring';
import { formatDuration } from '@/services/api';
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
const getStatusColor = (status: Problem['status']) => {
  switch (status) {
    case 'OPEN':
      return 'destructive';
    case 'RESOLVED':
      return 'default';
    case 'CLOSED':
      return 'secondary';
    default:
      return 'secondary';
  }
};
const getSeverityColor = (severity: Problem['severityLevel']) => {
  switch (severity) {
    case 'AVAILABILITY':
      return 'destructive';
    case 'ERROR':
      return 'destructive';
    case 'PERFORMANCE':
      return 'default';
    case 'RESOURCE':
      return 'secondary';
    case 'CUSTOM':
      return 'outline';
    default:
      return 'secondary';
  }
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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Problems List
          <Badge variant="outline" className="ml-auto">
            {filteredProblems.length} problems
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search problems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Problem</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Entities</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Started</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProblems.map((problem) => (
              <TableRow 
                key={problem.problemId} 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleRowClick(problem)}
              >
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{problem.title}</div>
                    <div className="text-sm text-muted-foreground">{problem.displayId}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getSeverityColor(problem.severityLevel)}>
                    {getSeverityLabel(problem.severityLevel)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(problem.status)}>
                    {problem.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    {problem.affectedEntities.slice(0, 3).map((entity, index) => {
                      const IconComponent = getEntityIcon(entity.entityType);
                      return (
                        <IconComponent key={index} className="h-4 w-4 text-muted-foreground" />
                      );
                    })}
                    {problem.affectedEntities.length > 3 && (
                      <span className="text-sm text-muted-foreground">
                        +{problem.affectedEntities.length - 3}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{getDuration(problem)}</TableCell>
                <TableCell>{formatTimestamp(problem.startTime)}</TableCell>
                <TableCell>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};