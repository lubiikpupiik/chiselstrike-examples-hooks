import {
  useChiselFetch,
  PublicChieselFetchArgs,
} from "./hooks_generator/helpers/hooks";

export type ChiselFetchArgs = PublicChieselFetchArgs;

export interface Person {
  firstName: string;
  lastName: string;
}

export function useGetAllPeople(params: PublicChieselFetchArgs) {
  return useChiselFetch<Response>({ url: "get_all_people", ...params });
}

export function useImportPerson(params: PublicChieselFetchArgs) {
  return useChiselFetch<Response>({ url: "import_person", ...params });
}
