import React from "react";

export default function RecipeCard({ recipe, onClick }) {
  return (
    <div className="recipe-card" onClick={() => onClick(recipe)}>
      <img src={recipe.strMealThumb} alt={recipe.strMeal} className="recipe-card-image" />
      <div className="recipe-card-content">
        <h3 className="recipe-card-title">{recipe.strMeal}</h3>
        <p className="recipe-card-text">{recipe.strInstructions.slice(0, 80)}...</p>
      </div>
    </div>
  );
}
