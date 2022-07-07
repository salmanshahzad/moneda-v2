import { fireEvent, render, screen } from "@testing-library/react";

import SignInModal from "./SignInModal";

describe("SignInModal", () => {
  it("displays errors", () => {
    const errors = {
      username: "Username is required",
      password: "Password is required",
    };

    render(
      <SignInModal
        isOpen={true}
        onClose={() => {}}
        errors={errors}
        onSignIn={() => {}}
      />
    );

    for (const error of Object.values(errors)) {
      expect(screen.getByText(error)).toBeInTheDocument();
    }
  });

  it.skip("submits form values", () => {
    const username = "username";
    const password = "password";
    const onSignIn = jest.fn();

    render(
      <SignInModal
        isOpen={true}
        onClose={() => {}}
        errors={{}}
        onSignIn={onSignIn}
      />
    );

    // FIXME: RTL cannot find label
    const usernameInput = screen.getByLabelText("Username");
    fireEvent.change(usernameInput, { target: { value: username } });

    const passwordInput = screen.getByLabelText("Password");
    fireEvent.change(passwordInput, { target: { value: password } });

    const signInButton = screen.getByRole("button", { name: "Sign In" });
    fireEvent.click(signInButton);

    expect(onSignIn).toHaveBeenCalledWith({ username, password });
  });
});
