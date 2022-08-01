import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ChangePassword from "./ChangePassword";
import { typeInput } from "../../utils/inputTest";

describe("ChangePassword", () => {
  it("displays errors", () => {
    const errors = {
      oldPassword: "Current password is required",
      password: "New password is required",
      confirmPassword: "Passwords do not match",
    };

    render(<ChangePassword errors={errors} onChange={async () => true} />);

    for (const error of Object.values(errors)) {
      expect(screen.getByText(error)).toBeInTheDocument();
    }
  });

  it("submits form values", async () => {
    const oldPassword = "password";
    const password = "password";
    const confirmPassword = "password";
    const onChange = jest.fn();

    render(<ChangePassword errors={{}} onChange={onChange} />);

    await typeInput("Current Password", oldPassword);
    await typeInput("New Password", password);
    await typeInput("Confirm New Password", confirmPassword);
    const button = screen.getByText("Change");
    await userEvent.click(button);

    expect(onChange).toHaveBeenCalledWith({
      oldPassword,
      password,
      confirmPassword,
    });
  });
});
