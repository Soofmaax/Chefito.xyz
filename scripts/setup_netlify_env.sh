#!/bin/bash

# =============================================================================
# CHEFITO - Configuration Automatique des Variables Netlify
# =============================================================================

set -e

echo "🚀 Configuration des Variables d'Environnement Netlify pour Chefito"
echo "=================================================================="

# Vérifier si Netlify CLI est installé
if ! command -v netlify &> /dev/null; then
    echo "📦 Installation de Netlify CLI..."
    npm install -g netlify-cli
fi

# Se connecter à Netlify (si pas déjà fait)
echo "🔐 Connexion à Netlify..."
netlify login

# Lister les sites pour vérification
echo "📋 Sites Netlify disponibles:"
netlify sites:list

# Demander l'ID du site ou le nom
read -p "🎯 Entrez le nom de votre site Netlify (ex: chefito-xyz): " SITE_NAME

# Fonction pour ajouter une variable d'environnement
add_env_var() {
    local key=$1
    local description=$2
    local is_secret=${3:-false}
    
    echo ""
    echo "🔧 Configuration de $key"
    echo "📝 $description"
    
    if [ "$is_secret" = true ]; then
        read -s -p "🔒 Entrez la valeur pour $key (masquée): " value
        echo ""
    else
        read -p "📝 Entrez la valeur pour $key: " value
    fi
    
    if [ ! -z "$value" ]; then
        netlify env:set $key "$value" --site $SITE_NAME
        echo "✅ $key configuré"
    else
        echo "⚠️ $key ignoré (valeur vide)"
    fi
}

echo ""
echo "🔐 === CONFIGURATION SUPABASE (Authentification) ==="
add_env_var "NEXT_PUBLIC_SUPABASE_URL" "URL de votre projet Supabase (ex: https://xxx.supabase.co)"
add_env_var "NEXT_PUBLIC_SUPABASE_ANON_KEY" "Clé publique Supabase" true
add_env_var "SUPABASE_SERVICE_ROLE_KEY" "Clé de service Supabase (TRÈS SENSIBLE)" true

echo ""
echo "🗄️ === CONFIGURATION POSTGRESQL VPS (Recettes) ==="
read -p "📍 Entrez l'IP de votre VPS IONOS: " VPS_IP
read -p "🔑 Entrez le mot de passe PostgreSQL: " -s POSTGRES_PASSWORD
echo ""

netlify env:set "DATABASE_URL" "postgresql://chefito_user:$POSTGRES_PASSWORD@$VPS_IP:5432/chefito_db" --site $SITE_NAME
netlify env:set "POSTGRES_HOST" "$VPS_IP" --site $SITE_NAME
netlify env:set "POSTGRES_PORT" "5432" --site $SITE_NAME
netlify env:set "POSTGRES_DB" "chefito_db" --site $SITE_NAME
netlify env:set "POSTGRES_USER" "chefito_user" --site $SITE_NAME
netlify env:set "POSTGRES_PASSWORD" "$POSTGRES_PASSWORD" --site $SITE_NAME

echo "✅ Configuration PostgreSQL terminée"

echo ""
echo "🤖 === CONFIGURATION OLLAMA (IA Assistant) ==="
netlify env:set "OLLAMA_ENDPOINT" "http://$VPS_IP:11434/api/generate" --site $SITE_NAME
netlify env:set "OLLAMA_MODEL" "llama3:8b-instruct-q4_K_M" --site $SITE_NAME
echo "✅ Configuration Ollama terminée"

echo ""
echo "🎤 === CONFIGURATION ELEVENLABS (Voice AI) ==="
add_env_var "ELEVENLABS_API_KEY" "Clé API ElevenLabs pour la synthèse vocale" true

echo ""
echo "💳 === CONFIGURATION REVENUECAT (Abonnements) ==="
add_env_var "NEXT_PUBLIC_REVENUECAT_API_KEY" "Clé publique RevenueCat"

echo ""
echo "⚙️ === CONFIGURATION GÉNÉRALE ==="
netlify env:set "NODE_ENV" "production" --site $SITE_NAME
add_env_var "NEXTAUTH_SECRET" "Secret NextAuth (générez une chaîne aléatoire)" true
netlify env:set "NEXTAUTH_URL" "https://chefito.xyz" --site $SITE_NAME
netlify env:set "CONTACT_EMAIL" "contact@chefito.xyz" --site $SITE_NAME
netlify env:set "TELEGRAM_BOT" "chefito_bot" --site $SITE_NAME

echo ""
echo "🎉 === CONFIGURATION TERMINÉE ==="
echo ""
echo "📋 Résumé des variables configurées:"
netlify env:list --site $SITE_NAME

echo ""
echo "🚀 Prochaines étapes:"
echo "   1. Vérifiez les variables dans le dashboard Netlify"
echo "   2. Déclenchez un nouveau déploiement"
echo "   3. Testez votre site sur https://chefito.xyz"
echo ""
echo "🔧 Pour déclencher un redéploiement:"
echo "   netlify deploy --prod --site $SITE_NAME"
echo ""
echo "📊 Pour voir les logs de build:"
echo "   netlify logs --site $SITE_NAME"