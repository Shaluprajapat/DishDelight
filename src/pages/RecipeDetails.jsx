import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import axios from "axios";

export default function RecipeDetails() {
  const { id } = useParams(); // get recipe ID from URL
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );
        setRecipe(res.data.meals[0]);
      } catch (err) {
        console.error(err);
        setRecipe(null);
      }
      setLoading(false);
    };

    fetchRecipe();
  }, [id]);

  // Extract ingredients dynamically
  const getIngredients = () => {
    if (!recipe) return [];
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];
      if (ingredient && ingredient.trim() !== "") {
        ingredients.push(`${ingredient} - ${measure}`);
      }
    }
    return ingredients;
  };

  if (loading) {
    return (
      <Layout>
        <p className="text-center text-gray-500">Loading recipe...</p>
      </Layout>
    );
  }

  if (!recipe) {
    return (
      <Layout>
        <p className="text-center text-red-500">Recipe not found.</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">{recipe.strMeal}</h1>

        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          className="w-full h-64 object-cover rounded mb-4"
        />

        <h2 className="text-2xl font-semibold mb-2">Ingredients:</h2>
        <ul className="list-disc list-inside mb-4">
          {getIngredients().map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>

        <h2 className="text-2xl font-semibold mb-2">Instructions:</h2>
        <p className="mb-4">{recipe.strInstructions}</p>

        {recipe.strYoutube && (
          <div className="mb-4">
            <h2 className="text-2xl font-semibold mb-2">Video:</h2>
            <a
              href={recipe.strYoutube}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 hover:underline"
            >
              Watch on YouTube
            </a>
          </div>
        )}

        <Link
          to="/"
          className="inline-block mt-4 bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
        >
          Back to Home
        </Link>
      </div>
    </Layout>
  );
}
