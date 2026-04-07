import { useQuery } from '@tanstack/react-query';
import { categoriesService } from '../services/categories.service';

export const useCategories = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: categoriesService.getAll,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    select: (res) => {
      const categories = res.data?.filter((c) => !c.isDeleted) ?? [];
      
      // Sort categories: "emas" categories in descending ID order, others in ascending ID order
      return categories.sort((a, b) => {
        const aIsEmas = a.name?.toLowerCase().includes('emas');
        const bIsEmas = b.name?.toLowerCase().includes('emas');
        
        // If both are "emas" or neither are "emas", sort by ID
        if (aIsEmas === bIsEmas) {
          return aIsEmas ? b.id - a.id : a.id - b.id; // emas: descending, others: ascending
        }
        
        // "emas" categories come first
        return aIsEmas ? -1 : 1;
      });
    },
  });
