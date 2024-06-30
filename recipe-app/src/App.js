// src/App.js
import React, { useState, useEffect } from 'react';

const App = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [shoppingList, setShoppingList] = useState({});

  useEffect(() => {
    fetch('http://localhost:5000/recipes')
      .then(response => response.json())
      .then(data => setRecipes(data));
  }, []);

  const handleSelectRecipe = (recipe) => {
    setSelectedRecipes([...selectedRecipes, recipe]);
  };

  const generateShoppingList = () => {
    fetch('http://localhost:5000/shopping-list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipes: selectedRecipes.map(r => r.id) })
    })
      .then(response => response.json())
      .then(data => setShoppingList(data));
  };

  return (
    <div>
      <h1>Recipe List</h1>
      <ul>
        {recipes.map(recipe => (
          <li key={recipe.id}>
            {recipe.name} <button onClick={() => handleSelectRecipe(recipe)}>Select</button>
          </li>
        ))}
      </ul>
      <button onClick={generateShoppingList}>Generate Shopping List</button>
      <h2>Shopping List</h2>
      <ul>
        {Object.keys(shoppingList).map(ingredient => (
          <li key={ingredient}>{shoppingList[ingredient]} {ingredient}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
