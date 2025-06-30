'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BoltBadge } from '@/components/layout/BoltBadge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Image } from '@/components/ui/Image';
import { VoicePlayer } from '@/components/features/VoicePlayer';
import { demoRecipes } from '@/data/demoRecipes';

export default function DemoRecipeDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const recipe = demoRecipes.find(r => r.id === id);

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <BoltBadge />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Recipe Not Found</h2>
            <Link href="/demo-recipes">
              <Button icon={<ArrowLeft className="w-4 h-4" />}>Back to Recipes</Button>
            </Link>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const totalTime = recipe.prep_time + recipe.cook_time;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <BoltBadge />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/demo-recipes">
            <Button variant="ghost" icon={<ArrowLeft className="w-4 h-4" />}>Back to Recipes</Button>
          </Link>
        </div>

        <div className="mb-8">
          <div className="relative h-96 rounded-2xl overflow-hidden mb-6">
            <Image src={recipe.image_url} alt={recipe.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <h1 className="text-4xl font-bold text-white mb-2">{recipe.title}</h1>
              <p className="text-xl text-white/90">{recipe.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card padding="sm" className="text-center">
              <div className="text-sm text-gray-600">Prep Time</div>
              <div className="font-bold">{recipe.prep_time}m</div>
            </Card>
            <Card padding="sm" className="text-center">
              <div className="text-sm text-gray-600">Cook Time</div>
              <div className="font-bold">{recipe.cook_time}m</div>
            </Card>
            <Card padding="sm" className="text-center">
              <div className="text-sm text-gray-600">Servings</div>
              <div className="font-bold">{recipe.servings}</div>
            </Card>
            <Card padding="sm" className="text-center">
              <div className="text-sm text-gray-600">Total Time</div>
              <div className="font-bold">{totalTime}m</div>
            </Card>
          </div>

          <VoicePlayer text={`Let's cook ${recipe.title}!`} className="mb-8" />

          {recipe.video_url && (
            <div className="relative w-full mb-8" aria-label="Recipe video">
              <div className="aspect-video rounded-lg overflow-hidden">
                <video
                  src={recipe.video_url}
                  className="w-full h-full"
                  controls
                  title={`${recipe.title} video`}
                />
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Ingredients</h2>
              <ul className="space-y-3">
                {recipe.ingredients.map((ing, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700">{ing}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Instructions</h2>
              <div className="space-y-6">
                {recipe.steps.map((step, idx) => (
                  <div key={idx} className="flex p-4 rounded-lg bg-gray-50">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 bg-orange-500 text-white">
                      {idx + 1}
                    </div>
                    <p className="text-gray-700 leading-relaxed flex-1">{step}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
