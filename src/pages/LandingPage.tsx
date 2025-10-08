import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Menu, 
  X, 
  ChevronDown, 
  BarChart3, 
  Calendar, 
  Users, 
  Zap, 
  Shield, 
  Star,
  CheckCircle,
  ArrowRight,
  Play,
  MessageSquare,
  TrendingUp,
  Target,
  Globe,
  Sparkles,
  Instagram,
  Linkedin,
  Twitter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Ajout des keyframes CSS personnalisés
const customStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(-2deg); }
    50% { transform: translateY(-20px) rotate(-2deg); }
  }
  
  @keyframes fade-in-left {
    from { opacity: 0; transform: translateX(-50px); }
    to { opacity: 1; transform: translateX(0); }
  }
  
  @keyframes fade-in-right {
    from { opacity: 0; transform: translateX(50px); }
    to { opacity: 1; transform: translateX(0); }
  }
  
  @keyframes pulse-slow {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  
  .animate-fade-in-left {
    animation: fade-in-left 0.8s ease-out;
  }
  
  .animate-fade-in-right {
    animation: fade-in-right 0.8s ease-out;
  }
  
  .animate-pulse-slow {
    animation: pulse-slow 3s ease-in-out infinite;
  }
`;

// Injection des styles CSS
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = customStyles;
  document.head.appendChild(styleSheet);
}

const LandingPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#1a4d2e] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Postelma</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <button className="text-gray-700 hover:text-[#1a4d2e] font-medium transition-colors">
                Fonctionnalités
              </button>
              <button className="text-gray-700 hover:text-[#1a4d2e] font-medium transition-colors">
                Solutions
              </button>
              <button className="text-gray-700 hover:text-[#1a4d2e] font-medium transition-colors">
                Tarifs
              </button>
              <button className="text-gray-700 hover:text-[#1a4d2e] font-medium transition-colors">
                Ressources
              </button>
            </nav>

            {/* CTA Buttons */}
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                className="text-gray-700 hover:text-[#1a4d2e] font-medium"
              >
                Se connecter
              </Button>
              <Button 
                className="bg-[#1a4d2e] hover:bg-[#2d5f4a] text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all"
              >
                Essai gratuit
              </Button>
            </div>

            {/* Mobile menu button */}
            <button 
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
            </button>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <motion.div 
              className="lg:hidden mt-4 py-4 border-t border-gray-200"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <nav className="flex flex-col space-y-4">
                <button className="text-gray-700 hover:text-[#1a4d2e] font-medium text-left">
                  Fonctionnalités
                </button>
                <button className="text-gray-700 hover:text-[#1a4d2e] font-medium text-left">
                  Solutions
                </button>
                <button className="text-gray-700 hover:text-[#1a4d2e] font-medium text-left">
                  Tarifs
                </button>
                <button className="text-gray-700 hover:text-[#1a4d2e] font-medium text-left">
                  Ressources
                </button>
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                  <Button 
                    variant="ghost" 
                    className="text-gray-700 hover:text-[#1a4d2e] font-medium justify-start"
                  >
                    Se connecter
                  </Button>
                  <Button 
                    className="bg-[#1a4d2e] hover:bg-[#2d5f4a] text-white font-semibold px-6 py-2 rounded-lg"
                  >
                    Essai gratuit
                  </Button>
                </div>
              </nav>
            </motion.div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-32 bg-gradient-to-br from-[#1a4d2e] via-[#2d5f4a] to-[#1e3a2f] overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Side - Text Content */}
            <motion.div 
              className="text-white"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1 
                className="text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight text-white mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                Une solution puissante pour la gestion des réseaux sociaux
              </motion.h1>
              
              <motion.p 
                className="text-lg lg:text-xl text-green-50 opacity-90 mt-6 mb-8 max-w-xl leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Notre plateforme tout-en-un libère le plein potentiel des réseaux sociaux 
                pour transformer votre stratégie marketing et chaque aspect de votre organisation.
              </motion.p>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4 mb-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <Button 
                  size="lg" 
                  className="bg-white text-green-900 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 hover:scale-105 shadow-xl transition-all duration-300"
                >
                  Démarrer gratuitement
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 backdrop-blur-sm"
                >
                  <Play className="mr-2 w-4 h-4" />
                  Demander une démo
                </Button>
              </motion.div>

              <motion.p 
                className="text-sm text-green-100/70 mt-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Aucune carte bancaire requise
              </motion.p>
            </motion.div>

            {/* Right Side - Mockup Interface */}
            <motion.div 
              className="relative perspective-1000"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Main Dashboard Mockup */}
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-y-[-5deg] rotate-x-[2deg] hover:rotate-y-[-2deg] hover:rotate-x-[1deg] transition-transform duration-500 animate-float">
                {/* Header mockup */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">P</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Postelma Dashboard</h3>
                      <p className="text-sm text-gray-500">Aperçu des fonctionnalités</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Excellent Dashboard!</span>
                  </Badge>
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {/* Left card */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">😊</span>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Taux de satisfaction</p>
                        <p className="text-2xl font-bold text-green-600">92%</p>
                      </div>
                    </div>
                    <div className="h-8 bg-gradient-to-r from-green-400 to-green-600 rounded flex items-end space-x-1 mb-2">
                      <div className="w-1 h-4 bg-green-300 rounded"></div>
                      <div className="w-1 h-6 bg-green-400 rounded"></div>
                      <div className="w-1 h-5 bg-green-500 rounded"></div>
                      <div className="w-1 h-7 bg-green-600 rounded"></div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 text-xs">+15% vs mois dernier</Badge>
                  </div>

                  {/* Right card */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="mb-2">
                      <p className="text-sm font-medium text-gray-700">Nouveaux posts publiés</p>
                      <p className="text-2xl font-bold text-blue-600">847</p>
                    </div>
                    <div className="h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded flex items-end space-x-1 mb-2">
                      <div className="w-1 h-3 bg-blue-300 rounded"></div>
                      <div className="w-1 h-5 bg-blue-400 rounded"></div>
                      <div className="w-1 h-4 bg-blue-500 rounded"></div>
                      <div className="w-1 h-6 bg-blue-600 rounded"></div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 text-xs">+30%</Badge>
                  </div>
                </div>

                {/* Line chart section */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Performance cette semaine</h4>
                  <div className="h-20 bg-gray-50 rounded-lg p-3">
                    <div className="h-full flex items-end space-x-2">
                      {[3, 5, 4, 7, 6].map((height, index) => (
                        <div 
                          key={index}
                          className="w-8 bg-gradient-to-t from-green-400 to-green-600 rounded-t"
                          style={{ height: `${height * 8}px` }}
                        ></div>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>Lun</span>
                      <span>Mar</span>
                      <span>Mer</span>
                      <span>Jeu</span>
                      <span>Ven</span>
                    </div>
                  </div>
                </div>

                {/* Bottom section - Preview posts */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Derniers posts</h4>
                  <div className="flex space-x-2">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-lg flex items-center justify-center">
                      <Instagram className="w-6 h-6 text-white" />
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-700 to-blue-800 rounded-lg flex items-center justify-center">
                      <Linkedin className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div 
                className="absolute -left-4 -top-4 bg-white shadow-xl rounded-lg p-3 border transform rotate-[-5deg] animate-pulse-slow"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center space-x-2">
                  <Instagram className="w-4 h-4 text-pink-500" />
                  <div>
                    <p className="text-xs font-medium">Instagram</p>
                    <p className="text-xs text-green-600">+234 followers</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="absolute -right-4 -bottom-4 bg-green-100 shadow-xl rounded-lg p-3 border transform rotate-[5deg] animate-pulse-slow"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-xs font-medium">Performance</p>
                    <p className="text-xs text-green-600">+45%</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <motion.section 
        className="py-16 bg-gray-50"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              #1 Meilleur Logiciel 2024
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Reconnu par les professionnels du marketing digital
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {[
              { name: 'Atlassian', width: 'w-24' },
              { name: 'HP', width: 'w-16' },
              { name: 'UNICEF', width: 'w-20' },
              { name: 'Microsoft', width: 'w-24' },
              { name: 'Salesforce', width: 'w-28' },
              { name: 'Adobe', width: 'w-20' }
            ].map((partner, index) => (
              <motion.div
                key={partner.name}
                className={`${partner.width} h-12 bg-gray-300 rounded flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-300`}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 0.6, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <span className="text-xs font-medium text-gray-600">{partner.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-[#e8f5e9] text-[#1a4d2e] rounded-full px-4 py-1 mb-4">
              Fonctionnalités
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tout ce dont vous avez besoin pour réussir sur les réseaux sociaux
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              De la création à l'analyse, gérez tout au même endroit
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {[
              {
                icon: <Sparkles className="w-8 h-8 text-purple-600" />,
                iconBg: "bg-purple-100",
                title: 'Génération de contenu par IA',
                description: 'Créez des captions engageantes et des images professionnelles en quelques secondes grâce à notre IA intégrée',
                features: ['6 tons de voix', '4 types de génération d\'images', 'Personnalisation avancée']
              },
              {
                icon: <Calendar className="w-8 h-8 text-blue-600" />,
                iconBg: "bg-blue-100",
                title: 'Planification et programmation',
                description: 'Organisez votre contenu avec notre calendrier drag & drop et publiez au meilleur moment',
                features: ['Meilleur moment suggéré', 'Multi-plateformes', 'Aperçu réaliste']
              },
              {
                icon: <BarChart3 className="w-8 h-8 text-[#1a4d2e]" />,
                iconBg: "bg-[#e8f5e9]",
                title: 'Analytics et insights',
                description: 'Suivez vos performances en temps réel et optimisez votre stratégie avec des données précises',
                features: ['Métriques détaillées', 'Comparaison concurrents', 'Export rapports']
              },
              {
                icon: <Users className="w-8 h-8 text-orange-600" />,
                iconBg: "bg-orange-100",
                title: 'Génération de leads',
                description: 'Trouvez et gérez vos prospects directement depuis la plateforme avec notre système de recherche intelligent',
                features: ['Recherche avancée', 'Filtres multi-critères', 'Export CSV']
              },
              {
                icon: <Shield className="w-8 h-8 text-indigo-600" />,
                iconBg: "bg-indigo-100",
                title: 'Collaboration en équipe',
                description: 'Travaillez efficacement avec votre équipe grâce aux rôles, permissions et workflow d\'approbation',
                features: ['4 niveaux de rôles', 'Workflow validation', 'Audit trail']
              },
              {
                icon: <Target className="w-8 h-8 text-red-600" />,
                iconBg: "bg-red-100",
                title: 'Analyse de la concurrence',
                description: 'Surveillez vos concurrents et adaptez votre stratégie en fonction de leurs meilleures pratiques',
                features: ['Suivi automatique', 'Suggestions IA', 'Benchmarks']
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="p-6 rounded-xl border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-white"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
              >
                <div className={`${feature.iconBg} rounded-lg p-3 w-fit mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <ul className="space-y-1">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="text-sm text-gray-500 flex items-center">
                      <span className="text-[#1a4d2e] mr-2">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-[#e8f5e9] text-[#1a4d2e] rounded-full px-4 py-1 mb-4">
              Tarifs
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Des prix adaptés à votre croissance
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Commencez gratuitement, évoluez à votre rythme
            </p>
            
            {/* Toggle Mensuel/Annuel */}
            <div className="flex items-center justify-center space-x-4">
              <span className="text-gray-600">Mensuel</span>
              <div className="relative">
                <input type="checkbox" id="pricing-toggle" className="sr-only" />
                <label htmlFor="pricing-toggle" className="flex items-center cursor-pointer">
                  <div className="w-14 h-7 bg-gray-300 rounded-full p-1 transition-colors">
                    <div className="w-5 h-5 bg-white rounded-full shadow transform transition-transform"></div>
                  </div>
                </label>
              </div>
              <span className="text-gray-600">Annuel</span>
              <Badge className="bg-[#e8f5e9] text-[#1a4d2e]">Économisez 20%</Badge>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Plan Free */}
            <motion.div
              className="p-8 rounded-2xl border-2 border-gray-200 bg-white shadow-xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-center">
                <Badge className="bg-gray-100 text-gray-800 mb-4">Gratuit</Badge>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-gray-900">0€</span>
                  <span className="text-gray-600">/mois</span>
                </div>
                <p className="text-gray-600 mb-6">Pour découvrir la plateforme</p>
                <Button variant="outline" className="w-full mb-6">
                  Commencer gratuitement
                </Button>
                <ul className="space-y-3 text-left">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-[#1a4d2e] mr-2" />
                    1 compte social
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-[#1a4d2e] mr-2" />
                    10 posts/mois
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-[#1a4d2e] mr-2" />
                    Génération IA basique
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-[#1a4d2e] mr-2" />
                    Analytics de base
                  </li>
                  <li className="flex items-center text-sm text-gray-400">
                    <X className="w-4 h-4 mr-2" />
                    Lead generation
                  </li>
                  <li className="flex items-center text-sm text-gray-400">
                    <X className="w-4 h-4 mr-2" />
                    Competitive intelligence
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Plan Pro - Populaire */}
            <motion.div
              className="p-8 rounded-2xl border-4 border-[#1a4d2e] bg-white shadow-xl relative scale-105"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.07 }}
            >
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#1a4d2e] text-white">
                Le plus populaire
              </Badge>
              <div className="text-center">
                <Badge className="bg-[#e8f5e9] text-[#1a4d2e] mb-4">Pro</Badge>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-gray-900">29€</span>
                  <span className="text-gray-600">/mois</span>
                </div>
                <p className="text-gray-600 mb-6">Pour les entrepreneurs et PME</p>
                <Button className="w-full bg-[#1a4d2e] hover:bg-[#2d5f4a] text-white shadow-lg mb-6">
                  Essayer Pro
                </Button>
                <ul className="space-y-3 text-left">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-[#1a4d2e] mr-2" />
                    5 comptes sociaux
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-[#1a4d2e] mr-2" />
                    100 posts/mois
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-[#1a4d2e] mr-2" />
                    Génération IA illimitée
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-[#1a4d2e] mr-2" />
                    Analytics avancés
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-[#1a4d2e] mr-2" />
                    50 leads/mois
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-[#1a4d2e] mr-2" />
                    3 concurrents analysés
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-[#1a4d2e] mr-2" />
                    Best time to post
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-[#1a4d2e] mr-2" />
                    Support prioritaire
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Plan Business */}
            <motion.div
              className="p-8 rounded-2xl border-2 border-gray-300 bg-white shadow-xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-center">
                <Badge className="bg-[#e8f5e9] text-[#1a4d2e] mb-4">Business</Badge>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-gray-900">79€</span>
                  <span className="text-gray-600">/mois</span>
                </div>
                <p className="text-gray-600 mb-6">Pour les agences et grandes équipes</p>
                <Button variant="outline" className="w-full mb-6">
                  Essayer Business
                </Button>
                <ul className="space-y-3 text-left">
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-[#1a4d2e] mr-2" />
                    15 comptes sociaux
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-[#1a4d2e] mr-2" />
                    Posts illimités
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-[#1a4d2e] mr-2" />
                    Tout du plan Pro
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-[#1a4d2e] mr-2" />
                    500 leads/mois
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-[#1a4d2e] mr-2" />
                    10 concurrents analysés
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-[#1a4d2e] mr-2" />
                    Team collaboration
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-[#1a4d2e] mr-2" />
                    White-label reports
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-[#1a4d2e] mr-2" />
                    API access
                  </li>
                  <li className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-[#1a4d2e] mr-2" />
                    Support dédié
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>

          {/* FAQ Section */}
          <motion.div 
            className="mt-20"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Questions fréquentes
            </h3>
            <div className="max-w-3xl mx-auto space-y-4">
              {[
                {
                  question: "Puis-je changer de plan à tout moment ?",
                  answer: "Oui, vous pouvez upgrader ou downgrader votre plan à tout moment depuis votre tableau de bord."
                },
                {
                  question: "Les paiements sont-ils sécurisés ?",
                  answer: "Absolument. Nous utilisons Stripe pour tous les paiements, avec un chiffrement de niveau bancaire."
                },
                {
                  question: "Y a-t-il un engagement ?",
                  answer: "Non, vous pouvez annuler votre abonnement à tout moment sans frais supplémentaires."
                },
                {
                  question: "Que se passe-t-il après l'essai gratuit ?",
                  answer: "Vos données sont conservées pendant 30 jours. Vous pouvez reprendre votre abonnement à tout moment."
                },
                {
                  question: "Proposez-vous des réductions pour les non-profits ?",
                  answer: "Oui, nous offrons 50% de réduction sur tous nos plans pour les organisations à but non lucratif."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                  <p className="text-gray-600">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Final Section */}
      <section className="py-20 bg-gradient-to-r from-[#1a4d2e] to-[#2d5f4a]">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Prêt à transformer votre présence sur les réseaux sociaux ?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Rejoignez des centaines d'entreprises qui font confiance à Postelma
            </p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Button 
                size="lg" 
                className="bg-white text-[#1a4d2e] hover:bg-gray-50 px-8 py-4 text-lg rounded-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Démarrer gratuitement
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
            <p className="text-sm text-white/80">
              Essai gratuit • Sans engagement • Support inclus
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Colonne 1 - À propos */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-[#1a4d2e] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <span className="text-xl font-bold">Postelma</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-sm">
                La plateforme tout-en-un pour gérer, créer et analyser votre présence sur les réseaux sociaux
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-[#4a7c5e] transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-[#4a7c5e] transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-[#4a7c5e] transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Colonne 2 - Produit */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Produit</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#features" className="hover:text-[#4a7c5e] transition-colors">Fonctionnalités</a></li>
                <li><a href="#pricing" className="hover:text-[#4a7c5e] transition-colors">Tarifs</a></li>
                <li><a href="#" className="hover:text-[#4a7c5e] transition-colors">Intégrations</a></li>
                <li><a href="#" className="hover:text-[#4a7c5e] transition-colors">Changelog</a></li>
                <li><a href="#" className="hover:text-[#4a7c5e] transition-colors">Roadmap</a></li>
              </ul>
            </div>

            {/* Colonne 3 - Entreprise */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Entreprise</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-[#4a7c5e] transition-colors">À propos</a></li>
                <li><a href="#" className="hover:text-[#4a7c5e] transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-[#4a7c5e] transition-colors">Carrières</a></li>
                <li><a href="#" className="hover:text-[#4a7c5e] transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-[#4a7c5e] transition-colors">Presse</a></li>
              </ul>
            </div>

            {/* Colonne 4 - Ressources */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Ressources</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-[#4a7c5e] transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-[#4a7c5e] transition-colors">Guides</a></li>
                <li><a href="#" className="hover:text-[#4a7c5e] transition-colors">Tutoriels</a></li>
                <li><a href="#" className="hover:text-[#4a7c5e] transition-colors">API</a></li>
                <li><a href="#" className="hover:text-[#4a7c5e] transition-colors">Support</a></li>
              </ul>
            </div>
          </div>

          {/* Sous-footer */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2025 Postelma. Tous droits réservés.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-[#4a7c5e] text-sm transition-colors">
                  Confidentialité
                </a>
                <a href="#" className="text-gray-400 hover:text-[#4a7c5e] text-sm transition-colors">
                  Conditions
                </a>
                <a href="#" className="text-gray-400 hover:text-[#4a7c5e] text-sm transition-colors">
                  Cookies
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
