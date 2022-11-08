import { useChiselFetch, useChiselPut, PublicChiselFetchArgs, PublicChiselPutArgs } from "./hooks_generator/helpers/hooks";

export type ChiselFetchArgs = PublicChiselFetchArgs;
export type ChiselPutArgs = PublicChiselPutArgs;

export interface Person {
    firstName: string;
    lastName: string;
}

export function useGetAllPeople(params?: PublicChiselFetchArgs) {
    return useChiselFetch({ url: 'get_all_people', ...params });
}

export function useImportPerson(params?: PublicChiselPutArgs) {
    return useChiselPut({ url: 'import_person', ...params })
}
