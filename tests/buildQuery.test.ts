import { buildQuery } from "../src/buildQuery";
import { HomeDSL } from "./dsl-home";

describe("buildQuery", () => {
  test("gera query válida", () => {
    const query = buildQuery(HomeDSL);
    console.log(query);

    expect(typeof query).toBe("string");
    expect(query.includes("route")).toBe(true);
    expect(query.includes("entity")).toBe(true);
    expect(query.includes("paragraphBanners")).toBe(true);
  });
});
