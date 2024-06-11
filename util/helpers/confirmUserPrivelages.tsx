export const userCanAccessApp = (session: any) => {
  if (
    session?.user?.planType === "canceled" ||
    session?.user?.planType === "free"
  ) {
    const expiryDate = new Date(session?.user?.planExpiryDate).getTime();
    const today = new Date().getTime(); //

    return expiryDate > today;
  }

  return true;
};
