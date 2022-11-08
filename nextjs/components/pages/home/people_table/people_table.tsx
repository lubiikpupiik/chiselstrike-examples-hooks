import React, { FunctionComponent } from "react";

interface Props {
  data?: { firstName: string; lastName: string }[];
}

export const PeopleTable: FunctionComponent<Props> = ({ data }) => {
  return (
    <table>
      <tbody>
        <tr>
          <td>firstName</td>
          <td>lastName</td>
        </tr>
        {data?.map((person) => (
          <tr>
            <td>{person.firstName}</td>
            <td>{person.lastName}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
