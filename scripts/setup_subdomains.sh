#!/bin/bash

# =============================================================================
# CHEFITO - Configuration Automatique des Sous-domaines Netlify
# =============================================================================

set -e

echo "🌐 Configuration des Sous-domaines Chefito"
echo "=========================================="

# Vérifier Netlify CLI
if ! command -v netlify &> /dev/null; then
    echo "📦 Installation de Netlify CLI..."
    npm install -g netlify-cli
fi

# Connexion
echo "🔐 Connexion à Netlify..."
netlify login

# Configuration des sous-domaines
declare -A SUBDOMAINS=(
    ["app"]="Application Web Principale"
    ["api"]="API Publique et Services"
    ["admin"]="Interface d'Administration"
    ["docs"]="Documentation et Guides"
    ["cdn"]="Assets Statiques et CDN"
    ["voice"]="Service de Synthèse Vocale"
    ["ai"]="Assistant IA Culinaire"
)

echo ""
echo "🎯 Sous-domaines à configurer:"
for subdomain in "${!SUBDOMAINS[@]}"; do
    echo "   📍 $subdomain.chefito.xyz - ${SUBDOMAINS[$subdomain]}"
done

echo ""
read -p "🚀 Voulez-vous continuer avec la configuration ? (y/N): " confirm
if [[ ! $confirm =~ ^[Yy]$ ]]; then
    echo "❌ Configuration annulée"
    exit 0
fi

# Fonction pour créer un site Netlify
create_netlify_site() {
    local subdomain=$1
    local description=$2
    local site_name="$subdomain-chefito"
    
    echo ""
    echo "🔧 Configuration de $subdomain.chefito.xyz..."
    
    # Créer le site
    if netlify sites:create --name "$site_name" --account-slug "$(netlify api listAccountsForUser | jq -r '.[0].slug')" >/dev/null 2>&1; then
        echo "✅ Site $site_name créé"
    else
        echo "⚠️ Site $site_name existe déjà ou erreur de création"
    fi
    
    # Configurer le domaine personnalisé
    if netlify api updateSite --site-id "$site_name" --body "{\"custom_domain\": \"$subdomain.chefito.xyz\"}" >/dev/null 2>&1; then
        echo "✅ Domaine $subdomain.chefito.xyz configuré"
    else
        echo "⚠️ Erreur de configuration du domaine"
    fi
    
    # Variables d'environnement spécifiques
    case $subdomain in
        "app")
            netlify env:set NEXT_PUBLIC_API_URL "https://api.chefito.xyz" --site "$site_name"
            netlify env:set NEXT_PUBLIC_AI_URL "https://ai.chefito.xyz" --site "$site_name"
            netlify env:set NEXT_PUBLIC_VOICE_URL "https://voice.chefito.xyz" --site "$site_name"
            netlify env:set NEXT_PUBLIC_MAIN_SITE "https://chefito.xyz" --site "$site_name"
            ;;
        "api")
            netlify env:set ALLOWED_ORIGINS "https://chefito.xyz,https://app.chefito.xyz,https://admin.chefito.xyz" --site "$site_name"
            netlify env:set API_MODE "true" --site "$site_name"
            ;;
        "admin")
            netlify env:set NEXT_PUBLIC_API_URL "https://api.chefito.xyz" --site "$site_name"
            netlify env:set ADMIN_MODE "true" --site "$site_name"
            ;;
        "cdn")
            netlify env:set CDN_MODE "true" --site "$site_name"
            netlify env:set CACHE_MAX_AGE "31536000" --site "$site_name"
            ;;
    esac
    
    echo "✅ $subdomain.chefito.xyz configuré avec succès"
}

# Créer les sites pour chaque sous-domaine
for subdomain in "${!SUBDOMAINS[@]}"; do
    create_netlify_site "$subdomain" "${SUBDOMAINS[$subdomain]}"
done

echo ""
echo "📋 === CONFIGURATION DNS REQUISE ==="
echo ""
echo "Ajoutez ces enregistrements CNAME dans votre registrar de domaine:"
echo ""
for subdomain in "${!SUBDOMAINS[@]}"; do
    echo "$subdomain.chefito.xyz    CNAME    $subdomain-chefito.netlify.app"
done

echo ""
echo "📊 === RÉSUMÉ DE LA CONFIGURATION ==="
echo ""
echo "Sites Netlify créés:"
netlify sites:list | grep chefito

echo ""
echo "🎯 === PROCHAINES ÉTAPES ==="
echo ""
echo "1. 📍 Configurez les DNS CNAME ci-dessus"
echo "2. 🔄 Déployez le code sur chaque site:"
echo "   - Site principal: git push origin main"
echo "   - App: git push origin app (créez la branche)"
echo "   - API: git push origin api (créez la branche)"
echo ""
echo "3. 🧪 Testez chaque sous-domaine:"
for subdomain in "${!SUBDOMAINS[@]}"; do
    echo "   - https://$subdomain.chefito.xyz"
done

echo ""
echo "4. 🔒 Vérifiez les certificats SSL (automatique)"
echo "5. 📊 Configurez le monitoring"

echo ""
echo "🎉 Configuration des sous-domaines terminée !"
echo ""
echo "💡 Conseils:"
echo "   - Utilisez des branches Git séparées pour chaque sous-domaine"
echo "   - Configurez des webhooks pour le déploiement automatique"
echo "   - Surveillez les performances de chaque service"
echo ""
echo "📞 Support: contact@chefito.xyz"