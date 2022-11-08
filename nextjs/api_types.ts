import { useCallback, useEffect, useState } from "react";
import axios from "axios";

const useGetRequest = <TParams, TReturnType>({
  url,
  params,
  initialCall = true,
}: {
  url: string;
  params: TParams;
  initialCall: boolean;
}): {
  data?: TReturnType;
  isLoading: boolean;
  errors?: any;
  refetch: () => void;
} => {
  const [data, setData] = useState<TReturnType | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>(undefined);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await axios.get<TReturnType>(url, { params });

      setData(data.data);
      setErrors(undefined);
    } catch (err) {
      setErrors(err);
    } finally {
      setIsLoading(false);
    }
  }, [url, params]);

  useEffect(() => {
    if (initialCall) {
      refetch();
    }
  }, []);

  return {
    data,
    isLoading,
    errors,
    refetch,
  };
};

interface GetUsersParams {
  order: string;
  id_in: number[];
}

interface User {
  id: number;
  email: string;
  name: string;
  image: string;
}

export const useGetUsers = ({
  params,
  initialCall,
}: {
  params: GetUsersParams;
  initialCall?: boolean;
}) =>
  useGetRequest<GetUsersParams, User[]>({ url: "/users", params, initialCall });
