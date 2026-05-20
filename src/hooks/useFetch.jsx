import { useEffect, useState } from "react";

const useFetch = (url) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getData = async () => {
            try {
                setLoading(true);

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
    }, [url]);

    return { loading, data, error };
};

export default useFetch;
