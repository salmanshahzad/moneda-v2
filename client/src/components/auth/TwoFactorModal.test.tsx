import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import TwoFactorModal from "./TwoFactorModal";
import { typeInput } from "../../utils/inputTest";

describe("TwoFactorModal", () => {
  it("displays errors", () => {
    const errors = {
      token: "Token is invalid",
    };

    render(
      <TwoFactorModal
        isOpen={true}
        onClose={() => {}}
        errors={errors}
        onVerify={() => {}}
      />
    );

    for (const error of Object.values(errors)) {
      expect(screen.getByText(error)).toBeInTheDocument();
    }
  });

  it("submits form values", async () => {
    const token = "token";
    const onVerify = jest.fn();

    render(
      <TwoFactorModal
        isOpen={true}
        onClose={() => {}}
        errors={{}}
        onVerify={onVerify}
      />
    );

    await typeInput("Token", token);
    const verifyButton = screen.getByText("Verify");
    await userEvent.click(verifyButton);

    expect(onVerify).toHaveBeenCalledWith({ token }, expect.anything());
  });
});
