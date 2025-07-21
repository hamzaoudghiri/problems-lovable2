import { useState } from 'react';
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Server, 
  Database, 
  Globe,
  ChevronRight,
  Search,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  const { problems, setSelectedProblem, filters, setFilters } = useMonitoringStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = searchQuery === '' || 
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      problem.displayId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filters.status.length === 0 || 
      filters.status.includes(problem.status);
      
    const matchesSeverity = filters.severity.length === 0 || 
      filters.severity.includes(problem.severityLevel);

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
    <Card className="monitoring-card">
      <CardHeader className="border-b border-border/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            Problems ({filteredProblems.length})
          </CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search problems..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50">
                <TableHead className="w-12"></TableHead>
                <TableHead className="font-semibold">Problem ID</TableHead>
                <TableHead className="font-semibold">Title</TableHead>
                <TableHead className="font-semibold">Severity</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Affected Entities</TableHead>
                <TableHead className="font-semibold">Duration</TableHead>
                <TableHead className="font-semibold">Start Time</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProblems.map((problem) => {
                const StatusIcon = problem.status === 'OPEN' ? AlertCircle : CheckCircle;
                const statusColor = getStatusColor(problem.status);
                const severityColor = getSeverityColor(problem.severityLevel);
                
                return (
                  <TableRow
                    key={problem.problemId}
                    className="cursor-pointer hover:bg-accent/50 transition-colors border-border/50"
                    onClick={() => handleRowClick(problem)}
                  >
                    <TableCell>
                      <StatusIcon 
                        className={`h-4 w-4 text-${statusColor} ${
                          problem.status === 'OPEN' ? 'animate-pulse-monitoring' : ''
                        }`} 
                      />
                    </TableCell>
                    <TableCell>
                      <code className="text-primary font-mono text-sm bg-primary/10 px-2 py-1 rounded">
                        {problem.displayId}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-foreground">
                        {problem.title}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {problem.impactLevel}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary"
                        className={`text-${severityColor} bg-${severityColor}/10 border-${severityColor}/20`}
                      >
                        {getSeverityLabel(problem.severityLevel)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary"
                        className={`text-${statusColor} bg-${statusColor}/10 border-${statusColor}/20`}
                      >
                        {problem.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-1">
                        {problem.affectedEntities.slice(0, 2).map((entity, idx) => {
                          const EntityIcon = getEntityIcon(entity.entityType);
                          return (
                            <div key={idx} className="flex items-center space-x-2">
                              <EntityIcon className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm truncate max-w-32" title={entity.displayName}>
                                {entity.displayName}
                              </span>
                            </div>
                          );
                        })}
                        {problem.affectedEntities.length > 2 && (
                          <span className="text-xs text-muted-foreground">
                            +{problem.affectedEntities.length - 2} more
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-mono">
                          {getDuration(problem)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatTimestamp(problem.startTime)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredProblems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="flex flex-col items-center space-y-2">
                      <CheckCircle className="h-8 w-8 text-muted-foreground" />
                      <span className="text-muted-foreground">No problems found</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};