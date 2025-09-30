import { Post, Campaign } from '@/types/Post';
import halalMeatDisplay from '@/assets/halal-meat-display.jpg';
import lambChops from '@/assets/lamb-chops.jpg';
import grilledBeef from '@/assets/grilled-beef.jpg';
import butcherShopInterior from '@/assets/butcher-shop-interior.jpg';
import halalChicken from '@/assets/halal-chicken.jpg';

export const campaigns: Campaign[] = [
  {
    id: 'summer-2024',
    name: 'Campagne Été 2024',
    color: '#3B82F6',
    description: 'Promotion des barbecues et grillades d\'été'
  },
  {
    id: 'ramadan-special',
    name: 'Spécial Ramadan',
    color: '#10B981',
    description: 'Offres spéciales pour le mois du Ramadan'
  },
  {
    id: 'eid-celebration',
    name: 'Célébration Aïd',
    color: '#F59E0B',
    description: 'Promotion pour les fêtes de l\'Aïd'
  }
];

export const samplePosts: Post[] = [
  // Sunday posts
  {
    id: 'post-1',
    content: '🥩 Découvrez notre sélection premium de viandes halal fraîches ! Nos steaks de bœuf sont parfaits pour vos grillades du weekend. #ViasdeHalal #QualitéPremium',
    scheduledTime: new Date(2024, 11, 1, 12, 55),
    platforms: ['instagram', 'facebook'],
    status: 'scheduled',
    image: halalMeatDisplay,
    campaign: 'Campagne Été 2024',
    campaignColor: '#3B82F6',
    author: 'Mohammed Boucherie',
    dayColumn: 'dimanche',
    timeSlot: 0,
  },
  {
    id: 'post-2',
    content: '🐑 Nos côtelettes d\'agneau marinées aux herbes de Provence sont prêtes ! Commandez dès maintenant pour votre repas de famille. Livraison gratuite sur Paris.',
    scheduledTime: new Date(2024, 11, 2, 12, 42),
    platforms: ['instagram', 'twitter'],
    status: 'scheduled',
    image: lambChops,
    author: 'Fatima Halal',
    dayColumn: 'lundi',
    timeSlot: 0,
  },
  {
    id: 'post-3',
    content: '☕ Saviez-vous que nos viandes sont certifiées halal par l\'Institut de la Grande Mosquée de Paris ? Qualité et traçabilité garanties depuis 1995.',
    scheduledTime: new Date(2024, 11, 3, 12, 20),
    platforms: ['linkedin', 'facebook'],
    status: 'scheduled',
    image: butcherShopInterior,
    campaign: 'Spécial Ramadan',
    campaignColor: '#10B981',
    author: 'Ahmed Boucherie',
    dayColumn: 'mardi',
    timeSlot: 0,
  },
  {
    id: 'post-4',
    content: '🔥 Nos baristas... pardon, nos bouchers spécialisés dans la découpe préparent vos commandes avec passion ! Rendez-vous en boutique ou commandez en ligne.',
    scheduledTime: new Date(2024, 11, 4, 12, 23),
    platforms: ['facebook'],
    status: 'scheduled',
    author: 'Postelma',
    dayColumn: 'mercredi',
    timeSlot: 0,
  },
  {
    id: 'post-5',
    content: '🎬 Découvrez les coulisses de notre boucherie ! Nos bouchers vous expliquent les différentes découpes et leur préparation traditionnelle.',
    scheduledTime: new Date(2024, 11, 5, 11, 23),
    platforms: ['youtube', 'instagram'],
    status: 'scheduled',
    image: grilledBeef,
    campaign: 'Campagne Été 2024',
    campaignColor: '#3B82F6',
    author: 'Youssef Video',
    dayColumn: 'jeudi',
    timeSlot: 0,
  },
  {
    id: 'post-6',
    content: '✨ Programmé pour plus tard aujourd\'hui ! Notre sélection de volailles halal fraîches arrive directement de nos producteurs partenaires.',
    scheduledTime: new Date(2024, 11, 6, 12, 15),
    platforms: ['facebook', 'instagram'],
    status: 'scheduled',
    image: halalChicken,
    author: 'Postelma',
    dayColumn: 'vendredi',
    timeSlot: 0,
  },
  // Second row posts
  {
    id: 'post-7',
    content: '🌟 Laissez-nous vous aider à préparer votre #Barbecue parfait ! Notre équipe sélectionne les meilleures pièces pour vos grillades estivales.',
    scheduledTime: new Date(2024, 11, 2, 14, 45),
    platforms: ['instagram', 'tiktok'],
    status: 'scheduled',
    image: grilledBeef,
    campaign: 'Campagne Été 2024',
    campaignColor: '#3B82F6',
    author: 'Social Media',
    dayColumn: 'lundi',
    timeSlot: 1,
  },
  {
    id: 'post-8',
    content: '📱 Découvrez nos dernières créations culinaires sur nos réseaux sociaux ! Suivez-nous pour ne rien manquer de nos nouveautés et promotions.',
    scheduledTime: new Date(2024, 11, 2, 13, 10),
    platforms: ['youtube', 'facebook'],
    status: 'scheduled',
    image: butcherShopInterior,
    author: 'Community Manager',
    dayColumn: 'mardi',
    timeSlot: 1,
  },
  {
    id: 'post-9',
    content: '🏆 Notre objectif : être votre boucherie halal de référence à 100% ! Merci pour votre confiance et vos témoignages qui nous motivent chaque jour.',
    scheduledTime: new Date(2024, 11, 4, 12, 40),
    platforms: ['instagram', 'facebook'],
    status: 'scheduled',
    image: halalMeatDisplay,
    campaign: 'Célébration Aïd',
    campaignColor: '#F59E0B',
    author: 'Direction',
    dayColumn: 'mercredi',
    timeSlot: 1,
  },
  {
    id: 'post-10',
    content: '🎯 Notre équipe de bouchers professionnels est à votre service pour vous conseiller dans vos achats. N\'hésitez pas à nous poser vos questions !',
    scheduledTime: new Date(2024, 11, 5, 12, 20),
    platforms: ['twitter', 'linkedin'],
    status: 'scheduled',
    author: 'Service Client',
    dayColumn: 'jeudi',
    timeSlot: 1,
  },
  {
    id: 'post-11',
    content: '📈 Nous sommes honorés d\'être inclus dans cette liste des meilleures boucheries halal de Paris ! Merci à tous nos clients fidèles.',
    scheduledTime: new Date(2024, 11, 6, 13, 25),
    platforms: ['facebook', 'linkedin'],
    status: 'published',
    image: butcherShopInterior,
    campaign: 'Célébration Aïd',
    campaignColor: '#F59E0B',
    author: 'Relations Presse',
    engagement: {
      likes: 234,
      comments: 45,
      shares: 12,
      views: 1520
    },
    dayColumn: 'vendredi',
    timeSlot: 1,
  },
  // Third row posts
  {
    id: 'post-12',
    content: '🥩 Pause déjeuner avec une sélection de nos viandes les plus tendres ! Parfait pour un repas léger et savoureux en milieu de journée.',
    scheduledTime: new Date(2024, 11, 2, 14, 21),
    platforms: ['instagram'],
    status: 'scheduled',
    image: lambChops,
    author: 'Chef Cuisinier',
    dayColumn: 'lundi',
    timeSlot: 2,
  }
];

// Helper function to get posts by day
export const getPostsByDay = (dayColumn: string): Post[] => {
  return samplePosts.filter(post => post.dayColumn === dayColumn);
};

// Helper function to get posts by status
export const getPostsByStatus = (status: string): Post[] => {
  return samplePosts.filter(post => post.status === status);
};

// Helper function to get posts by campaign
export const getPostsByCampaign = (campaignId: string): Post[] => {
  const campaign = campaigns.find(c => c.id === campaignId);
  return campaign ? samplePosts.filter(post => post.campaign === campaign.name) : [];
};