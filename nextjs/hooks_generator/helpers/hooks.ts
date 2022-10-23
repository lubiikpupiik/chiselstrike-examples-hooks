import React, { useContext, useEffect, useState } from "react";
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
  const [errors, setErrors] = React.useState<any>(undefined);
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
      if (errors) {
        setErrors(errors);
      }
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

  return { refetch: fetch, data, errors, isLoading };
}

interface ChiselPostArgs {
  url: string;
  onSuccess: () => void;
}

export type PublicChiselPostArgs = Omit<ChiselPostArgs, "url">;

export function useChiselPost<TArguments>({ url, onSuccess }: ChiselPostArgs) {
  const chisel = useContext(ChiselContext);
  const [errors, setErrors] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const post = async (args: TArguments) => {
    setIsLoading(true);
    try {
      await chiselFetch(chisel, `dev/${url}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(args),
      });
    } catch (error) {
      setErrors(errors);
    } finally {
      setIsLoading(false);
    }
  };

  return { post, errors, isLoading };
}
