import { useCallback, useState } from "react";

export const useAI = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [AIResponse, setAIResponse] = useState<string>("");

  const performDataAnalysis = useCallback(
    async (segment: string, type: string, id: string, adGroupId?: string) => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_APP_SERVER
          }/api/ai/analyze-data?id=${id}&segment=${segment}&type=${type}&adGroupId=${
            adGroupId ? adGroupId : null
          }`
        );

        const data = await response.json();

        if (!data.ok) {
          setIsLoading(false);
          throw new Error(data.error);
        }

        setIsLoading(false);
        setAIResponse(data.analysisResponse);
        return data.analysisResponse;
      } catch (err) {
        setIsLoading(false);
        console.log("There was an error analzying your data: " + err);
      }
    },
    []
  );

  const getFeedback = useCallback(
    async (id: string, page: string, limit: string) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_SERVER}/api/ai/get-past-ai-feedback?id=${id}&page=${page}&limit=${limit}`
        );

        const data = await response.json();

        if (!data.ok) {
          throw new Error(data.error);
        }

        return {
          page: data.pageNum,
          totalPages: data.totalPages,
          totalFeedback: data.totalFeedback,
          feedback: data.gptData,
        };
      } catch (err) {
        console.log(err);
      }
    },
    []
  );

  return { performDataAnalysis, isLoading, AIResponse, getFeedback };
};
