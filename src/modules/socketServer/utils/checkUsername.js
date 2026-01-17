export const checkUserName = (user) => {
  if (!user || !user.username) return false;
  if (user.username.trim() === "") return false;
  return true;
};
