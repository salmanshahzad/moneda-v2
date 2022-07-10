import { Center, Loader } from "@mantine/core";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import api from "../../api";
import useStore, { User } from "../../store";

type AuthState = "loading" | "unauthenticated" | "authenticated";

function AuthGuard(): JSX.Element {
  const [authState, setAuthState] = useState<AuthState>("loading");
  const location = useLocation();
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);

  useEffect(() => {
    if (user) {
      setAuthState("authenticated");
    } else {
      api
        .get("user")
        .then(({ data, status }) => {
          if (status === 200) {
            const { user } = data as { user: User };
            setUser(user);
            setAuthState("authenticated");
          } else {
            setAuthState("unauthenticated");
          }
        })
        .catch((err) => {
          console.error("Error getting user", err);
          setAuthState("unauthenticated");
        });
    }
  }, [user]);

  switch (authState) {
    case "loading":
      return (
        <Center style={{ height: "100vh" }}>
          <Loader size="xl" variant="dots" />
        </Center>
      );
    case "unauthenticated":
      return location.pathname === "/" ? (
        <Outlet />
      ) : (
        <Navigate to="/" replace state={{ from: location.pathname }} />
      );
    case "authenticated":
      return location.pathname === "/" ? (
        <Navigate to="/dashboard" replace />
      ) : (
        <Outlet />
      );
  }
}

export default AuthGuard;
