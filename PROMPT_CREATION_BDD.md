# 🗄️ PROMPT POUR CRÉER LA BASE DE DONNÉES CHEFITO AVEC VOS RECETTES

Copiez-collez ce prompt dans une nouvelle conversation avec Bolt.new pour créer automatiquement votre base de données complète avec vos recettes.

---

## 📋 PROMPT À UTILISER

```
Bonjour ! Je veux que tu me crées une base de données PostgreSQL complète pour mon projet Chefito (plateforme de recettes de cuisine) avec toutes mes recettes.

ARCHITECTURE DE LA BASE DE DONNÉES :
- Base de données : Neon PostgreSQL (serverless)
- Tables principales : recipes, ingredients, instructions, reviews
- Index optimisés pour les performances
- Contraintes de sécurité et d'intégrité
- Fonctions et triggers automatiques

STRUCTURE REQUISE :

1. TABLE RECIPES :
   - id (UUID, primary key)
   - title (VARCHAR 255, NOT NULL)
   - description (TEXT, NOT NULL)
   - image_url (TEXT, NOT NULL, HTTPS uniquement)
   - prep_time (INTEGER, minutes)
   - cook_time (INTEGER, minutes)
   - servings (INTEGER)
   - difficulty (ENUM: beginner, intermediate, advanced)
   - category (VARCHAR 50)
   - cuisine (VARCHAR 50)
   - tags (TEXT ARRAY)
   - rating (NUMERIC 3,2, default 0)
   - rating_count (INTEGER, default 0)
   - is_public (BOOLEAN, default true)
   - created_at, updated_at (TIMESTAMPTZ)

2. TABLE INGREDIENTS :
   - id (UUID, primary key)
   - recipe_id (UUID, foreign key)
   - name (VARCHAR 255)
   - amount (NUMERIC 10,2)
   - unit (VARCHAR 50)
   - optional (BOOLEAN, default false)
   - order_index (INTEGER)

3. TABLE INSTRUCTIONS :
   - id (UUID, primary key)
   - recipe_id (UUID, foreign key)
   - step_number (INTEGER)
   - description (TEXT)
   - duration (INTEGER, minutes)
   - title (VARCHAR 255, optional)

4. TABLE REVIEWS :
   - id (UUID, primary key)
   - recipe_id (UUID, foreign key)
   - user_id (VARCHAR 255)
   - rating (INTEGER 1-5)
   - comment (TEXT)
   - created_at, updated_at

INDEX REQUIS :
- Index composites sur (difficulty, category)
- Index GIN sur tags (pour recherche dans arrays)
- Index sur rating DESC
- Index sur created_at DESC
- Index sur tous les foreign keys

FONCTIONS AUTOMATIQUES :
- Fonction de mise à jour automatique du rating moyen
- Trigger pour updated_at automatique
- Fonction de calcul des statistiques

DONNÉES À INSÉRER :
Voici mes recettes à ajouter dans la base de données :

[ICI, COLLEZ VOS RECETTES DANS N'IMPORTE QUEL FORMAT]

EXEMPLE DE FORMAT ACCEPTÉ :
```
Recette 1: Pâtes à l'ail et huile d'olive
Description: Un classique italien simple et délicieux, parfait pour les débutants
Temps de préparation: 10 minutes
Temps de cuisson: 15 minutes
Portions: 4
Difficulté: beginner
Catégorie: main
Cuisine: italian
Tags: pasta, quick, vegetarian, italian
Image: https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg

Ingrédients:
- 400g de spaghetti
- 6 gousses d'ail, émincées
- 120ml d'huile d'olive extra vierge
- 1 cuillère à café de piment rouge (optionnel)
- 2 cuillères à soupe de persil frais, haché
- Sel et poivre noir
- 50g de parmesan râpé (optionnel)

Instructions:
1. Faire bouillir une grande casserole d'eau salée
2. Ajouter les pâtes et cuire selon les instructions du paquet
3. Pendant que les pâtes cuisent, chauffer l'huile d'olive dans une grande poêle
4. Ajouter l'ail émincé et cuire jusqu'à ce qu'il soit parfumé
5. Égoutter les pâtes en réservant 1 tasse d'eau de cuisson
6. Ajouter les pâtes dans la poêle avec l'ail
7. Mélanger avec l'eau de cuisson pour créer une sauce soyeuse
8. Assaisonner avec sel, poivre et piment rouge
9. Garnir de persil et servir

---

Recette 2: [Votre deuxième recette...]
```

INSTRUCTIONS POUR TOI :
1. Crée le script SQL complet de création de la base de données
2. Parse et structure automatiquement mes recettes
3. Génère les requêtes INSERT pour toutes mes recettes
4. Assure-toi que toutes les relations sont correctes
5. Ajoute des index optimisés pour les performances
6. Inclus des exemples de requêtes utiles
7. Fournis un script de vérification de l'intégrité

LIVRABLES ATTENDUS :
- Script SQL complet de création (create_database.sql)
- Script d'insertion des recettes (insert_recipes.sql)
- Script de vérification (verify_database.sql)
- Documentation des requêtes courantes
- Instructions de déploiement sur Neon

CONTRAINTES IMPORTANTES :
- Toutes les images doivent être des URLs HTTPS valides (Pexels de préférence)
- Validation des données (temps > 0, portions > 0, etc.)
- Gestion des caractères spéciaux dans les noms
- Support des accents français
- Prévention des injections SQL

Peux-tu créer tout cela pour moi ? Je vais te donner mes recettes juste après ce message.
```

---

## 🎯 COMMENT UTILISER CE PROMPT

### Étape 1 : Préparez vos recettes
Rassemblez toutes vos recettes dans n'importe quel format :
- Texte libre
- JSON
- Liste simple
- Format de blog
- Copié-collé depuis un site

### Étape 2 : Ouvrez une nouvelle conversation
- Allez sur bolt.new
- Commencez une nouvelle conversation
- Collez le prompt ci-dessus

### Étape 3 : Ajoutez vos recettes
Après avoir envoyé le prompt, ajoutez vos recettes dans le format qui vous convient le mieux.

### Étape 4 : Bolt créera automatiquement
- ✅ Scripts SQL complets
- ✅ Structure de base de données optimisée
- ✅ Insertion de toutes vos recettes
- ✅ Index de performance
- ✅ Documentation complète

## 📝 FORMATS DE RECETTES ACCEPTÉS

### Format Simple
```
Titre: Omelette aux herbes
Temps: 10 min préparation, 5 min cuisson
Portions: 2
Difficulté: beginner
Ingrédients: 4 œufs, herbes fraîches, beurre, sel, poivre
Étapes: 1. Battre les œufs... 2. Chauffer la poêle... 3. Cuire l'omelette...
```

### Format Détaillé
```
{
  "title": "Risotto aux champignons",
  "description": "Un risotto crémeux et savoureux",
  "prep_time": 15,
  "cook_time": 25,
  "servings": 4,
  "difficulty": "intermediate",
  "ingredients": ["300g riz arborio", "500ml bouillon", "200g champignons"],
  "steps": ["Faire revenir les champignons", "Ajouter le riz", "Incorporer le bouillon"]
}
```

### Format Libre
```
Ma recette de tarte aux pommes préférée :
Il faut 6 pommes, de la pâte brisée, du sucre et de la cannelle.
D'abord on épluche les pommes, puis on les dispose sur la pâte...
Cuisson 30 minutes à 180°C.
```

## 🚀 AVANTAGES DE CETTE APPROCHE

✅ **Automatisation complète** - Bolt parse et structure tout automatiquement
✅ **Validation des données** - Vérification automatique de la cohérence
✅ **Optimisation des performances** - Index et requêtes optimisés
✅ **Prêt pour la production** - Structure professionnelle
✅ **Extensible** - Facile d'ajouter de nouvelles recettes
✅ **Sécurisé** - Protection contre les injections SQL

## 📞 SUPPORT

Si vous avez des questions ou des problèmes :
- Décrivez le format de vos recettes
- Mentionnez le nombre de recettes
- Précisez vos besoins spécifiques

Bolt s'adaptera automatiquement à votre situation !