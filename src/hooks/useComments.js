import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsService } from '../services/comments.service';

export const useComments = (newsId, params = {}) =>
  useQuery({
    queryKey: ['comments', newsId, params],
    queryFn: () => commentsService.getByNews(newsId, params),
    enabled: Boolean(newsId),
    staleTime: 1000 * 30,
    select: (res) => ({ comments: res.data ?? [], pagination: res.pagination }),
  });

export const useAddComment = (newsId) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: commentsService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['comments', newsId] }),
  });
};
