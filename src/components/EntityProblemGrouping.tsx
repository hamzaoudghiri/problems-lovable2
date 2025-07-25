import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMonitoringStore } from '@/store/monitoring';
import { Clock, Server } from 'lucide-react';

interface EntityProblemGroup {
  problemTitle: string;
  entity: {
    entityId: string;
    displayName: string;
    entityType: string;
  };
  totalDuration: number;
  status: string;
}

export const EntityProblemGrouping = () => {
  const { problems } = useMonitoringStore();

  const entityProblemGroups: EntityProblemGroup[] = (() => {
    const groupMap = new Map<string, EntityProblemGroup>();

    problems.forEach(problem => {
      if (problem.affectedEntities.length === 0) return;

      const duration = problem.endTime 
        ? problem.endTime - problem.startTime 
        : Date.now() - problem.startTime;

      // Create a separate entry for each entity
      problem.affectedEntities.forEach(entity => {
        const groupKey = `${problem.title}|${entity.entityId}`;

        if (groupMap.has(groupKey)) {
          // Sum the duration for existing group
          const existingGroup = groupMap.get(groupKey)!;
          existingGroup.totalDuration += duration;
        } else {
          // Create new group
          groupMap.set(groupKey, {
            problemTitle: problem.title,
            entity: entity,
            totalDuration: duration,
            status: problem.status
          });
        }
      });
    });

    return Array.from(groupMap.values());
  })();

  const formatDuration = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'destructive';
      case 'RESOLVED':
        return 'default';
      case 'CLOSED':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          Entities Grouped by Problem
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {entityProblemGroups.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No problems with affected entities found
            </p>
          ) : (
            entityProblemGroups.map((group, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-sm leading-tight">
                    {group.problemTitle}
                  </h4>
                  <Badge variant={getStatusColor(group.status)}>
                    {group.status}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Total Duration: {formatDuration(group.totalDuration)}</span>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Affected Entity:
                  </p>
                  <div className="flex items-center gap-1 bg-muted rounded px-2 py-1 text-xs w-fit">
                    <span className="font-medium">{group.entity.displayName}</span>
                    <span className="text-muted-foreground">
                      ({group.entity.entityType})
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};