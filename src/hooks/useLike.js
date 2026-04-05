import { useState, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { likesService } from '../services/likes.service';

/**
 * Optimistic like toggle with safe rollback.
 *
 * Pre-mutation state is captured in a ref so onError always rolls back
 * to the correct values regardless of re-renders between mutate and error.
 */
export const useLike = ({ newsId, initialLiked = false, initialCount = 0 }) => {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);

  // Snapshot taken right before the optimistic update
  const snapshot = useRef({ liked, count });

  const { mutate, isPending } = useMutation({
    mutationFn: () => likesService.toggle(newsId),

    onMutate: () => {
      snapshot.current = { liked, count };   // save current state
      setLiked(!liked);
      setCount(liked ? count - 1 : count + 1);
    },

    onSuccess: (res) => {
      // Sync with authoritative server values
      setLiked(res.data.liked);
      setCount(res.data.likeCount);
    },

    onError: () => {
      // Restore exactly what was there before the optimistic update
      setLiked(snapshot.current.liked);
      setCount(snapshot.current.count);
    },
  });

  return { liked, count, toggle: mutate, isPending };
};
