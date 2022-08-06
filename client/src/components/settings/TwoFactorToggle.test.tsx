import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import TwoFactorToggle from "./TwoFactorToggle";
import { typeInput } from "../../utils/inputTest";

describe("TwoFactorToggle", () => {
  it("opens the modal to enable 2FA", async () => {
    render(
      <TwoFactorToggle
        errors={{}}
        isEnabled={false}
        qrCode=""
        onEnable={async () => true}
        onDisable={async () => {}}
      />
    );

    const toggle = screen.getByRole("checkbox");
    await userEvent.click(toggle);

    expect(
      screen.getByText("Enable Two Factor Authentication")
    ).toBeInTheDocument();
  });

  it("displays errors in the modal", async () => {
    const errors = {
      token: "Token is invalid",
    };

    render(
      <TwoFactorToggle
        errors={errors}
        isEnabled={false}
        qrCode=""
        onEnable={async () => true}
        onDisable={async () => {}}
      />
    );

    const toggle = screen.getByRole("checkbox");
    await userEvent.click(toggle);

    for (const error of Object.values(errors)) {
      expect(screen.getByText(error)).toBeInTheDocument();
    }
  });

  it("enables 2FA", async () => {
    const token = "token";
    const onEnable = jest.fn(async () => true);

    render(
      <TwoFactorToggle
        errors={{}}
        isEnabled={false}
        qrCode=""
        onEnable={onEnable}
        onDisable={async () => {}}
      />
    );

    const toggle = screen.getByRole("checkbox");
    await userEvent.click(toggle);

    await typeInput("Token", token);
    const verifyButton = screen.getByRole("button", { name: "Verify" });
    await userEvent.click(verifyButton);

    expect(onEnable).toHaveBeenCalledWith({ token });
  });

  it("disables 2FA", async () => {
    const onDisable = jest.fn(async () => {});

    render(
      <TwoFactorToggle
        errors={{}}
        isEnabled={true}
        qrCode=""
        onEnable={async () => true}
        onDisable={onDisable}
      />
    );

    const toggle = screen.getByRole("checkbox");
    await userEvent.click(toggle);

    expect(onDisable).toHaveBeenCalled();
  });
});
