#!/bin/bash

# =============================================================================
# CHEFITO - Configuration DNS pour Architecture Multi-domaines
# =============================================================================

set -e

# Couleurs pour une meilleure lisibilité
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🌐 Configuration DNS pour Chefito Multi-domaines${NC}"
echo -e "${BLUE}=================================================${NC}"

# Domaine principal
DOMAIN="chefito.xyz"

# Sous-domaines à configurer
SUBDOMAINS=("app" "api" "admin" "docs" "cdn" "voice" "ai" "webhooks")

# Valeur Netlify pour les CNAME
NETLIFY_APP="chefito.netlify.app"

echo -e "${YELLOW}📋 Sous-domaines à configurer:${NC}"
for subdomain in "${SUBDOMAINS[@]}"; do
    echo -e "   - ${GREEN}$subdomain.$DOMAIN${NC} → ${BLUE}$NETLIFY_APP${NC}"
done

echo ""
echo -e "${YELLOW}🔧 Instructions pour configurer les DNS dans IONOS:${NC}"
echo ""
echo "1. Connectez-vous à votre compte IONOS"
echo "2. Accédez à la section 'Domaines & SSL' puis à '$DOMAIN'"
echo "3. Cliquez sur 'DNS'"
echo "4. Pour chaque sous-domaine, ajoutez un enregistrement CNAME:"
echo ""

# Générer les commandes pour chaque sous-domaine
for subdomain in "${SUBDOMAINS[@]}"; do
    echo -e "   ${GREEN}Nom d'hôte:${NC} $subdomain"
    echo -e "   ${GREEN}Type:${NC} CNAME"
    echo -e "   ${GREEN}Valeur:${NC} $NETLIFY_APP"
    echo -e "   ${GREEN}TTL:${NC} 3600 (1 heure)"
    echo ""
done

echo "5. Pour le domaine principal, vérifiez que vous avez:"
echo -e "   ${GREEN}Type:${NC} CNAME"
echo -e "   ${GREEN}Nom d'hôte:${NC} @"
echo -e "   ${GREEN}Valeur:${NC} $NETLIFY_APP"
echo ""
echo -e "   ${GREEN}Type:${NC} CNAME"
echo -e "   ${GREEN}Nom d'hôte:${NC} www"
echo -e "   ${GREEN}Valeur:${NC} $NETLIFY_APP"
echo ""

# Générer le fichier de configuration pour référence
CONFIG_FILE="chefito_dns_config.txt"
echo "# Configuration DNS Chefito" > $CONFIG_FILE
echo "# Date: $(date)" >> $CONFIG_FILE
echo "# Domaine: $DOMAIN" >> $CONFIG_FILE
echo "" >> $CONFIG_FILE
echo "# Domaine principal" >> $CONFIG_FILE
echo "@    CNAME    $NETLIFY_APP" >> $CONFIG_FILE
echo "www  CNAME    $NETLIFY_APP" >> $CONFIG_FILE
echo "" >> $CONFIG_FILE
echo "# Sous-domaines" >> $CONFIG_FILE
for subdomain in "${SUBDOMAINS[@]}"; do
    echo "$subdomain    CNAME    $NETLIFY_APP" >> $CONFIG_FILE
done

echo -e "${BLUE}📄 Fichier de configuration généré:${NC} $CONFIG_FILE"
echo ""

echo -e "${YELLOW}🔍 Après configuration:${NC}"
echo "1. Attendez la propagation DNS (peut prendre jusqu'à 24h)"
echo "2. Vérifiez avec la commande: dig +short SUBDOMAIN.$DOMAIN"
echo ""

echo -e "${YELLOW}🎯 Configuration Netlify:${NC}"
echo "1. Allez dans votre dashboard Netlify"
echo "2. Sélectionnez votre site"
echo "3. Allez dans 'Domain settings'"
echo "4. Cliquez sur 'Add domain alias'"
echo "5. Ajoutez chaque sous-domaine (app.chefito.xyz, api.chefito.xyz, etc.)"
echo ""

echo -e "${GREEN}✅ Script de configuration DNS terminé!${NC}"
echo -e "${BLUE}📞 Support: contact@chefito.xyz${NC}"