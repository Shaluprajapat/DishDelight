import React, { useState, useEffect } from "react";
import Layout from "../components/Layout.jsx";
import axios from "axios";
import RecipeCard from "../components/RecipeCard.jsx";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Translate recipe name to Hindi using Microsoft Translator
  const translateToHindi = async (text) => {
    try {
      const res = await axios.post(
        "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=hi",
        [{ text }],
        {
          headers: {
            "Ocp-Apim-Subscription-Key": "YOUR_MICROSOFT_TRANSLATOR_API_KEY",
            "Content-Type": "application/json",
          },
        }
      );
      return res.data[0].translations[0].text;
    } catch (err) {
      console.error("Translation Error:", err);
      return text; // fallback to English
    }
  };

  // Fetch recipes from API (all or searched)
  const fetchRecipes = async (query = "") => {
    setLoading(true);
    setError("");
    setSelectedRecipe(null);
    setRecipes([]);

    try {
      const res = await axios.get(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
      );

      if (res.data.meals) {
        // Translate recipe names to Hindi
        const translatedRecipes = await Promise.all(
          res.data.meals.map(async (recipe) => {
            const hindiName = await translateToHindi(recipe.strMeal);
            return { ...recipe, strMealHindi: hindiName };
          })
        );
        setRecipes(translatedRecipes);
      } else {
        setError(`No recipes found for "${query}"`);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again!");
    }

    setLoading(false);
  };

  // Load all recipes on component mount
  useEffect(() => {
    fetchRecipes();
  }, []);

  // Extract ingredients
  const getIngredients = (recipe) => {
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

  return (
    <Layout>
      {/* Page title */}
      <h1 className="home-title">DishDelight</h1>

      {/* Search bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Enter recipe name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") fetchRecipes(searchTerm);
          }}
          className="search-input"
        />
        <button
          onClick={() => fetchRecipes(searchTerm)}
          className="search-button"
        >
          Search
        </button>
      </div>

      {/* Loading and error messages */}
      {loading && <p className="loading-text">Loading recipes...</p>}
      {error && <p className="error-text">{error}</p>}

      {/* Recipe grid */}
      {!selectedRecipe && recipes.length > 0 && (
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.idMeal}
              recipe={recipe}
              onClick={() => setSelectedRecipe(recipe)}
            />
          ))}
        </div>
      )}

      {/* Selected recipe details */}
      {selectedRecipe && (
        <div className="recipe-details">
          <button
            onClick={() => setSelectedRecipe(null)}
            className="back-button"
          >
            Back to Results
          </button>

          <h2 className="recipe-title">
            {selectedRecipe.strMeal} / {selectedRecipe.strMealHindi}
          </h2>
          <img
            src={selectedRecipe.strMealThumb}
            alt={selectedRecipe.strMeal}
            className="recipe-image"
          />

          <h3>Ingredients:</h3>
          <ul>
            {getIngredients(selectedRecipe).map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h3>Instructions:</h3>
          <p>{selectedRecipe.strInstructions}</p>

          {selectedRecipe.strYoutube && (
            <div className="youtube-link">
              <a
                href={selectedRecipe.strYoutube}
                target="_blank"
                rel="noopener noreferrer"
              >
                Watch on YouTube
              </a>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}
