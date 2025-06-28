#!/bin/bash

# =============================================================================
# CHEFITO - Vérification DNS pour Architecture Multi-domaines
# =============================================================================

set -e

# Couleurs pour une meilleure lisibilité
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Vérification DNS pour Chefito${NC}"
echo -e "${BLUE}===============================${NC}"

# Domaine principal
DOMAIN="chefito.xyz"

# Sous-domaines à vérifier
SUBDOMAINS=("app" "api" "admin" "docs" "cdn" "voice" "ai" "webhooks")

# Valeur Netlify attendue
NETLIFY_APP="chefito.netlify.app"

# Vérifier le domaine principal
echo -e "${YELLOW}🌐 Vérification du domaine principal: $DOMAIN${NC}"
MAIN_CNAME=$(dig +short $DOMAIN CNAME)
WWW_CNAME=$(dig +short www.$DOMAIN CNAME)

if [ -n "$MAIN_CNAME" ]; then
    echo -e "✅ $DOMAIN → ${GREEN}$MAIN_CNAME${NC}"
else
    echo -e "❌ $DOMAIN ${RED}n'a pas d'enregistrement CNAME${NC}"
fi

if [ -n "$WWW_CNAME" ]; then
    echo -e "✅ www.$DOMAIN → ${GREEN}$WWW_CNAME${NC}"
else
    echo -e "❌ www.$DOMAIN ${RED}n'a pas d'enregistrement CNAME${NC}"
fi

echo ""
echo -e "${YELLOW}🔍 Vérification des sous-domaines:${NC}"
echo ""

# Vérifier chaque sous-domaine
success_count=0
total_count=${#SUBDOMAINS[@]}

for subdomain in "${SUBDOMAINS[@]}"; do
    FULL_DOMAIN="$subdomain.$DOMAIN"
    CNAME=$(dig +short $FULL_DOMAIN CNAME)
    
    echo -n "🔄 $FULL_DOMAIN → "
    
    if [ -n "$CNAME" ]; then
        if [[ "$CNAME" == *"$NETLIFY_APP"* ]]; then
            echo -e "${GREEN}$CNAME (Correct)${NC}"
            ((success_count++))
        else
            echo -e "${YELLOW}$CNAME (Attention: Ne pointe pas vers $NETLIFY_APP)${NC}"
        fi
    else
        echo -e "${RED}Pas d'enregistrement CNAME${NC}"
    fi
done

echo ""
echo -e "${YELLOW}🔍 Vérification HTTPS:${NC}"
echo ""

# Vérifier HTTPS pour chaque domaine
https_success=0
https_total=0

check_https() {
    local domain=$1
    ((https_total++))
    local status_code=$(curl -s -o /dev/null -w "%{http_code}" -m 5 "https://$domain" || echo "timeout")
    
    echo -n "🔒 https://$domain → "
    
    if [ "$status_code" = "timeout" ]; then
        echo -e "${YELLOW}⚠️ Timeout (Le domaine n'est peut-être pas encore propagé)${NC}"
    elif [ "$status_code" -eq 200 ]; then
        echo -e "${GREEN}✅ OK (200)${NC}"
        ((https_success++))
    else
        echo -e "${RED}⚠️ Code $status_code${NC}"
    fi
}

check_https "$DOMAIN"
check_https "www.$DOMAIN"

for subdomain in "${SUBDOMAINS[@]}"; do
    check_https "$subdomain.$DOMAIN"
done

echo ""
echo -e "${BLUE}📋 Résumé de la vérification DNS:${NC}"
echo ""
echo -e "✅ Sous-domaines correctement configurés: ${GREEN}$success_count${NC}/$total_count"
echo -e "✅ Domaines HTTPS fonctionnels: ${GREEN}$https_success${NC}/$https_total"

# Calcul du pourcentage de réussite
dns_percent=$((success_count * 100 / total_count))
https_percent=$((https_success * 100 / https_total))

echo -e "📊 Taux de réussite DNS: ${GREEN}$dns_percent%${NC}"
echo -e "📊 Taux de réussite HTTPS: ${GREEN}$https_percent%${NC}"

echo ""
if [ $dns_percent -lt 100 ]; then
    echo -e "${YELLOW}🎯 Prochaines étapes pour DNS:${NC}"
    echo "1. Vérifiez les configurations DNS dans IONOS"
    echo "2. Attendez la propagation DNS (jusqu'à 24h)"
    echo "3. Relancez ce script pour vérifier à nouveau"
fi

if [ $https_percent -lt 100 ]; then
    echo -e "${YELLOW}🎯 Prochaines étapes pour HTTPS:${NC}"
    echo "1. Vérifiez que les domaines sont ajoutés dans Netlify"
    echo "2. Vérifiez que les certificats SSL sont émis"
    echo "3. Attendez que les certificats soient propagés"
fi

echo ""
echo -e "${BLUE}📞 Support: contact@chefito.xyz${NC}"