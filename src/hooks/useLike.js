import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { likesService } from '../services/likes.service';

export const useLike = ({ newsId, initialLiked = false, initialCount = 0 }) => {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);

  const { mutate, isPending } = useMutation({
    mutationFn: () => likesService.toggle(newsId),
    onMutate: () => {
      // Optimistic update
      setLiked((prev) => !prev);
      setCount((prev) => (liked ? prev - 1 : prev + 1));
    },
    onSuccess: (res) => {
      setLiked(res.data.liked);
      setCount(res.data.likeCount);
    },
    onError: () => {
      // Rollback
      setLiked((prev) => !prev);
      setCount((prev) => (liked ? prev + 1 : prev - 1));
    },
  });

  return { liked, count, toggle: mutate, isPending };
};
