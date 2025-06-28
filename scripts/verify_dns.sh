#!/bin/bash

# =============================================================================
# CHEFITO - Vérification DNS pour Architecture Multi-domaines
# =============================================================================

set -e

# Domaine principal
DOMAIN="chefito.xyz"

# Sous-domaines à vérifier
SUBDOMAINS=("app" "api" "admin" "docs" "cdn" "voice" "ai" "webhooks")

# Valeur Netlify attendue
NETLIFY_APP="sensational-cat-e39995.netlify.app"

echo "🔍 Vérification DNS pour Chefito"
echo "================================"

# Vérifier le domaine principal
echo "🌐 Vérification du domaine principal: $DOMAIN"
MAIN_IP=$(dig +short $DOMAIN A)
WWW_CNAME=$(dig +short www.$DOMAIN CNAME)

if [ -n "$MAIN_IP" ]; then
    echo "✅ $DOMAIN → $MAIN_IP"
else
    echo "❌ $DOMAIN n'a pas d'enregistrement A"
fi

if [ -n "$WWW_CNAME" ]; then
    echo "✅ www.$DOMAIN → $WWW_CNAME"
else
    echo "❌ www.$DOMAIN n'a pas d'enregistrement CNAME"
fi

echo ""
echo "🔍 Vérification des sous-domaines:"
echo ""

# Vérifier chaque sous-domaine
for subdomain in "${SUBDOMAINS[@]}"; do
    FULL_DOMAIN="$subdomain.$DOMAIN"
    CNAME=$(dig +short $FULL_DOMAIN CNAME)
    
    echo -n "🔄 $FULL_DOMAIN → "
    
    if [ -n "$CNAME" ]; then
        if [[ "$CNAME" == *"$NETLIFY_APP"* ]]; then
            echo "✅ $CNAME (Correct)"
        else
            echo "⚠️ $CNAME (Attention: Ne pointe pas vers $NETLIFY_APP)"
        fi
    else
        echo "❌ Pas d'enregistrement CNAME"
    fi
done

echo ""
echo "🔍 Vérification HTTPS:"
echo ""

# Vérifier HTTPS pour chaque domaine
check_https() {
    local domain=$1
    local status_code=$(curl -s -o /dev/null -w "%{http_code}" -m 5 "https://$domain" || echo "timeout")
    
    echo -n "🔒 https://$domain → "
    
    if [ "$status_code" = "timeout" ]; then
        echo "⚠️ Timeout (Le domaine n'est peut-être pas encore propagé)"
    elif [ "$status_code" -eq 200 ]; then
        echo "✅ OK (200)"
    else
        echo "⚠️ Code $status_code"
    fi
}

check_https "$DOMAIN"
check_https "www.$DOMAIN"

for subdomain in "${SUBDOMAINS[@]}"; do
    check_https "$subdomain.$DOMAIN"
done

echo ""
echo "📋 Résumé de la vérification DNS:"
echo ""
echo "✅ Domaines correctement configurés: $(dig +short $DOMAIN A | wc -l)"
echo "✅ Sous-domaines correctement configurés: $(for s in "${SUBDOMAINS[@]}"; do dig +short $s.$DOMAIN CNAME | grep -c "$NETLIFY_APP"; done | awk '{sum+=$1} END {print sum}')"
echo "⚠️ Sous-domaines mal configurés ou non propagés: $(for s in "${SUBDOMAINS[@]}"; do dig +short $s.$DOMAIN CNAME | grep -vc "$NETLIFY_APP"; done | awk '{sum+=$1} END {print sum}')"

echo ""
echo "🎯 Prochaines étapes:"
echo ""
echo "1. Si certains DNS ne sont pas encore propagés, attendez jusqu'à 24h"
echo "2. Configurez les domaines dans Netlify:"
echo "   - Allez dans votre dashboard Netlify"
echo "   - Sélectionnez votre site"
echo "   - Allez dans 'Domain settings'"
echo "   - Cliquez sur 'Add domain alias'"
echo "   - Ajoutez chaque sous-domaine"
echo ""
echo "3. Vérifiez les certificats SSL dans Netlify"
echo "4. Testez l'accès à chaque sous-domaine"
echo ""
echo "📞 Support: contact@chefito.xyz"