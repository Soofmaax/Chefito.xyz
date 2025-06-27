#!/bin/bash

# =============================================================================
# CHEFITO - Configuration Sécurisée du VPS IONOS
# =============================================================================

set -e

IONOS_IP="your_vps_ip_here"
ROOT_USER="root"
NEW_USER="chefito-user"
PROJECT_PATH="/home/$NEW_USER/chefito"

echo "🔒 Configuration sécurisée du VPS IONOS pour Chefito"
echo "=================================================="
echo "🖥️ VPS: $IONOS_IP"
echo "👤 Nouvel utilisateur: $NEW_USER"
echo ""

# --- 1. Création de l'utilisateur non-root ---
echo "--- Étape 1: Création de l'utilisateur sécurisé ---"

ssh $ROOT_USER@$IONOS_IP << EOF
# Créer l'utilisateur
adduser --disabled-password --gecos "" $NEW_USER

# Ajouter aux groupes nécessaires
usermod -aG sudo $NEW_USER
usermod -aG docker $NEW_USER

# Créer le répertoire du projet
mkdir -p $PROJECT_PATH
chown -R $NEW_USER:$NEW_USER $PROJECT_PATH

# Créer les répertoires nécessaires
mkdir -p $PROJECT_PATH/{data,logs,config,scripts}
chown -R $NEW_USER:$NEW_USER $PROJECT_PATH

echo "✅ Utilisateur $NEW_USER créé avec succès"
EOF

# --- 2. Configuration SSH ---
echo "--- Étape 2: Configuration SSH ---"

# Copier la clé publique de Cloud Shell
if [ -f ~/.ssh/id_rsa.pub ]; then
    echo "📋 Copie de la clé SSH..."
    ssh-copy-id -i ~/.ssh/id_rsa.pub $NEW_USER@$IONOS_IP
else
    echo "🔑 Génération d'une nouvelle clé SSH..."
    ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa -N ""
    ssh-copy-id -i ~/.ssh/id_rsa.pub $NEW_USER@$IONOS_IP
fi

# --- 3. Configuration du pare-feu ---
echo "--- Étape 3: Configuration du pare-feu ---"

ssh $NEW_USER@$IONOS_IP << 'EOF'
# Installer ufw si nécessaire
sudo apt update
sudo apt install -y ufw

# Configuration de base
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Autoriser SSH
sudo ufw allow ssh
sudo ufw allow 22

# Autoriser PostgreSQL (port 5432) - uniquement depuis des IPs spécifiques
sudo ufw allow from any to any port 5432

# Autoriser Ollama (port 11434) - uniquement depuis localhost et Cloud Shell
sudo ufw allow 11434

# Autoriser HTTP/HTTPS pour l'API
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000

# Activer le pare-feu
sudo ufw --force enable

echo "✅ Pare-feu configuré"
sudo ufw status
EOF

# --- 4. Installation des dépendances ---
echo "--- Étape 4: Installation des dépendances ---"

ssh $NEW_USER@$IONOS_IP << 'EOF'
# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Installation des outils de base
sudo apt install -y curl wget git htop nano vim unzip

# Installation de Node.js (pour l'API Chefito)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Installation de Python et pip
sudo apt install -y python3 python3-pip python3-venv

# Installation de Docker (pour Ollama)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Installation de PostgreSQL
sudo apt install -y postgresql postgresql-contrib

echo "✅ Dépendances installées"
EOF

# --- 5. Configuration PostgreSQL ---
echo "--- Étape 5: Configuration PostgreSQL ---"

ssh $NEW_USER@$IONOS_IP << 'EOF'
# Configuration PostgreSQL
sudo -u postgres psql << PSQL_EOF
CREATE DATABASE chefito_db;
CREATE USER chefito_user WITH ENCRYPTED PASSWORD 'your_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE chefito_db TO chefito_user;
ALTER USER chefito_user CREATEDB;
\q
PSQL_EOF

# Configuration des connexions externes
sudo sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" /etc/postgresql/*/main/postgresql.conf

# Autoriser les connexions depuis Cloud Shell
echo "host    chefito_db    chefito_user    0.0.0.0/0    md5" | sudo tee -a /etc/postgresql/*/main/pg_hba.conf

# Redémarrer PostgreSQL
sudo systemctl restart postgresql
sudo systemctl enable postgresql

echo "✅ PostgreSQL configuré"
EOF

# --- 6. Installation et configuration d'Ollama ---
echo "--- Étape 6: Installation d'Ollama ---"

ssh $NEW_USER@$IONOS_IP << 'EOF'
# Installation d'Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Démarrer Ollama en tant que service
sudo systemctl enable ollama
sudo systemctl start ollama

# Attendre que le service soit prêt
sleep 10

# Télécharger le modèle Llama3
ollama pull llama3:8b-instruct-q4_K_M

echo "✅ Ollama installé et modèle téléchargé"
EOF

# --- 7. Configuration des services systemd ---
echo "--- Étape 7: Configuration des services ---"

ssh $NEW_USER@$IONOS_IP << 'EOF'
# Service pour l'API Chefito
sudo tee /etc/systemd/system/chefito-api.service > /dev/null << SERVICE_EOF
[Unit]
Description=Chefito API Service
After=network.target postgresql.service ollama.service

[Service]
Type=simple
User=chefito-user
WorkingDirectory=/home/chefito-user/chefito
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
SERVICE_EOF

# Activer le service (sera démarré après déploiement du code)
sudo systemctl enable chefito-api

echo "✅ Services configurés"
EOF

# --- 8. Test de connectivité ---
echo "--- Étape 8: Tests de connectivité ---"

echo "🧪 Test de connexion SSH..."
if ssh -o ConnectTimeout=10 $NEW_USER@$IONOS_IP "echo 'SSH OK'"; then
    echo "✅ SSH fonctionne"
else
    echo "❌ Problème SSH"
    exit 1
fi

echo "🧪 Test PostgreSQL..."
if ssh $NEW_USER@$IONOS_IP "pg_isready -h localhost -p 5432"; then
    echo "✅ PostgreSQL fonctionne"
else
    echo "❌ Problème PostgreSQL"
fi

echo "🧪 Test Ollama..."
if ssh $NEW_USER@$IONOS_IP "curl -s http://localhost:11434/api/tags" >/dev/null; then
    echo "✅ Ollama fonctionne"
else
    echo "❌ Problème Ollama"
fi

echo ""
echo "🎉 Configuration sécurisée terminée!"
echo ""
echo "📋 Résumé de la configuration:"
echo "   👤 Utilisateur: $NEW_USER"
echo "   🔒 SSH configuré avec clés"
echo "   🛡️ Pare-feu activé"
echo "   🗄️ PostgreSQL prêt"
echo "   🤖 Ollama avec Llama3 installé"
echo "   ⚙️ Services systemd configurés"
echo ""
echo "🔗 Prochaines étapes:"
echo "   1. Mettre à jour IONOS_USER='$NEW_USER' dans run_recipe_pipeline.sh"
echo "   2. Tester la connexion: ssh $NEW_USER@$IONOS_IP"
echo "   3. Exécuter le pipeline de recettes"
echo ""
echo "⚠️ N'oubliez pas de:"
echo "   - Changer le mot de passe PostgreSQL par défaut"
echo "   - Configurer les sauvegardes automatiques"
echo "   - Surveiller les logs: journalctl -u chefito-api -f"