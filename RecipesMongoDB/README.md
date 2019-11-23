# 🍳 RecipesMongoDB
Virtual recipe database using GraphQL and MongoDB.
### Launch server
```js
npm start
```
### Types
##### Author
    - ID
    - Name
    - Email
##### Ingredient
    - ID
    - Name
##### Recipe
    - ID
    - Title
    - Description
    - Date
    - Author
    - Ingredients
#### Queries
    - Authors: List of authors.
    - Ingredients: List of ingredients.
    - Recipes: List of recipes.
#### Mutations
    - Add Author: Add new Author.
    - Add Ingredient: Add new ingredient.
    - Add Recipe: Add new recipe.

    - Remove Author: Remove an author.
    - Remove Ingredient: Remove an ingredient.
    - Remove Recipe: Remove a recipe.

    - Update Author: Change author information.
    - Update Ingredient: Change ingredient information.
    - Update Recipe: Change recipe information.