import { useCallback, useState, useEffect } from "react";
import { axiosInstance } from "../Utils/axiosInstance";

export const useFetch = ({ url }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data } = await axiosInstance.get(url).catch((e) => {
      setError(e);
      setLoading(false);
    });
    setData(data.data);
    setLoading(false);
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, error, loading };
};