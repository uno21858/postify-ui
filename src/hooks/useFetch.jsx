import { useEffect, useState } from "react";

const useFetch = (url) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    const [tick, setTick] = useState(0);

    useEffect(() => {
        if (!url) return;

        const getData = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch(url);

                if (!res.ok) {
                    throw new Error(res.status);
                }

                const response = await res.json();
                setData(response);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        getData();
    }, [url, tick]);

    return { loading, data, error, refetch: () => setTick(t => t + 1) };
};

export default useFetch;
