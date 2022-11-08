import React, { ChangeEvent } from "react";
import { FunctionComponent } from "react";
import { useImportPerson } from "../../../../chisel.hooks";

interface Props {
  refetchPeople: () => void;
}

export const PersonForm: FunctionComponent<Props> = ({ refetchPeople }) => {
  const [form, setForm] = React.useState({ firstName: "", lastName: "" });
  const { put, isLoading } = useImportPerson({
    onSuccess: refetchPeople,
  });

  const handleChange = (ev: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [ev.currentTarget.name]: ev.currentTarget.value,
    });
  };

  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    put({
      form,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        First name:
        <input
          type="text"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
        />
      </label>
      <label>
        Last name:
        <input
          type="text"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
        />
      </label>
      <button type="submit" disabled={isLoading}>
        Submit Person
      </button>
    </form>
  );
};
