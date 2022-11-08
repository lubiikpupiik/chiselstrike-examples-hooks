import React, { useContext, useEffect, useState } from "react";
import { chiselFetch } from "@chiselstrike/frontend";
import { ChiselContext } from "./context";

interface ChiselFetchArgs {
  url: string;
  shouldFetchOnMount?: boolean;
}

export type PublicChiselFetchArgs = Omit<ChiselFetchArgs, "url">;

export function useChiselFetch({
  url,
  shouldFetchOnMount = true,
}: ChiselFetchArgs) {
  const [data, setData] = React.useState<
    Record<string, unknown>[] | undefined
  >();
  const [errors, setErrors] = React.useState<any>(undefined);
  const [isLoading, setIsLoading] = React.useState(false);
  const chisel = useContext(ChiselContext);

  const fetch = async () => {
    setIsLoading(true);
    try {
      const res: { json: () => Promise<Record<string, unknown>[]> } =
        await chiselFetch(chisel, `dev/${url}`, {
          method: "GET",
        });
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

interface ChiselPutArgs {
  url: string;
  onSuccess?: () => void;
}

export type PublicChiselPutArgs = Omit<ChiselPutArgs, "url">;

export function useChiselPut({ url, onSuccess }: ChiselPutArgs) {
  const chisel = useContext(ChiselContext);
  const [errors, setErrors] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const put = async (args: any) => {
    setIsLoading(true);
    try {
      await chiselFetch(chisel, `dev/${url}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(args),
      });
      onSuccess?.();
    } catch (error) {
      setErrors(errors);
    } finally {
      setIsLoading(false);
    }
  };

  return { put, errors, isLoading };
}
