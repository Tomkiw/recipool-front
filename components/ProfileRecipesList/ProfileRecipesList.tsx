'use client';

import {
    useEffect,
    useState
}

from 'react';
import RecipeCard from '../RecipeCard/RecipeCard';
import LoadMoreBtn from '../LoadMoreBtn/LoadMoreBtn';

import {
    Recipe
}

from '@/types/recipe';
import css from './ProfileRecipesList.module.css';

interface ProfileRecipesListProps {
    initialRecipes: Recipe[];
    totalPages: number;
    totalRecipes: number;
    recipeType: 'own'| 'favorites';

    fetchMoreFn: (page: number)=>Promise< {
        recipes: Recipe[];
        totalPages: number;
        totalRecipes: number
    }

    >;
}

export default function ProfileRecipesList( {
        initialRecipes,
        totalPages: initialTotalPages,
        totalRecipes: initialTotalRecipes,
        recipeType,
        fetchMoreFn,
    }

    : ProfileRecipesListProps) {
    const [recipes,
    setRecipes]=useState<Recipe[]>(initialRecipes);
    const [page,
    setPage]=useState(1);
    const [totalPages,
    setTotalPages]=useState(initialTotalPages);
    const [totalRecipes,
    setTotalRecipes]=useState(initialTotalRecipes);
    const [isLoading,
    setIsLoading]=useState(false);

    useEffect(()=> {
            setRecipes(initialRecipes);
            setPage(1);
            setTotalPages(initialTotalPages);
            setTotalRecipes(initialTotalRecipes);
        }

        , [initialRecipes, initialTotalPages, initialTotalRecipes, recipeType]);

    const hasMore=page < totalPages;

    const handleLoadMore=async ()=> {
        if (isLoading || !hasMore) return;

        setIsLoading(true);

        try {
            const nextPage=page+1;
            const data=await fetchMoreFn(nextPage);

            setRecipes((prev)=> [...prev, ...data.recipes]);
            setTotalPages(data.totalPages);
            setTotalRecipes(data.totalRecipes);
            setPage(nextPage);
        }

        catch (error) {
            const iziToast=(await import('izitoast')).default;

            iziToast.error( {
                    title: 'Error',
                    message: 'Failed to load more recipes. Please try again later.',
                    position: 'topRight',
                }

            );
        }

        finally {
            setIsLoading(false);
        }
    }

    ;

    const handleRemoveRecipe=(recipeId: string)=> {
        setRecipes((prev)=> prev.filter((r)=> r._id !==recipeId));
        setTotalRecipes((prev)=> Math.max(0, prev - 1));
    }

    ;

    const cardVariant=recipeType==='own'? 'own' : 'favorite';

    return (<> <div className= {
            css.meta
        }

        > <span className= {
            css.count
        }

        > {
            totalRecipes
        }

        recipes</span> </div> {
            recipes.length===0 ? (<p className= {
                    css.emptyText
                }

                > {
                    "You haven't added any recipes yet."
                }

                </p>) : (<ul className= {
                    css.grid
                }

                > {
                    recipes.map((recipe)=> (<li key= {
                                recipe._id
                            }

                            > <RecipeCard recipe= {
                                recipe
                            }

                            variant= {
                                cardVariant
                            }

                            onRemove= {
                                handleRemoveRecipe
                            }

                            /> </li>))
                }

                </ul>)
        }

            {
            hasMore && (<div className= {
                    css.loadMoreWrapper
                }

                > <LoadMoreBtn onClick= {
                    handleLoadMore
                }

                disabled= {
                    isLoading
                }

                /> </div>)
        }

        </>);
}