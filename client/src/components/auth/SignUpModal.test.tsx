import { fireEvent, render, screen } from "@testing-library/react";

import SignUpModal from "./SignUpModal";

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

  it.skip("submits form values", () => {
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

    // FIXME: RTL cannot find label
    const usernameInput = screen.getByLabelText("Username");
    fireEvent.change(usernameInput, { target: { value: username } });

    const passwordInput = screen.getByLabelText("Password");
    fireEvent.change(passwordInput, { target: { value: password } });

    const confirmPasswordInput = screen.getByLabelText("Confirm Password");
    fireEvent.change(confirmPasswordInput, {
      target: { value: confirmPassword },
    });

    const signUpButton = screen.getByRole("button", { name: "Sign Up" });
    fireEvent.click(signUpButton);

    expect(onSignUp).toHaveBeenCalledWith({
      username,
      password,
      confirmPassword,
    });
  });
});
