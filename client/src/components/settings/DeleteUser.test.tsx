import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import DeleteUser from "./DeleteUser";
import { typeInput } from "../../utils/inputTest";

describe("ChangePassword", () => {
  it("displays errors", async () => {
    const errors = {
      password: "Password is required",
    };

    render(<DeleteUser errors={errors} onDelete={() => {}} />);

    const button = screen.getByRole("button", { name: "Delete Account" });
    await userEvent.click(button);

    for (const error of Object.values(errors)) {
      expect(screen.getByText(error)).toBeInTheDocument();
    }
  });

  it("opens the confirmation modal", async () => {
    render(<DeleteUser errors={{}} onDelete={() => {}} />);

    const button = screen.getByRole("button", { name: "Delete Account" });
    await userEvent.click(button);

    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("calls onDelete", async () => {
    const password = "password";
    const onDelete = jest.fn();
    render(<DeleteUser errors={{}} onDelete={onDelete} />);

    const button = screen.getByRole("button", { name: "Delete Account" });
    await userEvent.click(button);

    await typeInput("Password", password);

    const deleteButton = screen.getByRole("button", { name: "Delete" });
    await userEvent.click(deleteButton);

    expect(onDelete).toHaveBeenCalledWith({ password }, expect.anything());
  });
});
