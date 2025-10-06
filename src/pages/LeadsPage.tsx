/**
 * Page principale Lead Generation
 * Phase 4: Lead Generation System - Page Principale
 */

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Phone, 
  CheckCircle, 
  TrendingUp,
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  Eye,
  Mail,
  MapPin,
  Building,
  Calendar,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useLeads, useLeadStatus } from '@/hooks/useLeads';
import { Lead, LeadStatus } from '@/types/leads';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import LeadSearchForm from '@/components/LeadSearchForm';

const LeadsPage: React.FC = () => {
  const { leads, loading, error, loadLeads, addLead, updateLead, deleteLead } = useLeads();
  const { getStatusColor, getStatusLabel } = useLeadStatus();
  
  // États de recherche
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState({ found: 0, percentage: 0, elapsed: 0 });
  const [showSearchForm, setShowSearchForm] = useState(false);
  
  // États de sélection
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  // Filtres
  const [filters, setFilters] = useState({
    status: 'all' as LeadStatus | 'all',
    hasEmail: false,
    hasPhone: false,
    hasSocial: false,
    searchTerm: ''
  });

  // Chargement initial
  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  // Calcul des statistiques
  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    interested: leads.filter(l => l.status === 'interested').length,
    clients: leads.filter(l => l.status === 'client').length,
    toContact: leads.filter(l => l.status === 'new' && (l.email || l.phone)).length
  };

  // Filtrage des leads
  const filteredLeads = leads.filter(lead => {
    const matchesStatus = filters.status === 'all' || lead.status === filters.status;
    const matchesSearch = lead.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                         lead.category.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                         lead.city.toLowerCase().includes(filters.searchTerm.toLowerCase());
    const matchesEmail = !filters.hasEmail || !!lead.email;
    const matchesPhone = !filters.hasPhone || !!lead.phone;
    const matchesSocial = !filters.hasSocial || !!(lead.socialMedia?.instagram || lead.socialMedia?.facebook);
    
    return matchesStatus && matchesSearch && matchesEmail && matchesPhone && matchesSocial;
  });

  // Gestion de la sélection
  const handleSelectLead = (leadId: string) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(lead => lead.id));
    }
  };

  // Gestion de la recherche
  const handleSearch = async (searchParams: any) => {
    setIsSearching(true);
    setSearchProgress({ found: 0, percentage: 0, elapsed: 0 });

    try {
      // TODO: Intégration N8N
      // const response = await fetch(N8N_WEBHOOK_URL, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(searchParams)
      // });

      // Simulation de recherche
      const interval = setInterval(() => {
        setSearchProgress(prev => {
          const newFound = Math.min(prev.found + Math.floor(Math.random() * 5) + 1, searchParams.maxResults);
          const newPercentage = (newFound / searchParams.maxResults) * 100;
          const newElapsed = prev.elapsed + 2;

          if (newFound >= searchParams.maxResults) {
            clearInterval(interval);
            setIsSearching(false);
            
            // Générer des leads mock
            const newLeads = generateMockLeads(searchParams);
            const mergedLeads = mergeLeads(leads, newLeads);
            
            // Sauvegarder
            localStorage.setItem('postelma_leads', JSON.stringify(mergedLeads));
            loadLeads();
            
            toast.success(
              `✓ ${newLeads.length} nouveaux leads trouvés !`,
              { description: `Recherche: ${searchParams.query} à ${searchParams.city}` }
            );
          }

          return {
            found: newFound,
            percentage: newPercentage,
            elapsed: newElapsed
          };
        });
      }, 2000);

    } catch (error) {
      setIsSearching(false);
      toast.error('Erreur lors de la recherche', {
        description: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  };

  const cancelSearch = () => {
    setIsSearching(false);
    setSearchProgress({ found: 0, percentage: 0, elapsed: 0 });
  };

  // Fonction pour éviter les doublons
  const mergeLeads = (existing: Lead[], newLeads: Lead[]): Lead[] => {
    const merged = [...existing];
    
    newLeads.forEach(newLead => {
      const isDuplicate = existing.some(lead => 
        lead.email === newLead.email || 
        lead.phone === newLead.phone ||
        (lead.name === newLead.name && lead.city === newLead.city)
      );

      if (!isDuplicate) {
        merged.push(newLead);
      }
    });

    return merged;
  };

  // Génération de leads mock
  const generateMockLeads = (params: any): Lead[] => {
    const categories = ['restaurant', 'salon', 'coach', 'boutique', 'service'];
    const names = [
      'Le Bistrot du Coin', 'Salon Coiffure Élégance', 'Coach Sportif Pro',
      'Boutique Mode Chic', 'Service à Domicile', 'Restaurant Gastronomique',
      'Institut de Beauté', 'Gym Fitness', 'Boulangerie Artisanale', 'Café Culturel'
    ];
    
    return Array.from({ length: Math.min(params.maxResults, 25) }, (_, i) => ({
      id: `mock_lead_${Date.now()}_${i}`,
      name: names[i % names.length],
      category: categories[i % categories.length],
      address: `${Math.floor(Math.random() * 100) + 1} Rue de la ${params.query}`,
      city: params.city,
      postalCode: `${Math.floor(Math.random() * 90000) + 10000}`,
      phone: params.includePhone ? `0${Math.floor(Math.random() * 900000000) + 100000000}` : undefined,
      email: params.includeEmail ? `contact@${names[i % names.length].toLowerCase().replace(/\s+/g, '')}.com` : undefined,
      website: `https://www.${names[i % names.length].toLowerCase().replace(/\s+/g, '')}.com`,
      socialMedia: params.includeSocial ? {
        instagram: `@${names[i % names.length].toLowerCase().replace(/\s+/g, '')}`,
        facebook: names[i % names.length],
        linkedin: names[i % names.length]
      } : undefined,
      status: 'new' as LeadStatus,
      notes: '',
      tags: ['recherche_automatique'],
      addedAt: new Date(),
      source: 'google_maps'
    }));
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header avec stats */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lead Generation</h1>
          <p className="text-gray-600">
            Gérez vos prospects et développez votre portefeuille client
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Importer
          </Button>
          <Button onClick={() => setShowSearchForm(!showSearchForm)}>
            <Search className="w-4 h-4 mr-2" />
            Rechercher
          </Button>
        </div>
      </div>

      {/* KPIs Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-500">+23 ce mois</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">À Contacter</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.toContact}</p>
                <p className="text-xs text-gray-500">-15 vs hier</p>
              </div>
              <Phone className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Intéressés</p>
                <p className="text-2xl font-bold text-green-600">{stats.interested}</p>
                <p className="text-xs text-gray-500">+5 cette semaine</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clients</p>
                <p className="text-2xl font-bold text-purple-600">{stats.clients}</p>
                <p className="text-xs text-gray-500">+2 ce mois</p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formulaire de recherche (collapsible) */}
      <Collapsible open={showSearchForm} onOpenChange={setShowSearchForm}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recherche de Leads</CardTitle>
                  <CardDescription>
                    Trouvez automatiquement de nouveaux prospects
                  </CardDescription>
                </div>
                {showSearchForm ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <CardContent>
              <LeadSearchForm 
                onSearch={handleSearch}
                isSearching={isSearching}
                searchProgress={searchProgress}
                onCancel={cancelSearch}
              />
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher par nom, catégorie, ville..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value as LeadStatus | 'all' }))}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="new">Nouveau</SelectItem>
                <SelectItem value="contacted">Contacté</SelectItem>
                <SelectItem value="interested">Intéressé</SelectItem>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="not_interested">Pas intéressé</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasEmail"
                  checked={filters.hasEmail}
                  onCheckedChange={(checked) => setFilters(prev => ({ ...prev, hasEmail: !!checked }))}
                />
                <label htmlFor="hasEmail" className="text-sm">Email</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasPhone"
                  checked={filters.hasPhone}
                  onCheckedChange={(checked) => setFilters(prev => ({ ...prev, hasPhone: !!checked }))}
                />
                <label htmlFor="hasPhone" className="text-sm">Téléphone</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasSocial"
                  checked={filters.hasSocial}
                  onCheckedChange={(checked) => setFilters(prev => ({ ...prev, hasSocial: !!checked }))}
                />
                <label htmlFor="hasSocial" className="text-sm">Réseaux sociaux</label>
              </div>
            </div>
            
            <Button variant="outline" size="sm" onClick={loadLeads}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table des résultats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Leads ({filteredLeads.length})</CardTitle>
              <CardDescription>
                Gérez vos prospects et suivez leur progression
              </CardDescription>
            </div>
            
            {filteredLeads.length > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                >
                  {selectedLeads.length === filteredLeads.length ? 'Tout désélectionner' : 'Tout sélectionner'}
                </Button>
                
                {selectedLeads.length > 0 && (
                  <Button size="sm">
                    <Mail className="w-4 h-4 mr-2" />
                    Contacter ({selectedLeads.length})
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          {error ? (
            <div className="text-center py-8">
              <p className="text-red-600">Erreur: {error}</p>
              <Button onClick={loadLeads} className="mt-4">
                Réessayer
              </Button>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {leads.length === 0 ? 'Aucun lead trouvé' : 'Aucun lead ne correspond à vos critères'}
              </h3>
              <p className="text-gray-600 mb-4">
                {leads.length === 0 
                  ? 'Commencez par rechercher vos premiers leads'
                  : 'Ajustez vos filtres pour voir plus de résultats'
                }
              </p>
              <Button onClick={() => setShowSearchForm(true)}>
                <Search className="w-4 h-4 mr-2" />
                Rechercher des leads
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLeads.map((lead) => (
                <LeadRow 
                  key={lead.id} 
                  lead={lead}
                  isSelected={selectedLeads.includes(lead.id)}
                  onSelect={() => handleSelectLead(lead.id)}
                  onView={() => setSelectedLead(lead)}
                  getStatusColor={getStatusColor}
                  getStatusLabel={getStatusLabel}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Composant pour une ligne de lead
interface LeadRowProps {
  lead: Lead;
  isSelected: boolean;
  onSelect: () => void;
  onView: () => void;
  getStatusColor: (status: LeadStatus) => string;
  getStatusLabel: (status: LeadStatus) => string;
}

const LeadRow: React.FC<LeadRowProps> = ({ 
  lead, 
  isSelected, 
  onSelect, 
  onView, 
  getStatusColor, 
  getStatusLabel 
}) => {
  return (
    <Card className={cn(
      "hover:shadow-md transition-shadow",
      isSelected && "ring-2 ring-blue-500 bg-blue-50"
    )}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={onSelect}
              className="w-4 h-4 text-blue-600"
            />
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-gray-900">{lead.name}</h3>
                <Badge className={cn("text-xs", getStatusColor(lead.status))}>
                  {getStatusLabel(lead.status)}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {lead.category}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{lead.city}</span>
                </div>
                
                {lead.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    <span>{lead.phone}</span>
                  </div>
                )}
                
                {lead.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    <span>{lead.email}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(lead.addedAt).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <Button variant="outline" size="sm" onClick={onView}>
              <Eye className="w-4 h-4 mr-2" />
              Voir
            </Button>
            
            <Button variant="outline" size="sm">
              <Mail className="w-4 h-4" />
            </Button>
            
            <Button variant="outline" size="sm">
              <Phone className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeadsPage;
