import { useCallback, useEffect, useRef, useState } from "react";

export default function useHttp() {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPostLoading, setIsPostLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const activeHttpRequest = useRef<AbortController[]>([]);

  const sendRequest = useCallback(
    async (
      url: string,
      method: string = "GET",
      body: any = null,
      headers: {} = {}
    ) => {
      setIsPostLoading(
        method === "POST" || method === "PATCH" || method === "DELETE"
      );
      setIsLoading(method === "GET");
      const httpAbortController = new AbortController();
      activeHttpRequest.current.push(httpAbortController);
      const response = await fetch(url, {
        method,
        body,
        headers,
        signal: httpAbortController.signal,
      });

      try {
        const data = await response.json();

        activeHttpRequest.current = activeHttpRequest.current.filter(
          (req) => req !== httpAbortController
        );

        if (!response.ok) {
          setErrorMessage(data.message);
          throw new Error("There was an error");
        }
        setIsLoading(false);
        setIsPostLoading(false);
        setSuccess(true);
        setMessage(data.message);
        return data;
      } catch (err: any) {
        setError(true);
        setIsLoading(false);
        setIsPostLoading(false);
        setSuccess(false);
        throw err;
      }
    },
    []
  );

  useEffect(() => {
    return () => {
      activeHttpRequest.current.forEach((e) => e.abort());
    };
  }, [activeHttpRequest]);

  const clearError = () => {
    setError(false);
  };

  return {
    isLoading,
    isPostLoading,
    error,
    success,
    message,
    errorMessage,
    sendRequest,
    clearError,
  };
}
