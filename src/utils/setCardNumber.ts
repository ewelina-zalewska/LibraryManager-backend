export const setCardNumber = (name: string) => {
  const randomId = Math.round(Math.random() * 10000);
  const letters = name.slice(0, 2).toUpperCase();
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const cardNo = `${letters}${year}${month}${randomId}`;

  return cardNo;
};
