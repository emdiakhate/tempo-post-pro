/**
 * BestTimeWidget - Composant pour afficher les meilleurs moments de publication
 * Extrait de PostCreationModal pour améliorer la maintenabilité
 */

import React, { useState, useCallback } from 'react';
import { Clock, TrendingUp, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface BestTimeData {
  recommended: Date;
  alternatives: Date[];
  reason: string;
  confidence: number;
  insights: {
    totalPosts: number;
    avgEngagement: number;
    improvement: number;
  };
}

interface BestTimeWidgetProps {
  bestTimeData?: BestTimeData;
  onUseRecommended: (date: Date) => void;
  onUseAlternative: (date: Date) => void;
  loading?: boolean;
  disabled?: boolean;
}

export const BestTimeWidget: React.FC<BestTimeWidgetProps> = ({
  bestTimeData,
  onUseRecommended,
  onUseAlternative,
  loading = false,
  disabled = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatTime = useCallback((date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  const formatDate = useCallback((date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  }, []);

  if (loading) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-yellow-600" />
            <CardTitle className="text-sm text-yellow-800">
              💡 Meilleur moment
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-yellow-200 rounded w-3/4"></div>
            <div className="h-3 bg-yellow-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!bestTimeData) {
    return (
      <Card className="border-gray-200 bg-gray-50">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-600" />
            <CardTitle className="text-sm text-gray-800">
              💡 Meilleur moment
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Sélectionnez une plateforme pour voir les meilleurs moments
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-yellow-600" />
            <CardTitle className="text-sm text-yellow-800">
              💡 Meilleur moment
            </CardTitle>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 w-6 p-0"
          >
            {isExpanded ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Moment recommandé */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-yellow-800">
              Recommandé
            </span>
            <Badge variant="default" className="bg-green-500 text-white">
              {Math.round(bestTimeData.confidence * 100)}% confiance
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">
                {formatTime(bestTimeData.recommended)}
              </p>
              <p className="text-xs text-yellow-700">
                {formatDate(bestTimeData.recommended)}
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={() => onUseRecommended(bestTimeData.recommended)}
              disabled={disabled}
              className="h-8"
            >
              Utiliser
            </Button>
          </div>
        </div>

        {/* Alternatives */}
        {bestTimeData.alternatives.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm font-medium text-yellow-800">
              Alternatives
            </span>
            <div className="space-y-1">
              {bestTimeData.alternatives.slice(0, 2).map((alternative, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-white rounded border"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {formatTime(alternative)}
                    </p>
                    <p className="text-xs text-gray-600">
                      {formatDate(alternative)}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onUseAlternative(alternative)}
                    disabled={disabled}
                    className="h-7"
                  >
                    Utiliser
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Détails expandables */}
        {isExpanded && (
          <div className="space-y-3 pt-3 border-t border-yellow-200">
            <div className="flex items-center space-x-2">
              <Lightbulb className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">
                Pourquoi ce moment ?
              </span>
            </div>
            <p className="text-sm text-yellow-700">
              {bestTimeData.reason}
            </p>
            
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-white rounded border">
                <p className="text-xs text-gray-600">Posts analysés</p>
                <p className="text-sm font-medium">
                  {bestTimeData.insights.totalPosts}
                </p>
              </div>
              <div className="p-2 bg-white rounded border">
                <p className="text-xs text-gray-600">Engagement moyen</p>
                <p className="text-sm font-medium">
                  {Math.round(bestTimeData.insights.avgEngagement)}%
                </p>
              </div>
              <div className="p-2 bg-white rounded border">
                <p className="text-xs text-gray-600">Amélioration</p>
                <p className="text-sm font-medium text-green-600">
                  +{Math.round(bestTimeData.insights.improvement)}%
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BestTimeWidget;
