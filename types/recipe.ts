import { RecipeIngredient } from './ingredient';

export interface Recipe {
  _id: string;
  title: string;
  // Бекенд зберігає назву категорії рядком ("Beef"), а не об'єкт { _id, name }
  // — див. recipool-back/docs/API_CONTRACT.md.
  category: string;
  owner: string;
  area?: string;
  instructions: string;
  description: string;
  thumb: string;
  time: number;
  calories: number;
  ingredients: RecipeIngredient[];
  image?: string;
  createdAt: string;
  updatedAt: string;
}
