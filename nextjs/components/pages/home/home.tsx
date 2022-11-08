import React, { FunctionComponent } from "react";
import { useGetAllPeople } from "../../../chisel.hooks";
import { Greeting } from "./greeting/greeting";
import { PeopleTable } from "./people_table/people_table";
import { PersonForm } from "./person_form/person_form";

export const HomePage: FunctionComponent = () => {
  const { data, isLoading, refetch } = useGetAllPeople();

  return (
    <div>
      <Greeting />
      <PersonForm refetchPeople={refetch} />
      {isLoading && <div>Data are loading</div>}
      <PeopleTable data={data as { firstName: string; lastName: string }[]} />
    </div>
  );
};
