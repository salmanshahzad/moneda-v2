import dayjs from "dayjs";
import { dateTransformer, moneyTransformer } from "./transformers";

describe("transformers", () => {
  it("transforms dates", () => {
    const date = "1999-02-02";
    const dateObj = dayjs(date, "YYYY-MM-DD").toDate();
    expect(dateTransformer.from(date)).toEqual(dateObj);
    expect(dateTransformer.to(dateObj)).toBe(date);
  });

  it("transforms money", () => {
    expect(moneyTransformer.from("$1.23")).toBe(1.23);
    expect(moneyTransformer.to(1.23)).toBe("1.23");
  });
});
