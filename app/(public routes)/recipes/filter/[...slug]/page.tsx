import RecipesClient from "./Recipes.client";
import { fetchRecipesServer } from "@/lib/api/serverApi"; 

interface PageProps {
  params: {
    slug: string[]; 
  };
  searchParams: {
    search?: string;
  };
}

export default async function RecipesFilterPage({ params, searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const resolvedParams = await params;

  const searchQuery = resolvedSearchParams.search || "";
  const rawCategory = resolvedParams.slug?.[0] || "all";
  
  const currentCategory = rawCategory === "all" ? "" : rawCategory;
  
  const initialData = await fetchRecipesServer({
    page: 1,
    perPage: 12, 
    search: searchQuery,
    category: currentCategory,
  });

  return (
    <section>
      <RecipesClient 
        initialRecipes={initialData.recipes}
        totalPages={initialData.totalPages}
        totalRecipes={initialData.totalRecipes}
        searchQuery={searchQuery}
        currentCategory={currentCategory}
      />
    </section>
  );
}