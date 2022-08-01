import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SignInModal from "./SignInModal";
import { typeInput } from "../../utils/inputTest";

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

  it("submits form values", async () => {
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

    await typeInput("Username", username);
    await typeInput("Password", password);
    const signInButton = screen.getAllByText("Sign In")[1];
    await userEvent.click(signInButton!);

    expect(onSignIn).toHaveBeenCalledWith(
      {
        username,
        password,
      },
      expect.anything()
    );
  });
});
