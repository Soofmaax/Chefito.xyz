# 🌐 Architecture de Sous-domaines pour Chefito

## 📋 **Stratégie de Sous-domaines Recommandée**

### **🎯 Domaines Principaux**
- **`chefito.xyz`** → Site principal (marketing + recettes publiques)
- **`app.chefito.xyz`** → Application web complète (authentifiée)
- **`api.chefito.xyz`** → API publique pour développeurs
- **`admin.chefito.xyz`** → Interface d'administration
- **`docs.chefito.xyz`** → Documentation API et guides
- **`blog.chefito.xyz`** → Blog culinaire et actualités

### **🔧 Sous-domaines Techniques**
- **`cdn.chefito.xyz`** → Assets statiques (images, CSS, JS)
- **`voice.chefito.xyz`** → Service de synthèse vocale
- **`ai.chefito.xyz`** → Assistant IA culinaire
- **`webhooks.chefito.xyz`** → Webhooks pour intégrations

### **🌍 Sous-domaines Géographiques (Future)**
- **`fr.chefito.xyz`** → Version française
- **`en.chefito.xyz`** → Version anglaise
- **`es.chefito.xyz`** → Version espagnole

## 🚀 **Configuration Netlify pour Sous-domaines**

### **Étape 1: Configuration DNS**
Dans votre registrar de domaine, ajoutez ces enregistrements CNAME :

```dns
# Sous-domaines principaux
app.chefito.xyz     CNAME   app-chefito.netlify.app
api.chefito.xyz     CNAME   api-chefito.netlify.app
admin.chefito.xyz   CNAME   admin-chefito.netlify.app
docs.chefito.xyz    CNAME   docs-chefito.netlify.app
blog.chefito.xyz    CNAME   blog-chefito.netlify.app

# Sous-domaines techniques
cdn.chefito.xyz     CNAME   cdn-chefito.netlify.app
voice.chefito.xyz   CNAME   voice-chefito.netlify.app
ai.chefito.xyz      CNAME   ai-chefito.netlify.app
```

### **Étape 2: Sites Netlify Séparés**
Créez des sites Netlify séparés pour chaque sous-domaine :

1. **Site Principal** (`chefito.xyz`)
   - Repository: `Chefito.xyz` (branch: `main`)
   - Build: `npm run build`
   - Publish: `.next`

2. **App Web** (`app.chefito.xyz`)
   - Repository: `Chefito.xyz` (branch: `app`)
   - Build: `npm run build:app`
   - Publish: `.next`

3. **API** (`api.chefito.xyz`)
   - Repository: `Chefito-API` (branch: `main`)
   - Build: `npm run build:api`
   - Publish: `dist`

## 📁 **Structure de Projet Recommandée**

```
chefito-monorepo/
├── apps/
│   ├── web/                 # Site principal (chefito.xyz)
│   ├── app/                 # Application web (app.chefito.xyz)
│   ├── admin/               # Interface admin (admin.chefito.xyz)
│   ├── docs/                # Documentation (docs.chefito.xyz)
│   └── blog/                # Blog (blog.chefito.xyz)
├── packages/
│   ├── api/                 # API partagée
│   ├── ui/                  # Composants UI partagés
│   ├── database/            # Schémas et migrations
│   └── voice/               # Service vocal
├── services/
│   ├── ai-assistant/        # Service IA (ai.chefito.xyz)
│   ├── voice-synthesis/     # Service vocal (voice.chefito.xyz)
│   └── webhooks/            # Webhooks (webhooks.chefito.xyz)
└── infrastructure/
    ├── netlify/             # Configurations Netlify
    ├── vps/                 # Scripts VPS
    └── monitoring/          # Monitoring et logs
```

## 🎯 **Avantages de cette Architecture**

### **🚀 Performance**
- **CDN séparé** → Chargement ultra-rapide des assets
- **API dédiée** → Pas de conflit avec le site principal
- **Cache optimisé** → Chaque service a sa stratégie de cache

### **🔒 Sécurité**
- **Isolation des services** → Une faille n'affecte pas tout
- **Permissions granulaires** → Chaque domaine a ses droits
- **CORS contrôlé** → Sécurité renforcée

### **📈 Scalabilité**
- **Déploiements indépendants** → Mise à jour sans downtime
- **Équipes séparées** → Développement parallèle
- **Monitoring ciblé** → Métriques par service

## 🛠️ **Configuration Technique**

### **Variables d'Environnement par Sous-domaine**

#### **Site Principal (`chefito.xyz`)**
```env
NEXT_PUBLIC_APP_URL=https://app.chefito.xyz
NEXT_PUBLIC_API_URL=https://api.chefito.xyz
NEXT_PUBLIC_CDN_URL=https://cdn.chefito.xyz
NEXT_PUBLIC_VOICE_URL=https://voice.chefito.xyz
```

#### **Application Web (`app.chefito.xyz`)**
```env
NEXT_PUBLIC_API_URL=https://api.chefito.xyz
NEXT_PUBLIC_AI_URL=https://ai.chefito.xyz
NEXT_PUBLIC_VOICE_URL=https://voice.chefito.xyz
NEXT_PUBLIC_MAIN_SITE=https://chefito.xyz
```

#### **API (`api.chefito.xyz`)**
```env
ALLOWED_ORIGINS=https://chefito.xyz,https://app.chefito.xyz,https://admin.chefito.xyz
DATABASE_URL=postgresql://...
OLLAMA_ENDPOINT=http://your-vps:11434
```

### **Configuration CORS Avancée**
```javascript
// api.chefito.xyz/cors.js
const allowedOrigins = [
  'https://chefito.xyz',
  'https://app.chefito.xyz',
  'https://admin.chefito.xyz',
  'https://docs.chefito.xyz'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};
```

## 🎨 **Améliorations UX Suggérées**

### **1. Navigation Inter-Domaines Fluide**
```javascript
// Composant de navigation globale
const GlobalNav = () => {
  const currentDomain = window.location.hostname;
  
  return (
    <nav className="global-nav">
      <a href="https://chefito.xyz" 
         className={currentDomain === 'chefito.xyz' ? 'active' : ''}>
        Accueil
      </a>
      <a href="https://app.chefito.xyz"
         className={currentDomain === 'app.chefito.xyz' ? 'active' : ''}>
        Application
      </a>
      <a href="https://docs.chefito.xyz"
         className={currentDomain === 'docs.chefito.xyz' ? 'active' : ''}>
        Documentation
      </a>
    </nav>
  );
};
```

### **2. SSO (Single Sign-On) Cross-Domain**
```javascript
// Service d'authentification partagée
class ChefitoCrossAuth {
  async signIn(credentials) {
    const token = await this.authenticate(credentials);
    
    // Synchroniser sur tous les domaines
    await Promise.all([
      this.setTokenOnDomain('app.chefito.xyz', token),
      this.setTokenOnDomain('admin.chefito.xyz', token),
      this.setTokenOnDomain('docs.chefito.xyz', token)
    ]);
  }
}
```

### **3. Notifications Cross-Domain**
```javascript
// Service de notifications globales
class GlobalNotifications {
  broadcast(message, type = 'info') {
    // Diffuser sur tous les onglets ouverts
    localStorage.setItem('chefito_notification', JSON.stringify({
      message, type, timestamp: Date.now()
    }));
  }
}
```

## 📊 **Monitoring et Analytics**

### **Dashboard Unifié**
```javascript
// Configuration analytics par domaine
const analyticsConfig = {
  'chefito.xyz': {
    events: ['page_view', 'recipe_view', 'signup_start'],
    goals: ['conversion', 'engagement']
  },
  'app.chefito.xyz': {
    events: ['recipe_cook', 'voice_used', 'ai_question'],
    goals: ['retention', 'feature_usage']
  },
  'api.chefito.xyz': {
    events: ['api_call', 'rate_limit', 'error'],
    goals: ['performance', 'reliability']
  }
};
```

## 🚀 **Plan de Migration**

### **Phase 1: Préparation (1 semaine)**
1. Configurer les DNS
2. Créer les sites Netlify
3. Tester les redirections

### **Phase 2: Migration Progressive (2 semaines)**
1. Migrer l'API vers `api.chefito.xyz`
2. Créer `app.chefito.xyz` pour l'application
3. Configurer `admin.chefito.xyz`

### **Phase 3: Optimisation (1 semaine)**
1. Configurer le CDN
2. Optimiser les performances
3. Tester la charge

## 💡 **Fonctionnalités Innovantes Suggérées**

### **1. API Publique pour Développeurs**
```javascript
// api.chefito.xyz/v1/recipes
GET /v1/recipes?difficulty=beginner&cuisine=italian
GET /v1/recipes/{id}/voice-guide
POST /v1/ai/cooking-assistant
```

### **2. Widget Intégrable**
```html
<!-- Pour blogs culinaires -->
<script src="https://cdn.chefito.xyz/widget.js"></script>
<div data-chefito-recipe="pasta-carbonara"></div>
```

### **3. Progressive Web App (PWA)**
```javascript
// app.chefito.xyz comme PWA
const pwaConfig = {
  name: 'Chefito - Assistant Culinaire',
  short_name: 'Chefito',
  start_url: 'https://app.chefito.xyz',
  display: 'standalone',
  theme_color: '#f97316'
};
```

## 📞 **Prochaines Étapes Recommandées**

### **Immédiat (Hackathon)**
1. Configurer `app.chefito.xyz` pour l'application principale
2. Rediriger `api.chefito.xyz` vers vos API routes
3. Créer `admin.chefito.xyz` pour l'interface admin

### **Court terme (Post-hackathon)**
1. Implémenter le CDN sur `cdn.chefito.xyz`
2. Créer `docs.chefito.xyz` avec la documentation API
3. Configurer le monitoring cross-domain

### **Long terme**
1. Développer l'API publique
2. Créer des widgets intégrables
3. Expansion internationale avec sous-domaines géographiques

---

**🎯 Cette architecture te donnera une base solide et professionnelle pour le hackathon et au-delà !**