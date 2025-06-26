# 🍳 Chefito - Smart Cooking Assistant Platform

> **Built for World's Largest Hackathon by Bolt** 🏆  
> Created by **Salwa Essafi (@Soofmaax)**

A production-ready cooking assistant platform that makes cooking accessible and enjoyable for beginners through interactive recipes and AI-powered voice guidance.

## 🏗️ **Architecture Overview**

### **Production Deployment Architecture**
- **Frontend (Next.js)** → Deployed on **Netlify** 🌐
- **Recipe Database** → Your **PostgreSQL VPS** 🗄️
- **User Authentication** → **Supabase** (backend service) 🔐
- **Voice AI** → **ElevenLabs API** 🎤
- **Subscriptions** → **Ready for RevenueCat** 💳 (Demo mode)

### **Important Notes**
- ✅ **Netlify** hosts your Next.js frontend application
- ✅ **Supabase** provides authentication services (not hosting)
- ✅ **Your VPS** stores all recipe data in PostgreSQL
- ✅ **ElevenLabs** provides voice synthesis
- 🔧 **RevenueCat** ready for integration (currently in demo mode)

## 🚀 **Deployment Guide**

### **1. Frontend Deployment (Netlify)**

#### **Étape 1: Préparer le projet**
```bash
# Build your Next.js app
npm run build

# Vérifier que le dossier 'out' est créé
ls -la out/
```

#### **Étape 2: Connecter à Netlify**
1. **Connecter votre repo GitHub** à Netlify
2. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `out`
   - Node version: `18`

#### **Étape 3: Variables d'environnement (Dashboard Netlify)**
```env
# Supabase (Auth only)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# PostgreSQL VPS (Recipes)
DATABASE_URL=postgresql://user:pass@your-vps-ip:5432/chefito_db
POSTGRES_HOST=your-vps-ip
POSTGRES_PORT=5432
POSTGRES_DB=chefito_db
POSTGRES_USER=your_username
POSTGRES_PASSWORD=your_password

# ElevenLabs
ELEVENLABS_API_KEY=your_elevenlabs_api_key

# RevenueCat (Optional - for subscriptions)
NEXT_PUBLIC_REVENUECAT_API_KEY=your_revenuecat_public_api_key
```

### **2. Database Setup (Your VPS)**

#### **Étape 1: Préparer PostgreSQL sur votre VPS**
```bash
# Se connecter à votre VPS
ssh user@your-vps-ip

# Installer PostgreSQL (si pas déjà fait)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Créer la base de données
sudo -u postgres createdb chefito_db
sudo -u postgres createuser your_username
sudo -u postgres psql -c "ALTER USER your_username PASSWORD 'your_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE chefito_db TO your_username;"
```

#### **Étape 2: Configurer les tables**
```bash
# Depuis votre projet local
npm run db:migrate
npm run db:seed
```

### **3. Supabase Setup (Auth uniquement)**

#### **Étape 1: Créer un projet Supabase**
1. Aller sur [supabase.com](https://supabase.com)
2. Créer un nouveau projet
3. Récupérer les clés API

#### **Étape 2: Configurer l'authentification**
```sql
-- Dans Supabase SQL Editor
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  skill_level text DEFAULT 'beginner',
  dietary_restrictions text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);
```

### **4. RevenueCat Setup (Optionnel - Abonnements)**

> **Note:** RevenueCat est actuellement en mode démo. Pour l'activer en production :

#### **Étape 1: Créer un compte RevenueCat**
1. Aller sur [revenuecat.com](https://www.revenuecat.com)
2. Créer un nouveau projet
3. Configurer votre app

#### **Étape 2: Configurer les produits**
```
Product ID: premium_monthly
Price: 19.99€/mois
Entitlement: premium
```

#### **Étape 3: Récupérer la clé API**
- Dashboard RevenueCat → API Keys → Public API Key
- Ajouter `NEXT_PUBLIC_REVENUECAT_API_KEY` dans Netlify

#### **Étape 4: Installer la dépendance**
```bash
npm install @revenuecat/purchases-js
```

## 📡 **API Architecture**

### **Netlify Functions**
- `/api/recipes` → `netlify/functions/recipes.js`
- `/api/tts` → `netlify/functions/tts.js`
- `/webhooks/revenuecat` → `netlify/functions/revenuecat-webhook.js`

### **Flux de données**
1. **Frontend** (Netlify) → **Netlify Functions** → **PostgreSQL VPS**
2. **Frontend** (Netlify) → **Supabase Auth API**
3. **Frontend** (Netlify) → **ElevenLabs API** (via Netlify Functions)
4. **Frontend** (Netlify) → **RevenueCat API** (optionnel)

## 🚀 **Local Development**

### **Setup Steps**
```bash
# 1. Clone and install
git clone https://github.com/soofmaax/chefito.git
cd chefito
npm install

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local with your credentials

# 3. Setup database on your VPS
npm run db:migrate
npm run db:seed

# 4. Start development
npm run dev
```

## 🌐 **Production Checklist**

### **✅ Avant le déploiement**
- [ ] PostgreSQL configuré sur votre VPS
- [ ] Tables créées avec `npm run db:migrate`
- [ ] Données de test avec `npm run db:seed`
- [ ] Firewall VPS configuré (port 5432 ouvert)
- [ ] Projet Supabase créé et configuré
- [ ] Variables d'environnement ajoutées dans Netlify
- [ ] Build test réussi localement

### **✅ Après le déploiement**
- [ ] Site accessible sur Netlify
- [ ] API recipes fonctionne
- [ ] Authentification Supabase fonctionne
- [ ] Voice AI fonctionne (ou fallback browser)
- [ ] Responsive design testé

### **🔧 Optionnel (RevenueCat)**
- [ ] RevenueCat configuré avec produits
- [ ] Abonnements RevenueCat fonctionnent

## 📱 **Features**

### **Recipe Management (PostgreSQL VPS)**
- ✅ Browse recipes with advanced filters
- ✅ Detailed recipe view with ingredients and steps
- ✅ Recipe search and categorization
- ✅ Rating and review system

### **User Features (Supabase)**
- ✅ User registration and login
- ✅ Profile management with cooking preferences
- ✅ Session management with JWT tokens

### **Voice AI (ElevenLabs)**
- ✅ Text-to-speech for recipe instructions
- ✅ Customizable voice settings
- ✅ Browser fallback support

### **Subscription Management (Demo Mode)**
- 🔧 Free plan: 2 recipes with voice guidance
- 🔧 Premium plan: Unlimited access (ready for RevenueCat)
- 🔧 Subscription status tracking (demo)
- 🔧 Purchase simulation

## 💳 **Subscription Plans (Demo Mode)**

### **🆓 Plan Gratuit**
- 2 recettes avec guide vocal
- Instructions étape par étape
- Interface intuitive
- Support communautaire

### **👑 Plan Premium - 19,99€/mois (Demo)**
- Accès illimité à toutes les recettes
- Guidance vocale complète
- Toutes les catégories de cuisine
- Mode mains libres
- Support prioritaire
- Nouvelles recettes en avant-première

## 🔧 **Troubleshooting**

### **Erreurs communes**

1. **Connexion PostgreSQL refusée**
   ```bash
   # Vérifier que PostgreSQL écoute
   sudo netstat -plunt | grep postgres
   
   # Vérifier les logs
   sudo tail -f /var/log/postgresql/postgresql-*.log
   ```

2. **Build errors sur Netlify**
   - Vérifier la version Node.js (18)
   - Vérifier toutes les variables d'environnement
   - Consulter les logs de build Netlify

3. **RevenueCat en mode démo**
   - Normal si la clé API n'est pas configurée
   - Ajouter `NEXT_PUBLIC_REVENUECAT_API_KEY` pour activer

## 👥 **About the Creator**

### **Salwa Essafi (@Soofmaax)**
- **Background:** Self-taught developer with commercial experience
- **Vision:** Making cooking enjoyable and accessible for everyone
- **Contact:** contact@chefito.xyz
- **GitHub:** [@soofmaax](https://github.com/soofmaax)
- **LinkedIn:** [Salwa Essafi](https://www.linkedin.com/in/salwaessafi)

## 📞 **Support & Contact**

- **Email:** contact@chefito.xyz
- **GitHub Issues:** [Report bugs or request features](https://github.com/soofmaax/chefito/issues)
- **LinkedIn:** [Salwa Essafi](https://www.linkedin.com/in/salwaessafi)

---

**🏆 Built with ❤️ for World's Largest Hackathon by Bolt**  
**🍳 Making cooking accessible, one recipe at a time**

*Created by Salwa Essafi (@Soofmaax) - January 2025*