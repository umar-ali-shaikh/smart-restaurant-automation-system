export function getRanked(allDishes, allReviews, cuisineFilter) {
  const dishes = cuisineFilter ? allDishes.filter((dish) => dish.cuisine === cuisineFilter) : allDishes;

  return dishes
    .map((dish) => {
      const dishId = dish._id || dish.id;
      const matchedReviews = allReviews.filter((review) => review.dishId === dishId);
      const avg = matchedReviews.length
        ? matchedReviews.reduce((sum, review) => sum + review.rating, 0) / matchedReviews.length
        : 0;
      const count = matchedReviews.length;
      const topReview = [...matchedReviews].sort((a, b) => b.rating - a.rating)[0];

      return { ...dish, avg, count, topReview };
    })
    .sort((a, b) => b.avg - a.avg || b.count - a.count)
    .slice(0, 8);
}

export function getDishRating(id, reviews) {
  const matchedReviews = reviews.filter((review) => review.dishId === id);

  if (!matchedReviews.length) {
    return { avg: "0.0", count: 0 };
  }

  return {
    avg: (matchedReviews.reduce((sum, review) => sum + review.rating, 0) / matchedReviews.length).toFixed(1),
    count: matchedReviews.length,
  };
}

export function getCartTotals(cart) {
  const items = Object.values(cart);
  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.qty * item.price, 0);

  return { items, totalItems, totalPrice };
}
