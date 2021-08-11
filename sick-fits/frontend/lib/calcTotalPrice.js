export default function calcTotalPrice(cart) {
  return cart.reduce((tally, cartItem) => {
    if (!cartItem.product) return tally; // product can be deleted but still in a users cart
    return tally + cartItem.quantity * cartItem.product.price;
  }, 0);
}
