'use client';

import {
    useState
}

from 'react';
import RecipeCard from '../RecipeCard/RecipeCard';
import Pagination from '../Pagination/Pagination';

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

    // Скидаємо локальний стан прямо під час рендеру, коли сервер віддав
    // нову партію initialRecipes (зміна recipeType або router.refresh()),
    // замість useEffect - так уникаємо зайвого циклу рендеру після коміту.
    const [prevInitialRecipes,
    setPrevInitialRecipes]=useState(initialRecipes);
    if (initialRecipes !== prevInitialRecipes) {
        setPrevInitialRecipes(initialRecipes);
        setRecipes(initialRecipes);
        setPage(1);
        setTotalPages(initialTotalPages);
        setTotalRecipes(initialTotalRecipes);
    }

    const showPagination=totalPages > 1;

    const handlePageChange=async (nextPage: number)=> {
        if (isLoading || nextPage===page) return;

        setIsLoading(true);

        try {
            const data=await fetchMoreFn(nextPage);

            setRecipes(data.recipes);
            setTotalPages(data.totalPages);
            setTotalRecipes(data.totalRecipes);
            setPage(nextPage);
        }

        catch {
            const iziToast=(await import('izitoast')).default;

            iziToast.error( {
                    title: 'Error',
                    message: 'Failed to load recipes. Please try again later.',
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
            showPagination && (<div className= {
                    `${css.paginationWrapper} ${isLoading ? css.paginationLoading : ''}`
                }

                > <Pagination totalPages= {
                    totalPages
                }

                currentPage= {
                    page
                }

                onPageChange= {
                    handlePageChange
                }

                /> </div>)
        }

        </>);
}