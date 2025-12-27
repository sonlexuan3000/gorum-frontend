import {type Comment } from '../types';

export function countTotalComments(comments: Comment[]): number {
  let total = 0;
  
  const countRecursive = (comment: Comment) => {
    total += 1; 
    
    if (comment.replies && comment.replies.length > 0) {
      comment.replies.forEach(reply => countRecursive(reply));
    }
  };
  
  comments.forEach(comment => countRecursive(comment));
  
  return total;
}