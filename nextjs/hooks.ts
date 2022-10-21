import {
  useChiselFetch,
  PublicChieselFetchArgs,
} from "./hooks_generator/helpers/hooks";

export interface Person {}

export function useGetAllPeople({
  shouldFetchOnMount,
}: PublicChieselFetchArgs) {
  return useChiselFetch<Person>({ url: "get_all_perople", shouldFetchOnMount });
}

export type ChieselFetchArgs = PublicChieselFetchArgs;
