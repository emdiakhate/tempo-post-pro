# 🧩 Documentation des Composants

## 🎯 Vue d'ensemble

Les composants de Postelma sont organisés de manière modulaire avec une architecture claire et des types TypeScript stricts.

## 🏗️ Architecture

```
src/components/
├── ui/                    # Composants UI de base (Shadcn)
├── common/               # Composants communs réutilisables
├── creation/              # Composants de création de contenu
├── cards/                 # Composants de cartes
├── modals/                # Composants de modales
├── Layout.tsx             # Layout principal
├── PostCard.tsx           # Carte de publication
├── PostCreationModal.tsx  # Modal de création
├── PreviewModal.tsx       # Modal de prévisualisation
└── UserMenu.tsx           # Menu utilisateur
```

## 🔧 Composants Principaux

### **Layout**
Layout principal avec sidebar et header.

```typescript
import Layout from '@/components/Layout';

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/calendar" element={<CalendarView />} />
        <Route path="/analytics" element={<Analytics />} />
        {/* ... autres routes */}
      </Routes>
    </Layout>
  );
};
```

**Propriétés :**
- `children: React.ReactNode` - Contenu à afficher
- `sidebarCollapsed?: boolean` - État de la sidebar
- `onSidebarToggle?: () => void` - Callback de toggle

### **PostCard**
Carte d'affichage d'une publication.

```typescript
import { PostCard } from '@/components/PostCard';

const PostList = ({ posts }) => {
  return (
    <div>
      {posts.map(post => (
        <PostCard
          key={post.id}
          post={post}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          onPreview={handlePreview}
        />
      ))}
    </div>
  );
};
```

**Propriétés :**
- `post: Post` - Données de la publication
- `onEdit?: (post: Post) => void` - Callback d'édition
- `onDelete?: (post: Post) => void` - Callback de suppression
- `onDuplicate?: (post: Post) => void` - Callback de duplication
- `onPreview?: (post: Post) => void` - Callback de prévisualisation

### **PostCreationModal**
Modal de création et édition de publications.

```typescript
import { PostCreationModal } from '@/components/PostCreationModal';

const CreatePostButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Créer un post
      </Button>
      <PostCreationModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={handleSave}
        post={editingPost} // Optionnel pour l'édition
      />
    </>
  );
};
```

**Propriétés :**
- `isOpen: boolean` - État d'ouverture
- `onClose: () => void` - Callback de fermeture
- `onSave: (post: Post) => void` - Callback de sauvegarde
- `post?: Post` - Post à éditer (optionnel)

### **PreviewModal**
Modal de prévisualisation des publications.

```typescript
import { PreviewModal } from '@/components/PreviewModal';

const PreviewButton = ({ post }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Prévisualiser
      </Button>
      <PreviewModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        post={post}
        platforms={['instagram', 'facebook']}
      />
    </>
  );
};
```

**Propriétés :**
- `isOpen: boolean` - État d'ouverture
- `onClose: () => void` - Callback de fermeture
- `post: Post` - Post à prévisualiser
- `platforms: SocialPlatform[]` - Plateformes à afficher

## 🧩 Composants Communs

### **StatusBadge**
Badge de statut avec couleurs et icônes.

```typescript
import { StatusBadge } from '@/components/common/StatusBadge';

const PostStatus = ({ status }) => {
  return (
    <StatusBadge
      status={status}
      variant="default"
      size="sm"
    />
  );
};
```

**Propriétés :**
- `status: PostStatus` - Statut à afficher
- `variant?: 'default' | 'outline' | 'secondary'` - Variante du badge
- `size?: 'sm' | 'md' | 'lg'` - Taille du badge

### **PlatformBadge**
Badge de plateforme sociale.

```typescript
import { PlatformBadge } from '@/components/common/PlatformBadge';

const PlatformList = ({ platforms }) => {
  return (
    <div>
      {platforms.map(platform => (
        <PlatformBadge
          key={platform}
          platform={platform}
          size="sm"
        />
      ))}
    </div>
  );
};
```

**Propriétés :**
- `platform: SocialPlatform` - Plateforme à afficher
- `size?: 'sm' | 'md' | 'lg'` - Taille du badge
- `showIcon?: boolean` - Afficher l'icône

### **ConfirmDialog**
Dialog de confirmation pour les actions critiques.

```typescript
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

const DeleteButton = ({ onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="destructive" onClick={() => setIsOpen(true)}>
        Supprimer
      </Button>
      <ConfirmDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={onDelete}
        title="Supprimer le post"
        description="Êtes-vous sûr de vouloir supprimer ce post ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </>
  );
};
```

**Propriétés :**
- `isOpen: boolean` - État d'ouverture
- `onClose: () => void` - Callback de fermeture
- `onConfirm: () => void` - Callback de confirmation
- `title: string` - Titre du dialog
- `description: string` - Description de l'action
- `confirmText?: string` - Texte du bouton de confirmation
- `cancelText?: string` - Texte du bouton d'annulation

## 🎨 Composants de Création

### **ToneSelector**
Sélecteur de ton de voix pour l'IA.

```typescript
import { ToneSelector } from '@/components/creation/ToneSelector';

const CaptionGenerator = () => {
  const [selectedTone, setSelectedTone] = useState('professional');

  return (
    <ToneSelector
      value={selectedTone}
      onChange={setSelectedTone}
      disabled={false}
    />
  );
};
```

**Propriétés :**
- `value: string` - Ton sélectionné
- `onChange: (tone: string) => void` - Callback de changement
- `disabled?: boolean` - État désactivé

### **HashtagManager**
Gestionnaire de hashtags.

```typescript
import { HashtagManager } from '@/components/creation/HashtagManager';

const HashtagSection = () => {
  const [hashtags, setHashtags] = useState<string[]>([]);

  return (
    <HashtagManager
      hashtags={hashtags}
      onChange={setHashtags}
      maxHashtags={30}
      suggestions={['marketing', 'socialmedia', 'business']}
    />
  );
};
```

**Propriétés :**
- `hashtags: string[]` - Liste des hashtags
- `onChange: (hashtags: string[]) => void` - Callback de changement
- `maxHashtags?: number` - Nombre maximum de hashtags
- `suggestions?: string[]` - Suggestions de hashtags

### **BestTimeWidget**
Widget des meilleurs moments pour publier.

```typescript
import { BestTimeWidget } from '@/components/creation/BestTimeWidget';

const SchedulingSection = () => {
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);

  return (
    <BestTimeWidget
      platform="instagram"
      onTimeSelect={setSelectedTime}
      selectedTime={selectedTime}
    />
  );
};
```

**Propriétés :**
- `platform: SocialPlatform` - Plateforme cible
- `onTimeSelect: (time: Date) => void` - Callback de sélection
- `selectedTime?: Date | null` - Heure sélectionnée

### **MediaUploader**
Composant d'upload de médias.

```typescript
import { MediaUploader } from '@/components/creation/MediaUploader';

const MediaSection = () => {
  const [media, setMedia] = useState<File[]>([]);

  return (
    <MediaUploader
      files={media}
      onChange={setMedia}
      maxFiles={10}
      maxSize={5 * 1024 * 1024} // 5MB
      acceptedTypes={['image/jpeg', 'image/png', 'video/mp4']}
    />
  );
};
```

**Propriétés :**
- `files: File[]` - Fichiers sélectionnés
- `onChange: (files: File[]) => void` - Callback de changement
- `maxFiles?: number` - Nombre maximum de fichiers
- `maxSize?: number` - Taille maximum par fichier
- `acceptedTypes?: string[]` - Types de fichiers acceptés

### **AIImageGenerator**
Générateur d'images IA.

```typescript
import { AIImageGenerator } from '@/components/creation/AIImageGenerator';

const AISection = () => {
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  return (
    <AIImageGenerator
      onImagesGenerated={setGeneratedImages}
      type="simple"
      prompt="Créer une image de marketing"
    />
  );
};
```

**Propriétés :**
- `onImagesGenerated: (images: string[]) => void` - Callback de génération
- `type: 'simple' | 'editing' | 'combination' | 'ugc'` - Type de génération
- `prompt?: string` - Prompt de génération
- `sourceImage?: string` - Image source (pour l'édition)

## 🎴 Composants de Cartes

### **BaseCard**
Composant de base pour toutes les cartes.

```typescript
import { BaseCard } from '@/components/cards/BaseCard';

const CustomCard = ({ title, content }) => {
  return (
    <BaseCard
      title={title}
      content={content}
      actions={[
        { label: 'Éditer', onClick: handleEdit },
        { label: 'Supprimer', onClick: handleDelete }
      ]}
      variant="default"
      size="md"
    />
  );
};
```

**Propriétés :**
- `title: string` - Titre de la carte
- `content: React.ReactNode` - Contenu de la carte
- `actions?: CardAction[]` - Actions disponibles
- `variant?: 'default' | 'outline' | 'ghost'` - Variante de la carte
- `size?: 'sm' | 'md' | 'lg'` - Taille de la carte

## 🔧 Composants de Modales

### **FormModal**
Modal de formulaire générique.

```typescript
import { FormModal } from '@/components/modals/FormModal';

const UserForm = ({ isOpen, onClose, onSave, user }) => {
  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      onSave={onSave}
      title="Modifier l'utilisateur"
      fields={[
        { name: 'name', label: 'Nom', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'role', label: 'Rôle', type: 'select', options: ['owner', 'manager', 'creator', 'viewer'] }
      ]}
      initialData={user}
    />
  );
};
```

**Propriétés :**
- `isOpen: boolean` - État d'ouverture
- `onClose: () => void` - Callback de fermeture
- `onSave: (data: any) => void` - Callback de sauvegarde
- `title: string` - Titre du modal
- `fields: FormField[]` - Champs du formulaire
- `initialData?: any` - Données initiales

## 🎨 Composants UI

### **Composants Shadcn**
Tous les composants UI de base sont fournis par Shadcn/ui :

- `Button` - Boutons avec variantes
- `Input` - Champs de saisie
- `Select` - Sélecteurs
- `Dialog` - Modales
- `Card` - Cartes
- `Badge` - Badges
- `Toast` - Notifications
- `Tooltip` - Info-bulles
- `DropdownMenu` - Menus déroulants
- `Tabs` - Onglets
- `Switch` - Interrupteurs
- `Checkbox` - Cases à cocher
- `RadioGroup` - Groupes de boutons radio
- `Slider` - Curseurs
- `Progress` - Barres de progression
- `Skeleton` - Placeholders de chargement

## 🧪 Tests

### **Tests Unitaires**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { PostCard } from '@/components/PostCard';

describe('PostCard', () => {
  it('should render post content', () => {
    const post = {
      id: '1',
      content: 'Test post',
      platforms: ['instagram'],
      status: 'published'
    };

    render(<PostCard post={post} />);
    
    expect(screen.getByText('Test post')).toBeInTheDocument();
    expect(screen.getByText('instagram')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', () => {
    const onEdit = jest.fn();
    const post = { id: '1', content: 'Test post' };

    render(<PostCard post={post} onEdit={onEdit} />);
    
    fireEvent.click(screen.getByText('Éditer'));
    expect(onEdit).toHaveBeenCalledWith(post);
  });
});
```

### **Tests d'Intégration**
```typescript
describe('PostCreationModal', () => {
  it('should create a post when form is submitted', async () => {
    const onSave = jest.fn();
    
    render(
      <PostCreationModal
        isOpen={true}
        onClose={jest.fn()}
        onSave={onSave}
      />
    );

    fireEvent.change(screen.getByLabelText('Contenu'), {
      target: { value: 'New post content' }
    });
    
    fireEvent.click(screen.getByText('Créer'));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          content: 'New post content'
        })
      );
    });
  });
});
```

## 📈 Performance

### **Optimisations**
- **Memoization** : `React.memo` pour éviter les re-rendus inutiles
- **Lazy Loading** : Chargement des composants à la demande
- **Virtualization** : Pour les listes longues
- **Debouncing** : Pour les champs de recherche

### **Exemple de Memoization**
```typescript
const PostCard = React.memo(({ post, onEdit, onDelete }) => {
  // Composant optimisé
}, (prevProps, nextProps) => {
  // Comparaison personnalisée
  return (
    prevProps.post.id === nextProps.post.id &&
    prevProps.post.status === nextProps.post.status
  );
});
```

## 🔒 Sécurité

### **Validation des Props**
```typescript
interface PostCardProps {
  post: Post;
  onEdit?: (post: Post) => void;
  onDelete?: (post: Post) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onEdit, onDelete }) => {
  // Validation des props
  if (!post || !post.id) {
    throw new Error('PostCard requires a valid post prop');
  }

  // ...
};
```

### **Sanitisation des Données**
```typescript
const sanitizeContent = (content: string): string => {
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .trim();
};
```

## 📚 Ressources

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Shadcn/ui Components](https://ui.shadcn.com/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [React Performance](https://react.dev/learn/render-and-commit)

---

**Dernière mise à jour :** 2025-01-08  
**Version :** 1.0.0  
**Auteur :** Postelma Team
