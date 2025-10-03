import React, { useState, useMemo } from 'react';
import { 
  Hash, 
  TrendingUp, 
  Copy, 
  Filter, 
  Search, 
  Plus, 
  BarChart3,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  SparklineChart, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { useHashtagStats, useHashtagSets, HashtagFilters } from '@/hooks/useHashtagStats';
import { HashtagStats, HashtagSet } from '@/services/hashtagAnalytics';

// Données mockées pour la démonstration
const mockPosts = [
  {
    id: '1',
    content: 'Découvrez nos nouveaux produits #innovation #tech #startup',
    author: 'Postelma',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400',
    scheduledTime: new Date('2024-01-15T10:00:00'),
    platforms: ['instagram'],
    likes: 245,
    comments: 32,
    shares: 18,
    views: 1200,
    reach: 980
  },
  {
    id: '2',
    content: 'Formation en marketing digital #marketing #digital #formation #business',
    author: 'Postelma',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
    scheduledTime: new Date('2024-01-14T14:30:00'),
    platforms: ['linkedin'],
    likes: 189,
    comments: 28,
    shares: 12,
    views: 890,
    reach: 720
  },
  {
    id: '3',
    content: 'Tips pour entrepreneurs #entrepreneur #success #motivation #tips',
    author: 'Postelma',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    scheduledTime: new Date('2024-01-13T16:45:00'),
    platforms: ['facebook'],
    likes: 156,
    comments: 22,
    shares: 8,
    views: 650,
    reach: 580
  }
];

const HashtagTracker: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedPerformance, setSelectedPerformance] = useState<string>('all');
  const [selectedTrend, setSelectedTrend] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('engagement');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Hooks pour l'analyse des hashtags
  const filters: HashtagFilters = useMemo(() => ({
    platform: selectedPlatform !== 'all' ? selectedPlatform as any : undefined,
    performance: selectedPerformance !== 'all' ? selectedPerformance as any : undefined,
    trend: selectedTrend !== 'all' ? selectedTrend as any : undefined
  }), [selectedPlatform, selectedPerformance, selectedTrend]);

  const analytics = useHashtagStats(mockPosts, filters);
  const { hashtagSets, createSet, updateSet, deleteSet } = useHashtagSets();

  // Filtrer et trier les hashtags
  const filteredHashtags = useMemo(() => {
    let filtered = analytics.allHashtags;

    // Filtre par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(stat => 
        stat.tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Trier
    filtered.sort((a, b) => {
      let aValue: number, bValue: number;
      
      switch (sortBy) {
        case 'engagement':
          aValue = a.avgEngagement;
          bValue = b.avgEngagement;
          break;
        case 'reach':
          aValue = a.avgReach;
          bValue = b.avgReach;
          break;
        case 'usage':
          aValue = a.usageCount;
          bValue = b.usageCount;
          break;
        default:
          aValue = a.avgEngagement;
          bValue = b.avgEngagement;
      }

      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return filtered;
  }, [analytics.allHashtags, searchTerm, sortBy, sortOrder]);

  // Fonctions utilitaires
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="w-4 h-4 text-green-600" />;
      case 'down': return <ArrowDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Hash className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Hashtag Performance Tracker</h1>
          </div>
          <p className="text-gray-600">
            Analysez les performances de vos hashtags et optimisez votre stratégie de contenu
          </p>
        </div>

        {/* Métriques globales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Hashtags</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.totalHashtags}</p>
                </div>
                <Hash className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Engagement Moyen</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.avgEngagement.toFixed(1)}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Top Performers</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.topPerformers.length}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En Tendance</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.trending.length}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Onglets principaux */}
        <Tabs defaultValue="top-performers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="top-performers">Top Performers</TabsTrigger>
            <TabsTrigger value="all-hashtags">Tous les Hashtags</TabsTrigger>
            <TabsTrigger value="hashtag-sets">Hashtag Sets</TabsTrigger>
          </TabsList>

          {/* Top Performers */}
          <TabsContent value="top-performers" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analytics.topPerformers.map((hashtag, index) => (
                <Card key={hashtag.tag} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-bold text-blue-600">
                        {hashtag.tag}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={getPerformanceColor(hashtag.performance)}>
                          #{index + 1}
                        </Badge>
                        {getTrendIcon(hashtag.trend)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Engagement</p>
                        <p className="text-lg font-semibold">{hashtag.avgEngagement.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Utilisations</p>
                        <p className="text-lg font-semibold">{hashtag.usageCount}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Reach:</span>
                        <span className="font-medium">{hashtag.avgReach.toFixed(0)}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(hashtag.tag)}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copier
                      </Button>
                    </div>

                    {/* Graphique de tendance mini */}
                    <div className="h-16">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={[
                          { value: hashtag.avgEngagement * 0.8 },
                          { value: hashtag.avgEngagement * 0.9 },
                          { value: hashtag.avgEngagement },
                          { value: hashtag.avgEngagement * 1.1 },
                          { value: hashtag.avgEngagement * 1.05 }
                        ]}>
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#3b82f6" 
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tous les Hashtags */}
          <TabsContent value="all-hashtags" className="space-y-6">
            {/* Filtres et recherche */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Rechercher un hashtag..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Plateforme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={selectedPerformance} onValueChange={setSelectedPerformance}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Performance" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes</SelectItem>
                        <SelectItem value="high">Élevée</SelectItem>
                        <SelectItem value="medium">Moyenne</SelectItem>
                        <SelectItem value="low">Faible</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={selectedTrend} onValueChange={setSelectedTrend}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Tendance" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes</SelectItem>
                        <SelectItem value="up">↗️ Croissance</SelectItem>
                        <SelectItem value="down">↘️ Baisse</SelectItem>
                        <SelectItem value="stable">→ Stable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tableau des hashtags */}
            <Card>
              <CardHeader>
                <CardTitle>Analyse des Hashtags</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => {
                          setSortBy('tag');
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        }}
                      >
                        Hashtag
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => {
                          setSortBy('usage');
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        }}
                      >
                        Utilisations
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => {
                          setSortBy('engagement');
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        }}
                      >
                        Engagement
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer"
                        onClick={() => {
                          setSortBy('reach');
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        }}
                      >
                        Reach
                      </TableHead>
                      <TableHead>Tendance</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHashtags.map((hashtag) => (
                      <TableRow key={hashtag.tag}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-blue-600">{hashtag.tag}</span>
                            <Badge className={getPerformanceColor(hashtag.performance)}>
                              {hashtag.performance}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{hashtag.usageCount}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{hashtag.avgEngagement.toFixed(1)}%</span>
                            <Heart className="w-4 h-4 text-red-500" />
                          </div>
                        </TableCell>
                        <TableCell>{hashtag.avgReach.toFixed(0)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTrendIcon(hashtag.trend)}
                            <span className={getTrendColor(hashtag.trend)}>
                              {hashtag.trend}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(hashtag.tag)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hashtag Sets */}
          <TabsContent value="hashtag-sets" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Bibliothèque de Sets</h3>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Créer un Set
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hashtagSets.map((set) => (
                <Card key={set.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{set.name}</CardTitle>
                      <Badge variant="outline">{set.category}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{set.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Engagement Moyen</p>
                        <p className="text-lg font-semibold">{set.avgEngagement.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Usage</p>
                        <p className="text-lg font-semibold">{set.totalUsage}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-2">Hashtags ({set.hashtags.length})</p>
                      <div className="flex flex-wrap gap-1">
                        {set.hashtags.slice(0, 5).map((hashtag) => (
                          <Badge key={hashtag} variant="secondary" className="text-xs">
                            {hashtag}
                          </Badge>
                        ))}
                        {set.hashtags.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{set.hashtags.length - 5}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => copyToClipboard(set.hashtags.join(' '))}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copier Tout
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HashtagTracker;
