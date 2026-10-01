export const RECIPES_PER_PAGE = 12;

// id секції зі списком — до неї скролимо після кліку на чип у Hero чи зміни сторінки.
export const RECIPES_SECTION_ID = 'recipes';

// Filters/хук скидають пошукову форму за цим id, бо інпут у SearchBox некерований.
export const SEARCH_FORM_ID = 'search__recipes__form';

// Категорії з сид-даних бекенду, які показуємо як швидкі підказки.
export const POPULAR_CATEGORIES: readonly string[] = [
  'Chicken',
  'Seafood',
  'Dessert',
  'Vegetarian',
];
