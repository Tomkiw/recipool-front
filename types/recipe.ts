import { Category } from './category';
import { RecipeIngredient } from './ingredient';

export interface Recipe {
  _id: string;
  title: string;
  category: Category;
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
