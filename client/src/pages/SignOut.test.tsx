import { render } from "@testing-library/react";

import api from "../api";
import SignOut from "./SignOut";

describe("SignOut", () => {
  it("signs out the user", () => {
    jest.spyOn(api, "delete").mockResolvedValueOnce({
      status: 204,
      headers: new Headers(),
      data: {},
    });
    render(<SignOut />);
    expect(api.delete).toHaveBeenCalledWith("session");
  });
});
