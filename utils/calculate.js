export const calculateTotal = (items) => {
  return items.reduce((acc, item) => {
    return (
      acc +
      item.book.price * item.quantity
    );
  }, 0);
};