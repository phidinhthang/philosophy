export const getTodayTime = ({ offset = 0 } = {}) => {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate() - offset;
  const year = today.getFullYear();
  const time = new Date(year, month, day).toString();
  return Date.parse(time).toString();
};
