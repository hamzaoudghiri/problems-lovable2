import { X, Clock, AlertTriangle, CheckCircle, Server, Database, Globe, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useMonitoringStore } from '@/store/monitoring';
import { formatDuration, getSeverityColor, getStatusColor } from '@/services/api';
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
      return AlertTriangle;
  }
};

const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
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

export const ProblemDetailsModal = () => {
  const { selectedProblem, setSelectedProblem } = useMonitoringStore();

  if (!selectedProblem) return null;

  const StatusIcon = selectedProblem.status === 'OPEN' ? AlertTriangle : CheckCircle;
  const statusColor = getStatusColor(selectedProblem.status);
  const severityColor = getSeverityColor(selectedProblem.severityLevel);
  
  const duration = selectedProblem.endTime 
    ? selectedProblem.endTime - selectedProblem.startTime 
    : Date.now() - selectedProblem.startTime;

  return (
    <Dialog open={!!selectedProblem} onOpenChange={() => setSelectedProblem(null)}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto monitoring-card">
        <DialogHeader className="border-b border-border/50 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold text-foreground mb-2">
                {selectedProblem.title}
              </DialogTitle>
              <div className="flex items-center space-x-4">
                <code className="text-primary font-mono text-sm bg-primary/10 px-2 py-1 rounded">
                  {selectedProblem.displayId}
                </code>
                <Badge 
                  variant="secondary"
                  className={`text-${severityColor} bg-${severityColor}/10 border-${severityColor}/20`}
                >
                  {getSeverityLabel(selectedProblem.severityLevel)}
                </Badge>
                <Badge 
                  variant="secondary"
                  className={`text-${statusColor} bg-${statusColor}/10 border-${statusColor}/20 flex items-center gap-1`}
                >
                  <StatusIcon className="h-3 w-3" />
                  {selectedProblem.status}
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedProblem(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Start Time</label>
                  <p className="text-sm text-foreground mt-1">
                    {formatTimestamp(selectedProblem.startTime)}
                  </p>
                </div>
                {selectedProblem.endTime && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">End Time</label>
                    <p className="text-sm text-foreground mt-1">
                      {formatTimestamp(selectedProblem.endTime)}
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Duration</label>
                  <p className="text-sm text-foreground mt-1 font-mono">
                    {formatDuration(duration)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Affected Entities */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Server className="h-4 w-4" />
                Affected Entities ({selectedProblem.affectedEntities.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedProblem.affectedEntities.map((entity, index) => {
                  const EntityIcon = getEntityIcon(entity.entityType);
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/50"
                    >
                      <div className="flex items-center space-x-3">
                        <EntityIcon className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">{entity.displayName}</p>
                          <p className="text-sm text-muted-foreground">{entity.entityType}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-primary">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Root Cause */}
          {selectedProblem.rootCauseEntity && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-monitoring-high" />
                  Root Cause Entity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-3 rounded-lg bg-monitoring-high/10 border border-monitoring-high/20">
                  <div className="flex items-center space-x-3">
                    {(() => {
                      const RootCauseIcon = getEntityIcon(selectedProblem.rootCauseEntity!.entityType);
                      return <RootCauseIcon className="h-4 w-4 text-monitoring-high" />;
                    })()}
                    <div>
                      <p className="font-medium text-foreground">
                        {selectedProblem.rootCauseEntity.displayName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedProblem.rootCauseEntity.entityType}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Analyze
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Evidence Details */}
          {selectedProblem.evidenceDetails && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Evidence & Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Evidence Type</label>
                  <p className="text-sm text-foreground mt-1">
                    {selectedProblem.evidenceDetails.displayName}
                  </p>
                </div>
                
                {selectedProblem.evidenceDetails.unit && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Unit</label>
                    <p className="text-sm text-foreground mt-1">
                      {selectedProblem.evidenceDetails.unit}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Badge variant={selectedProblem.evidenceDetails.rootCauseRelevant ? "default" : "secondary"}>
                    {selectedProblem.evidenceDetails.rootCauseRelevant ? "Root Cause Relevant" : "Supporting Evidence"}
                  </Badge>
                </div>

                {selectedProblem.evidenceDetails.details && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Metric Data Points</label>
                    <div className="mt-2 p-3 rounded-lg bg-muted/20 border border-border/50">
                      <p className="text-xs font-mono text-muted-foreground">
                        {selectedProblem.evidenceDetails.details.data.length} data points collected
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Management Zones */}
          {selectedProblem.managementZones.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Management Zones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {selectedProblem.managementZones.map((zone, index) => (
                    <Badge key={index} variant="outline">
                      {zone.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comments */}
          {selectedProblem.recentComments && selectedProblem.recentComments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Comments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedProblem.recentComments.map((comment, index) => (
                  <div key={index} className="p-3 rounded-lg bg-muted/20 border border-border/50">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-foreground">{comment.authorName}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimestamp(comment.createdAtTimestamp)}
                      </p>
                    </div>
                    <p className="text-sm text-foreground">{comment.content}</p>
                    {comment.context && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Context: {comment.context}
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t border-border/50">
          <Button variant="outline" onClick={() => setSelectedProblem(null)}>
            Close
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <ExternalLink className="h-4 w-4 mr-2" />
            View in Dynatrace
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};