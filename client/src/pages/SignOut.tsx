import { useEffect } from "react";

import api from "../api";
import useStore from "../store";

function SignOut(): null {
  const setUser = useStore((state) => state.setUser);

  useEffect(() => {
    api.delete("session").then(() => {
      setUser(null);
    });
  }, []);

  return null;
}

export default SignOut;
