import { useEffect, useState } from "react";

export function useLoader(loadFn) {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const reload = async () => {
    setError(undefined);
    setLoading(true);
    try {
      setData(await loadFn());
      setLoading(false);
    } catch (e) {
      setError(e);
    } finally {
    }
  };
  useEffect(() => {
    reload().catch((e) => setError(e));
  }, []);

  return { data, loading, error, reload };
}
