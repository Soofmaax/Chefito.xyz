# 🍳 Chefito - Smart Cooking Assistant Platform

> **Built for World's Largest Hackathon by Bolt** 🏆  
> Created by **Salwa Essafi (@Soofmaax)**

A production-ready cooking assistant platform that makes cooking accessible and enjoyable for beginners through interactive recipes, AI-powered voice guidance, and intelligent cooking assistance.

## 🚀 **New Features - AI Cooking Assistant**

### **🤖 Interactive AI Assistant**
- **Real-time cooking help** via voice or text questions
- **Context-aware responses** based on current recipe and step
- **Voice input and output** for hands-free operation
- **Powered by Ollama** running locally on your VPS

### **🎤 Voice Integration**
- **Speech Recognition** for voice questions using Web Speech API
- **Text-to-Speech** responses for hands-free cooking
- **Fallback text input** when voice isn't available
- **Smart voice controls** with mute/unmute options

### **💬 Chat Interface**
- **Clean chat bubbles** for user questions and AI responses
- **Loading states** and error handling
- **Message history** during cooking session
- **Context display** showing current recipe step

## 🏗️ **Architecture Overview**

### **Production Deployment Architecture**
- **Frontend (Next.js)** → Deployed on **Netlify** 🌐
- **Recipe Database** → Your **PostgreSQL VPS** 🗄️
- **User Authentication** → **Supabase** (backend service) 🔐
- **Voice AI** → **ElevenLabs API** 🎤
- **AI Assistant** → **Ollama (Llama3)** on VPS 🤖
- **Subscriptions** → **Ready for RevenueCat** 💳 (Demo mode)

### **Important Notes**
- ✅ **Netlify** hosts your Next.js frontend application
- ✅ **Supabase** provides authentication services (not hosting)
- ✅ **Your VPS** stores all recipe data in PostgreSQL + runs Ollama
- ✅ **ElevenLabs** provides voice synthesis
- ✅ **Ollama** provides AI cooking assistance
- 🔧 **RevenueCat** ready for integration (currently in demo mode)

## 🚀 **Deployment Guide**

### **1. VPS Security Setup (CRITICAL FIRST STEP)**

Run the security setup script to create a non-root user and secure your VPS:

```bash
# Make the script executable
chmod +x scripts/setup_vps_security.sh

# Update the VPS IP in the script
nano scripts/setup_vps_security.sh
# Change: IONOS_IP="your_vps_ip_here"

# Run the security setup
./scripts/setup_vps_security.sh
```

This script will:
- ✅ Create a secure non-root user (`chefito-user`)
- ✅ Configure SSH keys
- ✅ Set up firewall rules
- ✅ Install PostgreSQL, Ollama, and dependencies
- ✅ Configure services

### **2. Automated Recipe Pipeline**

Use the enhanced pipeline script to manage 30+ recipes automatically:

```bash
# Make the script executable
chmod +x scripts/run_recipe_pipeline.sh

# Update configuration variables
nano scripts/run_recipe_pipeline.sh
# Update: PROJECT_ID, BUCKET_NAME, SPOONACULAR_API_KEY, IONOS_IP, etc.

# Run the automated pipeline
./scripts/run_recipe_pipeline.sh
```

**Pipeline Features:**
- 🔍 **Dynamic recipe search** via Spoonacular API
- 🤖 **Semi-automatic restructuring** (saves 4+ hours)
- 💡 **AI-suggested common instructions** (saves 1+ hour)
- 🎵 **Automated audio generation**
- 🚀 **Automatic VPS deployment**

### **3. Frontend Deployment (Netlify)**

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

# Ollama AI Assistant
OLLAMA_ENDPOINT=http://your-vps-ip:11434/api/generate
OLLAMA_MODEL=llama3:8b-instruct-q4_K_M

# RevenueCat (Optional - for subscriptions)
NEXT_PUBLIC_REVENUECAT_API_KEY=your_revenuecat_public_api_key
```

## 📡 **API Architecture**

### **New AI Assistant Endpoint**
- `POST /api/chef-ia` → AI cooking assistance with context

### **Existing Endpoints**
- `/api/recipes` → Recipe CRUD operations
- `/api/tts` → Text-to-speech conversion
- `/api/subscription/status` → Subscription management

### **Netlify Functions**
- `netlify/functions/recipes.js` → Recipe data access
- `netlify/functions/tts.js` → Voice synthesis
- `netlify/functions/chef-ia.js` → AI assistant integration

## 🤖 **AI Assistant Features**

### **Context-Aware Responses**
The AI assistant understands:
- Current recipe being cooked
- Specific step the user is on
- Recipe ingredients and tools
- Cooking techniques involved

### **Example Interactions**
```
User: "My rice is sticky, what should I do?"
AI: "For step 3 of your fried rice recipe, if the rice is sticky, 
     it likely has too much moisture. Try increasing the heat 
     slightly and stirring more frequently to evaporate excess 
     water. Make sure your pan is hot enough before adding 
     ingredients."
```

### **Voice Integration**
- 🎤 **Voice input**: Ask questions hands-free while cooking
- 🔊 **Voice output**: AI responses read aloud automatically
- 🔇 **Mute controls**: Toggle voice on/off as needed
- 📱 **Fallback text**: Works even without voice support

## 🔧 **Technical Improvements**

### **Automated Recipe Processing**
- **Time Reduction**: From ~15 hours to ~6 hours for 30+ recipes
- **Semi-automatic restructuring**: 70% automated, 30% manual review
- **Smart instruction detection**: AI suggests common cooking phrases
- **Bulk processing**: Handle hundreds of recipes efficiently

### **Enhanced Voice Features**
- **Web Speech API**: Browser-native voice recognition
- **Speech Synthesis**: Text-to-speech for AI responses
- **Error handling**: Graceful fallbacks when voice unavailable
- **Multi-language support**: French primary, extensible

### **Security Enhancements**
- **Non-root VPS user**: Secure deployment practices
- **Firewall configuration**: Restricted access to necessary ports
- **SSH key authentication**: No password-based access
- **Service isolation**: Each component runs with minimal privileges

## 📱 **Features**

### **Recipe Management (PostgreSQL VPS)**
- ✅ Browse recipes with advanced filters
- ✅ Detailed recipe view with ingredients and steps
- ✅ Recipe search and categorization
- ✅ Rating and review system

### **AI Cooking Assistant (NEW)**
- ✅ Context-aware cooking help via voice or text
- ✅ Real-time step-specific guidance
- ✅ Hands-free voice interaction
- ✅ Smart fallbacks and error handling

### **Voice-Guided Cooking (Enhanced)**
- ✅ Step-by-step voice instructions
- ✅ Integrated AI assistant access
- ✅ Progress tracking with visual feedback
- ✅ Hands-free cooking mode

### **User Features (Supabase)**
- ✅ User registration and login
- ✅ Profile management with cooking preferences
- ✅ Session management with JWT tokens

### **Subscription Management (Demo Mode)**
- 🔧 Free plan: 2 recipes with voice guidance
- 🔧 Premium plan: Unlimited access (ready for RevenueCat)
- 🔧 Subscription status tracking (demo)

## 💳 **Subscription Plans (Demo Mode)**

### **🆓 Plan Gratuit**
- 2 recettes avec guide vocal
- Instructions étape par étape
- Interface intuitive
- Support communautaire

### **👑 Plan Premium - 19,99€/mois (Demo)**
- Accès illimité à toutes les recettes
- Guidance vocale complète + Assistant IA
- Toutes les catégories de cuisine
- Mode mains libres avec IA
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

2. **Ollama non accessible**
   ```bash
   # Vérifier le service Ollama
   sudo systemctl status ollama
   
   # Tester l'API
   curl http://localhost:11434/api/tags
   ```

3. **Assistant IA ne répond pas**
   - Vérifier que Ollama fonctionne sur le VPS
   - Vérifier les variables d'environnement OLLAMA_*
   - Consulter les logs Netlify Functions

4. **Reconnaissance vocale ne fonctionne pas**
   - Vérifier les permissions microphone du navigateur
   - Tester sur Chrome/Edge (meilleur support)
   - Utiliser HTTPS (requis pour Web Speech API)

## 🎯 **Performance Optimizations**

### **Recipe Pipeline Efficiency**
- **Parallel processing**: Multiple recipes processed simultaneously
- **Caching**: Common instructions reused across recipes
- **Batch operations**: Bulk database operations
- **Smart filtering**: AI-suggested optimizations

### **AI Response Speed**
- **Local Ollama**: No external API latency
- **Context caching**: Recipe context cached per session
- **Streaming responses**: Real-time AI response delivery
- **Fallback responses**: Instant fallbacks when AI unavailable

## 👥 **About the Creator**

### **Salwa Essafi (@Soofmaax)**
- **Background:** Self-taught developer with commercial experience
- **Vision:** Making cooking enjoyable and accessible for everyone
- **Innovation:** Pioneering AI-assisted cooking education
- **Contact:** contact@chefito.xyz
- **GitHub:** [@soofmaax](https://github.com/soofmaax)
- **LinkedIn:** [Salwa Essafi](https://www.linkedin.com/in/salwaessafi)

## 📞 **Support & Contact**

- **Email:** contact@chefito.xyz
- **GitHub Issues:** [Report bugs or request features](https://github.com/soofmaax/chefito/issues)
- **LinkedIn:** [Salwa Essafi](https://www.linkedin.com/in/salwaessafi)

---

**🏆 Built with ❤️ for World's Largest Hackathon by Bolt**  
**🍳 Making cooking accessible with AI, one recipe at a time**

*Enhanced with AI Assistant by Salwa Essafi (@Soofmaax) - January 2025*