'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BoltBadge } from '@/components/layout/BoltBadge';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { ChefHat, Plus, Trash2, Clock, Users, Star, Camera, Mic } from 'lucide-react';
import { apiService } from '@/services/api';

export default function NewRecipePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    prep_time: 10,
    cook_time: 15,
    servings: 4,
    difficulty: 'beginner' as const,
    category: 'main',
    cuisine: 'international',
    tags: [''],
    ingredients: [''],
    steps: ['']
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: 'tags' | 'ingredients' | 'steps', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: 'tags' | 'ingredients' | 'steps') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'tags' | 'ingredients' | 'steps', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Nettoyer les données
      const cleanedData = {
        ...formData,
        tags: formData.tags.filter(tag => tag.trim() !== ''),
        ingredients: formData.ingredients.filter(ing => ing.trim() !== ''),
        steps: formData.steps.filter(step => step.trim() !== '')
      };

      // Validation basique
      if (!cleanedData.title || !cleanedData.description || !cleanedData.image_url) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      if (cleanedData.ingredients.length === 0) {
        throw new Error('Ajoutez au moins un ingrédient');
      }

      if (cleanedData.steps.length === 0) {
        throw new Error('Ajoutez au moins une étape');
      }

      await apiService.createRecipe(cleanedData);
      
      showToast({
        type: 'success',
        title: '🎉 Recette créée !',
        message: 'La recette a été ajoutée avec succès et est maintenant disponible avec guidage vocal'
      });
      
      router.push('/admin');
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Erreur',
        message: error.message || 'Impossible de créer la recette'
      });
    } finally {
      setLoading(false);
    }
  };

  // Suggestions d'images Pexels populaires pour la cuisine
  const imageSuggestions = [
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', // Cuisine moderne
    'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg', // Pâtes
    'https://images.pexels.com/photos/824635/pexels-photo-824635.jpeg',   // Œufs
    'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg', // Légumes
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <BoltBadge />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminGuard requiredPermission="recipes:write">
          <AdminHeader />
          
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
              <ChefHat className="w-8 h-8 mr-3 text-orange-500" />
              Créer une nouvelle recette
            </h1>
            <div className="bg-gradient-to-r from-orange-50 to-green-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Mic className="w-5 h-5 text-orange-600" />
                <span className="font-semibold text-orange-800">Guidage vocal automatique</span>
              </div>
              <p className="text-orange-700 text-sm">
                Chaque recette que vous créez bénéficiera automatiquement du guidage vocal étape par étape pour aider les débutants !
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
              {/* Informations de base */}
              <Card>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Star className="w-6 h-6 mr-2 text-orange-500" />
                  Informations principales
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Input
                      label="Nom de la recette *"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Ex: Pâtes à l&apos;ail et à l&apos;huile d&apos;olive"
                      helperText="Choisissez un nom clair et appétissant"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description pour les débutants *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Décrivez cette recette de manière encourageante pour les débutants. Expliquez pourquoi c&apos;est une bonne recette pour apprendre..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      💡 Conseil : Mentionnez les techniques qu&apos;on apprend avec cette recette
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Camera className="w-4 h-4 inline mr-1" />
                      Photo de la recette *
                    </label>
                    <Input
                      value={formData.image_url}
                      onChange={(e) => handleInputChange('image_url', e.target.value)}
                      placeholder="https://images.pexels.com/photos/..."
                      helperText="Utilisez une belle image de Pexels"
                      required
                    />
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-2">Suggestions d&apos;images populaires :</p>
                      <div className="grid grid-cols-4 gap-2">
                        {imageSuggestions.map((url, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleInputChange('image_url', url)}
                            className="relative group"
                          >
                            <img
                              src={url}
                              alt={`Suggestion ${index + 1}`}
                              className="w-full h-16 object-cover rounded border-2 border-transparent group-hover:border-orange-500 transition-all"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded transition-all"></div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-orange-500" />
                    <Input
                      label="Préparation (min)"
                      type="number"
                      value={formData.prep_time}
                      onChange={(e) => handleInputChange('prep_time', parseInt(e.target.value))}
                      min="1"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-green-500" />
                    <Input
                      label="Cuisson (min)"
                      type="number"
                      value={formData.cook_time}
                      onChange={(e) => handleInputChange('cook_time', parseInt(e.target.value))}
                      min="1"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    <Input
                      label="Portions"
                      type="number"
                      value={formData.servings}
                      onChange={(e) => handleInputChange('servings', parseInt(e.target.value))}
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Niveau de difficulté
                    </label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => handleInputChange('difficulty', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="beginner">🟢 Débutant (recommandé)</option>
                      <option value="intermediate">🟡 Intermédiaire</option>
                      <option value="advanced">🔴 Avancé</option>
                    </select>
                  </div>

                  <Input
                    label="Catégorie"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    placeholder="main, breakfast, dessert, snack"
                  />

                  <Input
                    label="Type de cuisine"
                    value={formData.cuisine}
                    onChange={(e) => handleInputChange('cuisine', e.target.value)}
                    placeholder="italian, french, asian, international"
                  />
                </div>
              </Card>

              {/* Tags */}
              <Card>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">🏷️ Tags (mots-clés)</h2>
                <p className="text-gray-600 mb-4">Ajoutez des mots-clés pour aider les utilisateurs à trouver votre recette</p>
                <div className="space-y-3">
                  {formData.tags.map((tag, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={tag}
                        onChange={(e) => handleArrayChange('tags', index, e.target.value)}
                        placeholder="Ex: quick, vegetarian, healthy, comfort-food"
                        className="flex-1"
                      />
                      {formData.tags.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeArrayItem('tags', index)}
                          icon={<Trash2 className="w-4 h-4" />}
                        >
                          Supprimer
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem('tags')}
                    icon={<Plus className="w-4 h-4" />}
                  >
                    Ajouter un tag
                  </Button>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      💡 <strong>Tags populaires :</strong> quick, healthy, vegetarian, comfort-food, one-pot, no-bake, gluten-free
                    </p>
                  </div>
                </div>
              </Card>

              {/* Ingrédients */}
              <Card>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">🥘 Liste des ingrédients *</h2>
                <p className="text-gray-600 mb-4">
                  Listez tous les ingrédients avec les quantités précises. Soyez spécifique pour aider les débutants !
                </p>
                <div className="space-y-3">
                  {formData.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <Input
                        value={ingredient}
                        onChange={(e) => handleArrayChange('ingredients', index, e.target.value)}
                        placeholder="Ex: 400g de spaghetti ou 3 gousses d&apos;ail, émincées"
                        className="flex-1"
                      />
                      {formData.ingredients.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeArrayItem('ingredients', index)}
                          icon={<Trash2 className="w-4 h-4" />}
                        >
                          Supprimer
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem('ingredients')}
                    icon={<Plus className="w-4 h-4" />}
                  >
                    Ajouter un ingrédient
                  </Button>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-green-800">
                      ✅ <strong>Conseil :</strong> Précisez les quantités, la préparation (émincé, coupé en dés) et mentionnez si c&apos;est optionnel
                    </p>
                  </div>
                </div>
              </Card>

              {/* Étapes avec guidage vocal */}
              <Card>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Mic className="w-6 h-6 mr-2 text-orange-500" />
                  Instructions étape par étape *
                </h2>
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-orange-800 mb-2">🎯 Guidage vocal automatique</h3>
                  <p className="text-orange-700 text-sm">
                    Chaque étape que vous écrivez sera automatiquement lue à voix haute aux utilisateurs pendant qu&apos;ils cuisinent. 
                    Rédigez des instructions claires et détaillées !
                  </p>
                </div>
                
                <div className="space-y-6">
                  {formData.steps.map((step, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Étape {index + 1} - Instructions détaillées
                          </label>
                          <textarea
                            value={step}
                            onChange={(e) => handleArrayChange('steps', index, e.target.value)}
                            placeholder="Décrivez cette étape en détail pour un débutant. Ex: &apos;Faites chauffer l&apos;huile d&apos;olive dans une grande poêle à feu moyen. Vous saurez que c&apos;est prêt quand l&apos;huile commence à scintiller légèrement.&apos;"
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                          <div className="mt-2 text-xs text-gray-500 space-y-1">
                            <p>💡 <strong>Conseils pour une bonne étape :</strong></p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                              <li>Commencez par l&apos;action principale (ex: "Faites chauffer", "Mélangez", "Ajoutez")</li>
                              <li>Précisez la température, le temps, les signes visuels</li>
                              <li>Expliquez pourquoi cette étape est importante</li>
                              <li>Mentionnez les erreurs courantes à éviter</li>
                            </ul>
                          </div>
                        </div>
                        {formData.steps.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeArrayItem('steps', index)}
                            icon={<Trash2 className="w-4 h-4" />}
                            className="mt-8"
                          >
                            Supprimer
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem('steps')}
                    icon={<Plus className="w-4 h-4" />}
                  >
                    Ajouter une étape
                  </Button>
                </div>
              </Card>

              {/* Aperçu du guidage vocal */}
              <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Mic className="w-6 h-6 mr-2 text-green-600" />
                  Aperçu du guidage vocal
                </h2>
                <div className="space-y-3">
                  <p className="text-gray-700">
                    <strong>Votre recette inclura automatiquement :</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                    <li>🎤 Lecture audio de chaque étape</li>
                    <li>⏸️ Contrôles pause/lecture pour cuisiner à son rythme</li>
                    <li>🔄 Répétition des instructions si nécessaire</li>
                    <li>📱 Mode mains libres pour cuisiner sans toucher l&apos;écran</li>
                    <li>🎯 Navigation étape par étape avec progression visuelle</li>
                  </ul>
                  <div className="bg-white p-3 rounded border border-green-200">
                    <p className="text-sm text-green-800">
                      ✨ <strong>Exemple :</strong> "Étape 1 sur {formData.steps.filter(s => s.trim()).length}. {formData.steps[0] || 'Votre première étape apparaîtra ici...'}"
                    </p>
                  </div>
                </div>
              </Card>

              {/* Boutons d'action */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  loading={loading}
                  icon={<ChefHat className="w-5 h-5" />}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                >
                  {loading ? 'Création en cours...' : 'Créer la recette avec guidage vocal'}
                </Button>
              </div>
            </div>
          </form>
        </AdminGuard>
      </div>

      <Footer />
    </div>
  );
}