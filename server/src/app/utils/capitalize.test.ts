import capitalize from "./capitalize";

describe("capitalize", () => {
  it("capitalizes input", () => {
    expect(capitalize("hello world")).toBe("Hello world");
    expect(capitalize("")).toBe("");
  });
});
