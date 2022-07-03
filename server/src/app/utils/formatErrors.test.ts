import Joi from "../utils/Joi";
import formatErrors from "./formatErrors";

describe("formatErrors", () => {
  it("formats errors for required fields", () => {
    const schema = Joi.object({
      foo: Joi.string().required(),
    });

    const { error } = schema.validate({});
    const errors = formatErrors(error!);
    expect(errors[0]?.key).toBe("foo");
    expect(errors[0]?.message).toBe("foo is required");
  });

  it("formats errors for empty strings", () => {
    const schema = Joi.object({
      foo: Joi.string().required(),
    });

    const { error } = schema.validate({ foo: "" });
    const errors = formatErrors(error!);
    expect(errors[0]?.key).toBe("foo");
    expect(errors[0]?.message).toBe("foo is required");
  });

  it("formats errors for strings", () => {
    const schema = Joi.object({
      foo: Joi.string().required(),
    });

    const { error } = schema.validate({ foo: 1 });
    const errors = formatErrors(error!);
    expect(errors[0]?.key).toBe("foo");
    expect(errors[0]?.message).toBe("foo must be a string");
  });
});
