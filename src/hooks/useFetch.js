import { useCallback, useState, useEffect } from "react";
import { axiosInstance } from "../Utils/axiosInstance";

export const useFetch = ({ url }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axiosInstance.get(url);
      console.log('Response:', response); // Debug log
      setData(response.data);
    } catch (err) {
      console.error('Fetch error:', err); // Debug log
      setError(err.response?.data?.message || err.message || "An error occurred");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, error, loading };
};