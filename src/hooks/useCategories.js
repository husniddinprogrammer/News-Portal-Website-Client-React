import { useQuery } from '@tanstack/react-query';
import { categoriesService } from '../services/categories.service';

export const useCategories = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: categoriesService.getAll,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    select: (res) => res.data?.filter((c) => !c.isDeleted) ?? [],
  });
