export const setTime = () => {
  const days = 13;
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const getTime = (time: number) => (time < 10 ? `0${time}` : time);
  const currentTime = `${getTime(hours)}:${getTime(minutes)}`;

  const currentDate = new Date().toISOString().split("T")[0];

  const setDeadlineDate = new Date();
  setDeadlineDate.setTime(
    setDeadlineDate.getTime() + days * 24 * 60 * 60 * 1000
  );
  const deadlineDate = setDeadlineDate.toISOString().split("T")[0];

  return { currentDate, currentTime, deadlineDate };
};
