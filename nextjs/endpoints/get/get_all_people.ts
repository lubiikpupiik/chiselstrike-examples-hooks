import { responseFromJson } from "@chiselstrike/api";
import { Person } from "../../types/types";

export default async function chisel(req) {
  if (req.method == "GET") {
    try {
      let resp_json: Person[] = [];
      await Person.cursor().forEach((p) => resp_json.push(p));
      return responseFromJson(resp_json);
    } catch (e) {
      return responseFromJson(e, 500);
    }
  }
  return responseFromJson("Only GET is allowed", 405);
}
