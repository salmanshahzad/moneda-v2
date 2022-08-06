import {
  Anchor,
  Button,
  Container,
  Grid,
  Group,
  Image,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

import api from "../api";
import SignInModal, { SignInFields } from "../components/auth/SignInModal";
import SignUpModal, { SignUpFields } from "../components/auth/SignUpModal";
import TwoFactorModal, {
  TwoFactorFields,
} from "../components/auth/TwoFactorModal";
import useStore, { User } from "../store";

function Home(): JSX.Element {
  const [isSignInModalOpen, signInModalHandlers] = useDisclosure(false);
  const [signInErrors, setSignInErrors] = useState<Partial<SignInFields>>({});
  const [credentials, setCredentials] = useState<SignInFields>({
    username: "",
    password: "",
  });
  const [isTwoFactorModalOpen, twoFactorModalHandlers] = useDisclosure(false);
  const [twoFactorErrors, setTwoFactorErrors] = useState<
    Partial<TwoFactorFields>
  >({});
  const [isSignUpModalOpen, signUpModalHandlers] = useDisclosure(false);
  const [signUpErrors, setSignUpErrors] = useState<Partial<SignUpFields>>({});

  const setUser = useStore((state) => state.setUser);

  async function signIn(values: SignInFields): Promise<void> {
    setSignInErrors({});
    const { data, status } = await api.post("session", values);
    if (status === 200) {
      signInModalHandlers.close();
      const { user } = data as { user: User };
      if (user.isTwoFactorEnabled) {
        twoFactorModalHandlers.open();
        setCredentials(values);
      } else {
        setUser(user);
      }
    } else if (status === 401 || status === 422) {
      setSignInErrors(api.extractErrorMessages(data));
    }
  }

  async function onVerifyTwoFactor(values: TwoFactorFields): Promise<void> {
    setTwoFactorErrors({});
    const { data, status } = await api.post("session", {
      ...credentials,
      ...values,
    });
    if (status === 200) {
      twoFactorModalHandlers.close();
      const { user } = data as { user: User };
      setUser(user);
    } else if (status === 401) {
      setTwoFactorErrors(api.extractErrorMessages(data));
    }
  }

  async function signUp(values: SignUpFields): Promise<void> {
    setSignUpErrors({});
    const { data, status } = await api.post("user", values);
    if (status === 201) {
      signUpModalHandlers.close();
      const { user } = data as { user: User };
      setUser(user);
    } else if (status === 422) {
      setSignUpErrors(api.extractErrorMessages(data));
    }
  }

  return (
    <Container>
      <Grid align="center">
        <Grid.Col sm={6}>
          <Stack align="center">
            <Title style={{ fontSize: "4rem" }}>Moneda</Title>
            <Text size="xl" weight="bold">
              Take control of your finances
            </Text>
            <Group>
              <Button variant="outline" onClick={signInModalHandlers.open}>
                Sign In
              </Button>
              <Button onClick={signUpModalHandlers.open}>Sign Up</Button>
            </Group>
          </Stack>
        </Grid.Col>
        <Grid.Col sm={6}>
          <Stack align="center">
            <Image src="https://placehold.co/400" height={400} width={400} />
          </Stack>
        </Grid.Col>
      </Grid>
      <Grid justify="center">
        <Grid.Col sm={4}>
          <Feature />
        </Grid.Col>
        <Grid.Col sm={4}>
          <Feature />
        </Grid.Col>
        <Grid.Col sm={4}>
          <Feature />
        </Grid.Col>
      </Grid>
      <Text>
        &copy;2022{" "}
        <Anchor href="https://www.salmanshahzad.com" target="_blank">
          Salman Shahzad
        </Anchor>
      </Text>
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={signInModalHandlers.close}
        errors={signInErrors}
        onSignIn={signIn}
      />
      <TwoFactorModal
        isOpen={isTwoFactorModalOpen}
        onClose={twoFactorModalHandlers.close}
        errors={twoFactorErrors}
        onVerify={onVerifyTwoFactor}
      />
      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={signUpModalHandlers.close}
        errors={signUpErrors}
        onSignUp={signUp}
      />
    </Container>
  );
}

function Feature(): JSX.Element {
  return (
    <Stack align="center">
      <Image src="https://placehold.co/50" height={50} width={50} />
      <Text size="xl" weight="bold">
        Feature
      </Text>
      <Text>Description</Text>
    </Stack>
  );
}

export default Home;
