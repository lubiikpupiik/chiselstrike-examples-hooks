import React from "react";
import { getChiselStrikeClient } from "@chiselstrike/frontend";
import { withSessionSsr } from "../lib/withSession";
import { ChiselContext } from "../hooks_generator/helpers/context";
import { HomePage } from "../components/pages/home/home";

export const getServerSideProps = withSessionSsr(
  async function getServerSideProps(context) {
    const chisel = await getChiselStrikeClient(
      context.req.session,
      context.query
    );
    return { props: { chisel } };
  }
);

export default function Home({ chisel }) {
  return (
    <ChiselContext.Provider value={chisel}>
      <HomePage />
    </ChiselContext.Provider>
  );
}
