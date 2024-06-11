import { useCallback, useState } from "react";

import { useSession } from "next-auth/react";

export const useGetPortfolioStrategy = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [portfolioStrategies, setPortfolioStrategies] = useState([]);

  const getPortfolioStrategy = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_SERVER}/api/get-portfolio-strategies?id=${session?.user?._id}`
      );
      const data = await response.json();
      console.log(data);
      setPortfolioStrategies(data.biddingStrategies);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log("There was an error getting the portfolio strategies.", err);
    }
  }, []);

  return {
    isLoading,
    portfolioStrategies,
    getPortfolioStrategy,
  };
};
