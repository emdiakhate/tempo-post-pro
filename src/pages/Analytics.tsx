import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { 
  Download, 
  Calendar, 
  TrendingUp, 
  ChevronDown
} from 'lucide-react';

const Analytics: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('twitter');
  const [selectedNetwork, setSelectedNetwork] = useState('all');
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Données mockées
  const mockAnalyticsData = {
    kpis: [
      { platform: 'twitter', count: 65, change: '+5 from 60', color: '#1DA1F2', percentage: 85 },
      { platform: 'facebook', count: 63, change: '+3 from 60', color: '#1877F2', percentage: 78 },
      { platform: 'instagram', count: 12, change: '+2 from 10', color: '#E4405F', percentage: 65 },
      { platform: 'linkedin', count: 12, change: '+2 from 10', color: '#0A66C2', percentage: 70 },
      { platform: 'tiktok', count: 18, change: '+4 from 14', color: '#000000', percentage: 75 },
    ],
    mentions: [
      { month: 'Dec 24', count: 180 },
      { month: 'Jan 25', count: 220 },
      { month: 'Feb 25', count: 280 },
      { month: 'Mar 25', count: 350 },
      { month: 'Apr 25', count: 420 },
      { month: 'May 25', count: 480 },
    ],
    traffic: [
      { page: 'Facebook', visits: 73, followers: 68 },
      { page: 'Twitter', visits: 65, followers: 60 },
      { page: 'Instagram', visits: 45, followers: 50 },
      { page: 'LinkedIn', visits: 38, followers: 42 },
    ],
    posts: [
      { month: 'Dec', count: 55 },
      { month: 'Jan', count: 68 },
      { month: 'Feb', count: 75 },
      { month: 'Mar', count: 82 },
      { month: 'Apr', count: 90 },
      { month: 'May', count: 95 },
    ],
    audienceAge: [
      { month: 'Dec', '18-24': 120, '25-34': 180, '35-44': 150, '45-54': 100, '55+': 80 },
      { month: 'Jan', '18-24': 130, '25-34': 190, '35-44': 160, '45-54': 110, '55+': 85 },
      { month: 'Feb', '18-24': 145, '25-34': 210, '35-44': 175, '45-54': 120, '55+': 90 },
      { month: 'Mar', '18-24': 160, '25-34': 230, '35-44': 190, '45-54': 130, '55+': 95 },
      { month: 'Apr', '18-24': 175, '25-34': 250, '35-44': 205, '45-54': 140, '55+': 100 },
      { month: 'May', '18-24': 190, '25-34': 270, '35-44': 220, '45-54': 150, '55+': 105 },
    ],
    totalEngagements: 833000,
    fansByCity: [
      { city: 'Santoa London', fans: 833000, growth: '+81%' },
      { city: 'Santoa Vancouver', fans: 833000, growth: '+81%' },
    ]
  };

  const formatNumber = (num: number | undefined): string => {
    if (num === undefined || num === null) return '0';
    return num.toLocaleString();
  };

  // Fonction de filtrage par réseau
  const filterByNetwork = (data: any, network: string) => {
    if (network === 'all') return data;
    
    return {
      ...data,
      kpis: data.kpis.filter((kpi: any) => kpi.platform === network),
      mentions: data.mentions,
      traffic: data.traffic.filter((item: any) => item.page.toLowerCase() === network),
      posts: data.posts,
      audienceAge: data.audienceAge,
      totalEngagements: data.totalEngagements,
      fansByCity: data.fansByCity
    };
  };

  const filteredData = selectedNetwork === 'all' 
    ? mockAnalyticsData 
    : filterByNetwork(mockAnalyticsData, selectedNetwork);

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-7xl mx-auto p-6 pb-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option>Cette année</option>
                  <option>L'année dernière</option>
                  <option>Plage personnalisée</option>
                </select>
              </div>
              <div className="text-sm text-gray-600">
                Dec 23 25 - Jan 22 25
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Download className="w-4 h-4" />
                Exporter
              </button>
            </div>
          </div>

          {/* Filtre par réseau */}
          <div className="mb-6">
            <div className="relative">
              <select 
                value={selectedNetwork}
                onChange={(e) => setSelectedNetwork(e.target.value)}
                className="appearance-none border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tous les réseaux</option>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="twitter">Twitter</option>
                <option value="linkedin">LinkedIn</option>
                <option value="tiktok">TikTok</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-5 gap-6 mb-8">
          {filteredData.kpis.map((kpi: any) => (
            <div key={kpi.platform} className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600">{kpi.platform}</h3>
                <div className="flex items-center text-green-600 text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {kpi.change}
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{kpi.count}</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full" 
                  style={{ 
                    width: `${kpi.percentage}%`, 
                    backgroundColor: kpi.color 
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Mention Count */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Nombre de mentions</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredData.mentions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Traffic by Page */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trafic par page</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredData.traffic}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="page" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="visits" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Posts */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Publications</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredData.posts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Audience Age */}
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Audience par âge</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={filteredData.audienceAge}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="18-24" stackId="1" stroke="#3B82F6" fill="#3B82F6" />
                <Area type="monotone" dataKey="25-34" stackId="1" stroke="#10B981" fill="#10B981" />
                <Area type="monotone" dataKey="35-44" stackId="1" stroke="#F59E0B" fill="#F59E0B" />
                <Area type="monotone" dataKey="45-54" stackId="1" stroke="#EF4444" fill="#EF4444" />
                <Area type="monotone" dataKey="55+" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {formatNumber(filteredData.totalEngagements)}
              </h3>
              <p className="text-gray-600">engagements</p>
            </div>
          </div>
          <div className="col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Fans par ville</h3>
              <div className="space-y-3">
                {filteredData.fansByCity.map((city: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{city.city}</span>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">{formatNumber(city.fans)}</div>
                      <div className="text-xs text-green-600">{city.growth}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
