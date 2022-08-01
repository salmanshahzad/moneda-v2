import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SignUpModal from "./SignUpModal";
import { typeInput } from "../../utils/inputTest";

describe("SignUpModal", () => {
  it("displays errors", () => {
    const errors = {
      username: "Username is required",
      password: "Password is required",
      confirmPassword: "Confirm password is required",
    };

    render(
      <SignUpModal
        isOpen={true}
        onClose={() => {}}
        errors={errors}
        onSignUp={() => {}}
      />
    );

    for (const error of Object.values(errors)) {
      expect(screen.getByText(error)).toBeInTheDocument();
    }
  });

  it("submits form values", async () => {
    const username = "username";
    const password = "password";
    const confirmPassword = "confirmPassword";
    const onSignUp = jest.fn();

    render(
      <SignUpModal
        isOpen={true}
        onClose={() => {}}
        errors={{}}
        onSignUp={onSignUp}
      />
    );

    await typeInput("Username", username);
    await typeInput("Password", password);
    await typeInput("Confirm Password", confirmPassword);
    const signUpButton = screen.getAllByText("Sign Up")[1];
    await userEvent.click(signUpButton!);

    expect(onSignUp).toHaveBeenCalledWith(
      {
        username,
        password,
        confirmPassword,
      },
      expect.anything()
    );
  });
});
