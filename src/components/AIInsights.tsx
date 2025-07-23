import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Lightbulb,
  RefreshCw,
  Loader2 
} from 'lucide-react';
import { useMonitoringStore } from '@/store/monitoring';

interface AIInsight {
  id: string;
  type: 'pattern' | 'recommendation' | 'trend' | 'critical';
  title: string;
  description: string;
  confidence: number;
  priority: 'high' | 'medium' | 'low';
  actionable?: boolean;
}

export const AIInsights = () => {
  const { problems, stats } = useMonitoringStore();
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const generateInsights = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newInsights: AIInsight[] = [];

    // Pattern Analysis
    if (problems.length > 0) {
      const openProblems = problems.filter(p => p.status === 'OPEN');
      const entityTypes = [...new Set(problems.flatMap(p => p.affectedEntities.map(e => e.entityType)))];
      
      // Critical issues pattern
      if (stats.criticalProblems > 3) {
        newInsights.push({
          id: 'critical-spike',
          type: 'critical',
          title: 'Spike in Critical Issues Detected',
          description: `${stats.criticalProblems} critical problems identified. This represents a ${Math.round((stats.criticalProblems / stats.totalProblems) * 100)}% of all issues.`,
          confidence: 0.95,
          priority: 'high',
          actionable: true
        });
      }

      // Entity type analysis
      if (entityTypes.length > 0) {
        const mostAffectedType = entityTypes[0];
        newInsights.push({
          id: 'entity-pattern',
          type: 'pattern',
          title: `${mostAffectedType} Infrastructure Pattern`,
          description: `Most problems are affecting ${mostAffectedType} entities. Consider reviewing ${mostAffectedType} configurations and capacity planning.`,
          confidence: 0.82,
          priority: 'medium',
          actionable: true
        });
      }

      // Resolution time trend
      if (stats.averageResolutionTime > 60) {
        newInsights.push({
          id: 'resolution-trend',
          type: 'trend',
          title: 'Extended Resolution Times',
          description: `Average resolution time is ${Math.round(stats.averageResolutionTime)} minutes. Consider implementing automated remediation for common issues.`,
          confidence: 0.88,
          priority: 'medium',
          actionable: true
        });
      }

      // Proactive recommendations
      newInsights.push({
        id: 'proactive-monitoring',
        type: 'recommendation',
        title: 'Enhance Proactive Monitoring',
        description: 'Consider implementing synthetic monitoring and anomaly detection to catch issues before they impact users.',
        confidence: 0.75,
        priority: 'low',
        actionable: true
      });
    }

    // If no recent problems
    if (problems.length === 0) {
      newInsights.push({
        id: 'system-healthy',
        type: 'trend',
        title: 'System Health Status: Good',
        description: 'No recent problems detected. Your monitoring setup appears to be functioning well.',
        confidence: 0.90,
        priority: 'low'
      });
    }

    setInsights(newInsights);
    setIsAnalyzing(false);
  };

  useEffect(() => {
    generateInsights();
  }, [problems, stats]);

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'pattern': return <Target className="h-4 w-4" />;
      case 'recommendation': return <Lightbulb className="h-4 w-4" />;
      case 'trend': return <TrendingUp className="h-4 w-4" />;
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: AIInsight['priority']) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
    }
  };

  return (
    <Card className="monitoring-card">
      <CardHeader className="border-b border-border/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Insights & Recommendations
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={generateInsights}
            disabled={isAnalyzing}
            className="gap-2"
          >
            {isAnalyzing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {isAnalyzing ? 'Analyzing...' : 'Refresh'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {isAnalyzing ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-3 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>AI is analyzing your monitoring data...</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className="p-4 rounded-lg border border-border/50 bg-card/50 hover:bg-card/80 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 rounded-md bg-primary/10 text-primary mt-0.5">
                      {getInsightIcon(insight.type)}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-foreground">{insight.title}</h4>
                        <Badge variant={getPriorityColor(insight.priority)} className="text-xs">
                          {insight.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {insight.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Confidence: {Math.round(insight.confidence * 100)}%</span>
                        {insight.actionable && (
                          <Badge variant="outline" className="text-xs">
                            Actionable
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {insights.length === 0 && (
              <div className="text-center py-8">
                <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  No insights available. AI analysis will appear here based on your monitoring data.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};