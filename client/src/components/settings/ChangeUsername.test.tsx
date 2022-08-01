import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ChangeUsername from "./ChangeUsername";
import { typeInput } from "../../utils/inputTest";

describe("ChangeUsername", () => {
  it("displays errors", () => {
    const errors = {
      username: "Username is required",
      password: "Password is required",
    };

    render(<ChangeUsername errors={errors} onChange={async () => true} />);

    for (const error of Object.values(errors)) {
      expect(screen.getByText(error)).toBeInTheDocument();
    }
  });

  it("submits form values", async () => {
    const username = "username";
    const password = "password";
    const onChange = jest.fn();

    render(<ChangeUsername errors={{}} onChange={onChange} />);

    await typeInput("New Username", username);
    await typeInput("Password", password);
    const button = screen.getByText("Change");
    await userEvent.click(button);

    expect(onChange).toHaveBeenCalledWith({
      username,
      password,
    });
  });
});
