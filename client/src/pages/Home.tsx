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

function Home(): JSX.Element {
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
              <Button variant="outline">Sign In</Button>
              <Button>Sign Up</Button>
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
