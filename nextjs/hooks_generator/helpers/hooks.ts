import React, { useContext, useEffect } from "react";
import { chiselFetch } from "@chiselstrike/frontend";
import { ChiselContext } from "./context";

interface ChieselFetchArgs {
  url: string;
  shouldFetchOnMount: boolean;
}

export type PublicChieselFetchArgs = Omit<ChieselFetchArgs, "url">;

export function useChiselFetch<T>({
  url,
  shouldFetchOnMount,
}: ChieselFetchArgs) {
  const [data, setData] = React.useState<T | undefined>();
  const [error, setErrors] = React.useState<any>(undefined);
  const [isLoading, setIsLoading] = React.useState(false);
  const chisel = useContext(ChiselContext);

  const fetch = async () => {
    setIsLoading(true);
    try {
      const res: { json: () => Promise<T> } = await chiselFetch(
        chisel,
        `dev/${url}`,
        {
          method: "GET",
        }
      );
      const jsonData = await res.json();

      setData(jsonData);
    } catch (err) {
      setErrors(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (shouldFetchOnMount) {
      fetch();
    }
  }, []);

  return { refetch: fetch, data, error, isLoading };
}
