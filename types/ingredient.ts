export interface Ingredient {
  _id: string;
  name: string;
  desc: string;
  img: string;
}

export interface IngredientOption {
  id: string;
  name: string;
}

export interface RecipeIngredient {
  id: Ingredient;
  measure: string;
}

export type IngredientOptionFilter = Pick<Ingredient, '_id' | 'name'>;
