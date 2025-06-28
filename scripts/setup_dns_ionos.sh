#!/bin/bash

# =============================================================================
# CHEFITO - Configuration DNS IONOS pour Architecture Multi-domaines
# =============================================================================

set -e

echo "🌐 Configuration DNS IONOS pour Chefito"
echo "======================================"

# Domaine principal
DOMAIN="chefito.xyz"

# Sous-domaines à configurer
SUBDOMAINS=("app" "api" "admin" "docs" "cdn" "voice" "ai" "webhooks")

# Valeur Netlify pour les CNAME
NETLIFY_APP="sensational-cat-e39995.netlify.app"

echo "📋 Sous-domaines à configurer:"
for subdomain in "${SUBDOMAINS[@]}"; do
    echo "   - $subdomain.$DOMAIN → $NETLIFY_APP"
done

echo ""
echo "🔧 Instructions pour configurer les DNS dans IONOS:"
echo ""
echo "1. Connectez-vous à votre compte IONOS"
echo "2. Accédez à la section 'Domaines & SSL' puis à '$DOMAIN'"
echo "3. Cliquez sur 'DNS'"
echo "4. Pour chaque sous-domaine, ajoutez un enregistrement CNAME:"
echo ""

for subdomain in "${SUBDOMAINS[@]}"; do
    echo "   Nom d'hôte: $subdomain"
    echo "   Type: CNAME"
    echo "   Valeur: $NETLIFY_APP"
    echo "   TTL: 3600 (1 heure)"
    echo ""
done

echo "5. Pour le domaine principal, vérifiez que vous avez:"
echo "   Type: A"
echo "   Valeur: 75.2.60.5 (IP Netlify)"
echo ""
echo "   Type: CNAME"
echo "   Nom d'hôte: www"
echo "   Valeur: $NETLIFY_APP"
echo ""

echo "🔍 Vérification des DNS:"
echo "Une fois les DNS configurés, attendez la propagation (peut prendre jusqu'à 24h)"
echo "Vérifiez avec la commande: dig +short SUBDOMAIN.$DOMAIN"
echo ""

echo "🎯 Après la propagation DNS, configurez les domaines dans Netlify:"
echo "1. Allez dans votre dashboard Netlify"
echo "2. Sélectionnez votre site"
echo "3. Allez dans 'Domain settings'"
echo "4. Cliquez sur 'Add domain alias'"
echo "5. Ajoutez chaque sous-domaine (app.chefito.xyz, api.chefito.xyz, etc.)"
echo ""

echo "✅ Configuration DNS terminée!"