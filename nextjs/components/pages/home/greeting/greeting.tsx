import React, { FunctionComponent } from "react";
import { useContext } from "react";
import Link from "next/link";
import { ChiselContext } from "../../../../hooks_generator/helpers/context";

export const Greeting: FunctionComponent = () => {
  const chisel = useContext(ChiselContext);

  return chisel.user ? (
    <p>
      Hello, {chisel.user}. Click <Link href="/api/logout">here</Link> to log
      out.
    </p>
  ) : (
    <p>
      Hello, anonymous. Click <Link href={chisel.loginLink}>here</Link> to log
      in.
    </p>
  );
};
