import {
  ActionIcon,
  Button,
  ButtonVariant,
  Group,
  Image,
  Menu,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Logout,
  Menu2,
  Settings,
  User,
} from "tabler-icons-react";

function Nav(): JSX.Element {
  const links = [
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard /> },
  ];
  const accountLinks = [
    { href: "/settings", label: "Settings", icon: <Settings /> },
    { href: "/signout", label: "Sign Out", icon: <Logout /> },
  ];

  const { colorScheme } = useMantineColorScheme();
  const [isUserMenuOpen, userMenuHandlers] = useDisclosure(false);
  const [isMobileMenuOpen, mobileMenuHandlers] = useDisclosure(false);
  const showMobileMenu = useMediaQuery("(max-width: 900px)");
  const location = useLocation();

  function getVariant(href: string): ButtonVariant {
    const isActive = location.pathname === href;
    switch (colorScheme) {
      case "light":
        return isActive ? "filled" : "subtle";
      case "dark":
        return isActive ? "white" : "subtle";
    }
  }

  return (
    <Group position="apart" p="xs" style={{ boxShadow: "0 5px 10px gray" }}>
      <Group>
        <Image src="https://placehold.co/35" height={35} width={35} />
        <Title order={2}>Moneda</Title>
      </Group>
      <Group>
        {showMobileMenu && (
          <Menu
            opened={isMobileMenuOpen}
            onClose={mobileMenuHandlers.close}
            shadow="md"
            width={200}
          >
            <Menu.Target>
              <ActionIcon onClick={mobileMenuHandlers.toggle}>
                <Menu2 />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              {[...links, ...accountLinks].map((link) => (
                <Menu.Item
                  key={link.href}
                  component={NavLink}
                  to={link.href}
                  icon={link.icon}
                >
                  {link.label}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        )}
        {!showMobileMenu && (
          <Group>
            {links.map((link) => (
              <Button
                key={link.href}
                component={NavLink}
                to={link.href}
                color="dark"
                leftIcon={link.icon}
                variant={getVariant(link.href)}
              >
                {link.label}
              </Button>
            ))}
            <Menu
              opened={isUserMenuOpen}
              onClose={userMenuHandlers.close}
              shadow="md"
              width={200}
            >
              <Menu.Target>
                <Button
                  color="dark"
                  leftIcon={<User />}
                  variant="subtle"
                  onClick={userMenuHandlers.toggle}
                >
                  Account
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                {accountLinks.map((link) => (
                  <Menu.Item
                    key={link.href}
                    component={NavLink}
                    to={link.href}
                    icon={link.icon}
                  >
                    {link.label}
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>
          </Group>
        )}
      </Group>
    </Group>
  );
}

export default Nav;
