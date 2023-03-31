export const formatDuration = (date1: Date, date2: Date) => {
  const duration = date1.getTime() - date2.getTime();
  const days = Math.floor(duration / (1000 * 3600 * 24));
  const hours = Math.floor(duration / (1000 * 3600));
  const age = hours >= 24 ? `${days}d` : `${hours}h`;
  return age;
};

export const oneWeekAgo = () => {
  var oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  return oneWeekAgo;
};
