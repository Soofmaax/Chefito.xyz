#!/bin/bash

# =============================================================================
# CHEFITO - Vérification Post-Déploiement Netlify
# =============================================================================

set -e

SITE_URL="https://chefito.xyz"
VPS_IP="your_vps_ip_here"  # Remplacez par votre IP VPS

echo "🔍 Vérification Post-Déploiement Chefito"
echo "========================================"
echo "🌐 Site: $SITE_URL"
echo "🖥️ VPS: $VPS_IP"
echo ""

# Fonction de test HTTP
test_endpoint() {
    local url=$1
    local description=$2
    local expected_status=${3:-200}
    
    echo -n "🧪 Test: $description... "
    
    if response=$(curl -s -o /dev/null -w "%{http_code}" "$url" --max-time 10); then
        if [ "$response" -eq "$expected_status" ]; then
            echo "✅ OK ($response)"
            return 0
        else
            echo "❌ ERREUR ($response)"
            return 1
        fi
    else
        echo "❌ TIMEOUT/ERREUR"
        return 1
    fi
}

# Fonction de test JSON API
test_json_api() {
    local url=$1
    local description=$2
    
    echo -n "🧪 Test API: $description... "
    
    if response=$(curl -s "$url" --max-time 10); then
        if echo "$response" | jq . >/dev/null 2>&1; then
            echo "✅ OK (JSON valide)"
            return 0
        else
            echo "❌ ERREUR (JSON invalide)"
            echo "Response: $response"
            return 1
        fi
    else
        echo "❌ TIMEOUT/ERREUR"
        return 1
    fi
}

echo "🌐 === TESTS FRONTEND ==="
test_endpoint "$SITE_URL" "Page d'accueil"
test_endpoint "$SITE_URL/recipes" "Page des recettes"
test_endpoint "$SITE_URL/about" "Page À propos"
test_endpoint "$SITE_URL/pricing" "Page Pricing"

echo ""
echo "🔌 === TESTS API ROUTES ==="
test_json_api "$SITE_URL/api/recipes" "API Recettes"
test_endpoint "$SITE_URL/api/tts?text=test" "API Text-to-Speech"

echo ""
echo "🖥️ === TESTS VPS (Infrastructure) ==="
test_endpoint "http://$VPS_IP:5432" "PostgreSQL" 0  # PostgreSQL refuse les connexions HTTP
test_json_api "http://$VPS_IP:11434/api/tags" "Ollama API"

echo ""
echo "🔐 === TESTS SÉCURITÉ ==="
test_endpoint "$SITE_URL" "HTTPS Redirect" 200
echo -n "🧪 Test: Headers de sécurité... "
if headers=$(curl -s -I "$SITE_URL" | grep -i "x-frame-options\|x-content-type-options\|x-xss-protection"); then
    echo "✅ OK"
    echo "$headers" | sed 's/^/     /'
else
    echo "⚠️ Headers manquants"
fi

echo ""
echo "📊 === TESTS PERFORMANCE ==="
echo -n "🧪 Test: Temps de réponse page d'accueil... "
start_time=$(date +%s%N)
curl -s "$SITE_URL" > /dev/null
end_time=$(date +%s%N)
duration=$(( (end_time - start_time) / 1000000 ))
if [ $duration -lt 2000 ]; then
    echo "✅ OK (${duration}ms)"
else
    echo "⚠️ LENT (${duration}ms)"
fi

echo ""
echo "🎤 === TESTS FONCTIONNALITÉS AVANCÉES ==="

# Test de l'assistant IA (nécessite une recette existante)
echo -n "🧪 Test: Assistant IA... "
ai_payload='{"recipeId":"550e8400-e29b-41d4-a716-446655440001","stepNumber":1,"question":"Comment faire?"}'
if ai_response=$(curl -s -X POST "$SITE_URL/api/chef-ia" \
    -H "Content-Type: application/json" \
    -d "$ai_payload" --max-time 15); then
    if echo "$ai_response" | jq -r '.success' | grep -q "true"; then
        echo "✅ OK"
    else
        echo "❌ ERREUR"
        echo "Response: $ai_response"
    fi
else
    echo "❌ TIMEOUT/ERREUR"
fi

echo ""
echo "📋 === RÉSUMÉ DES TESTS ==="

# Compter les succès et échecs
total_tests=0
failed_tests=0

# Relancer les tests en mode silencieux pour compter
for test in \
    "$SITE_URL" \
    "$SITE_URL/recipes" \
    "$SITE_URL/about" \
    "$SITE_URL/api/recipes" \
    "http://$VPS_IP:11434/api/tags"
do
    total_tests=$((total_tests + 1))
    if ! curl -s -f "$test" >/dev/null 2>&1 --max-time 5; then
        failed_tests=$((failed_tests + 1))
    fi
done

success_tests=$((total_tests - failed_tests))
success_rate=$((success_tests * 100 / total_tests))

echo "📊 Tests réussis: $success_tests/$total_tests ($success_rate%)"

if [ $success_rate -ge 80 ]; then
    echo "🎉 DÉPLOIEMENT RÉUSSI ! Votre site fonctionne correctement."
    echo ""
    echo "🔗 Liens utiles:"
    echo "   🌐 Site web: $SITE_URL"
    echo "   📊 Dashboard Netlify: https://app.netlify.com"
    echo "   🗄️ Recettes: $SITE_URL/recipes"
    echo "   👤 Admin: $SITE_URL/admin"
    echo ""
    echo "📱 Prochaines étapes:"
    echo "   1. Testez l'inscription/connexion utilisateur"
    echo "   2. Vérifiez le guidage vocal sur une recette"
    echo "   3. Testez l'assistant IA"
    echo "   4. Configurez votre domaine personnalisé si nécessaire"
else
    echo "⚠️ PROBLÈMES DÉTECTÉS ! Vérifiez les erreurs ci-dessus."
    echo ""
    echo "🔧 Actions recommandées:"
    echo "   1. Vérifiez les variables d'environnement Netlify"
    echo "   2. Consultez les logs de build: netlify logs"
    echo "   3. Vérifiez la connectivité VPS"
    echo "   4. Testez les services VPS: ssh chefito-user@$VPS_IP"
fi

echo ""
echo "📞 Support:"
echo "   📧 Email: contact@chefito.xyz"
echo "   💬 Telegram: @chefito_bot"