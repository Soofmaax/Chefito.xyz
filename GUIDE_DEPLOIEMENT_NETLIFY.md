# 🚀 Guide Complet de Déploiement Netlify pour Chefito

## 📋 **Étape 1: Configuration des Variables d'Environnement**

Dans votre dashboard Netlify, allez dans **"Environment variables"** et ajoutez ces variables :

### **🔐 Variables Supabase (Authentification)**
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### **🗄️ Variables PostgreSQL VPS (Recettes)**
```
DATABASE_URL=postgresql://chefito_user:your_password@your-vps-ip:5432/chefito_db
POSTGRES_HOST=your-vps-ip
POSTGRES_PORT=5432
POSTGRES_DB=chefito_db
POSTGRES_USER=chefito_user
POSTGRES_PASSWORD=your_password
```

### **🤖 Variables Ollama (IA Assistant)**
```
OLLAMA_ENDPOINT=http://your-vps-ip:11434/api/generate
OLLAMA_MODEL=llama3:8b-instruct-q4_K_M
```

### **🎤 Variables ElevenLabs (Voice AI)**
```
ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

### **💳 Variables RevenueCat (Abonnements)**
```
NEXT_PUBLIC_REVENUECAT_API_KEY=your_revenuecat_public_api_key
```

### **⚙️ Variables Générales**
```
NODE_ENV=production
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://chefito.xyz
CONTACT_EMAIL=contact@chefito.xyz
TELEGRAM_BOT=chefito_bot
```

## 📋 **Étape 2: Configuration Build Settings**

Vérifiez que vos paramètres de build sont corrects :

- **Build command:** `npm run build`
- **Publish directory:** `.next`
- **Functions directory:** `netlify/functions`
- **Node.js version:** `18.x`

## 📋 **Étape 3: Configuration du Domaine**

1. Dans **"Domain management"**, ajoutez votre domaine `chefito.xyz`
2. Configurez les DNS selon les instructions Netlify
3. Activez HTTPS automatiquement

## 📋 **Étape 4: Test de Déploiement**

1. Faites un commit sur votre branche `main`
2. Netlify déclenchera automatiquement un build
3. Surveillez les logs de build dans l'onglet **"Deploys"**

## 🔧 **Étape 5: Vérifications Post-Déploiement**

### **Test des Fonctionnalités:**
- ✅ Page d'accueil se charge
- ✅ Authentification Supabase fonctionne
- ✅ Recettes se chargent depuis votre VPS
- ✅ Assistant IA répond (Ollama)
- ✅ Guidage vocal fonctionne

### **Test des API Routes:**
- `https://chefito.xyz/api/recipes` → Liste des recettes
- `https://chefito.xyz/api/chef-ia` → Assistant IA
- `https://chefito.xyz/api/tts` → Text-to-Speech

## 🚨 **Dépannage Courant**

### **Erreur de Build:**
```bash
# Si erreur TypeScript
npm run type-check

# Si erreur de dépendances
npm install
```

### **Variables d'environnement non reconnues:**
- Vérifiez l'orthographe exacte
- Redéployez après modification des variables
- Les variables `NEXT_PUBLIC_*` sont visibles côté client

### **Erreur de connexion VPS:**
- Vérifiez que votre VPS est accessible depuis Internet
- Testez : `curl http://your-vps-ip:5432` (PostgreSQL)
- Testez : `curl http://your-vps-ip:11434/api/tags` (Ollama)

## 📊 **Monitoring et Logs**

### **Logs Netlify:**
- **Build logs:** Onglet "Deploys" → Cliquez sur un déploiement
- **Function logs:** Onglet "Functions" → Voir les logs en temps réel

### **Logs VPS:**
```bash
# Connexion à votre VPS
ssh chefito-user@your-vps-ip

# Logs PostgreSQL
sudo tail -f /var/log/postgresql/postgresql-*.log

# Logs Ollama
sudo journalctl -u ollama -f

# Statut des services
sudo systemctl status postgresql
sudo systemctl status ollama
```

## 🔄 **Workflow de Mise à Jour**

### **Pour mettre à jour le code:**
1. Modifiez votre code localement
2. Commit et push vers GitHub
3. Netlify redéploie automatiquement

### **Pour ajouter des recettes:**
1. Utilisez votre pipeline de recettes
2. Les nouvelles recettes apparaîtront automatiquement

### **Pour mettre à jour les variables:**
1. Modifiez dans Netlify Dashboard
2. Redéployez manuellement si nécessaire

## 🎯 **Optimisations Recommandées**

### **Performance:**
- Activez la compression Brotli (automatique sur Netlify)
- Utilisez les headers de cache (déjà configurés)
- Optimisez les images (configuré avec next/image)

### **Sécurité:**
- Headers de sécurité (déjà configurés)
- HTTPS forcé (automatique)
- Variables sensibles sécurisées

### **SEO:**
- Sitemap automatique
- Meta tags optimisés
- Structured data

## 📞 **Support**

Si vous rencontrez des problèmes :

1. **Logs de build Netlify** → Onglet "Deploys"
2. **Logs des fonctions** → Onglet "Functions"
3. **Test des API** → Utilisez Postman ou curl
4. **Vérification VPS** → SSH et vérifiez les services

---

**🎉 Une fois configuré, votre site sera accessible sur `https://chefito.xyz` avec toutes les fonctionnalités !**