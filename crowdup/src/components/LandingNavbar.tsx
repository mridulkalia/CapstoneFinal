import {
  Box,
  BoxProps,
  Burger,
  Button,
  ButtonProps,
  Center,
  Collapse,
  Container,
  createStyles,
  Divider,
  Drawer,
  Flex,
  getStylesRef,
  Group,
  Header,
  rem,
  ScrollArea,
  Text,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import {
  IconAugmentedReality,
  IconCat,
  IconChevronDown,
  IconClipboardHeart,
  IconDeviceTv,
  IconFireHydrant,
  IconHeartHandshake,
  IconLeaf,
  IconReportMoney,
  IconSearch,
  IconSos,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { BrandName, SearchDrawer } from "./index";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthProvider"; // Import the useAuth hook

const useStyles = createStyles((theme) => ({
  link: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    textDecoration: "none",
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontWeight: 500,
    fontSize: theme.fontSizes.sm,

    [theme.fn.smallerThan("md")]: {
      height: rem(42),
      display: "flex",
      alignItems: "center",
      width: "100%",
    },

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.primary[6],
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
      fontWeight: 600,

      [`& .${getStylesRef("icon")}`]: {
        color: theme.colorScheme === "dark" ? theme.black : theme.white,
      },
    },
  },
  logoutButton: {
    "&:hover": {
      backgroundColor: theme.colors.red[6], // Set hover color to red
      color: theme.white, // Set text color to white for better contrast
    },
  },

  subLink: {
    width: "100%",
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    borderRadius: theme.radius.md,

    ...theme.fn.hover({
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[7]
          : theme.colors.primary[0],
    }),

    "&:active": theme.activeStyles,
  },

  dropdownFooter: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : theme.colors.gray[0],
    margin: `calc(${theme.spacing.md} * -1)`,
    marginTop: theme.spacing.sm,
    padding: `${theme.spacing.md} calc(${theme.spacing.md} * 2)`,
    paddingBottom: theme.spacing.xl,
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[1]
    }`,
  },

  title: {
    textAlign: "center",
    fontWeight: 800,
    fontSize: rem(40),
    letterSpacing: -1,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    marginBottom: theme.spacing.xs,

    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(28),
      textAlign: "left",
    },
  },

  highlight: {
    color:
      theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 6],
  },

  linkIcon: {
    ref: getStylesRef("icon"),
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[2]
        : theme.colors.secondary[6],
  },

  hiddenMobile: {
    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },

  hiddenDesktop: {
    [theme.fn.largerThan("md")]: {
      display: "none",
    },
  },
}));

const mockdata = [
  {
    icon: IconClipboardHeart,
    title: "Medical",
  },
  {
    icon: IconSos,
    title: "Emergency",
  },
  {
    icon: IconLeaf,
    title: "Environment",
  },
  {
    icon: IconHeartHandshake,
    title: "Nonprofit",
  },
  {
    icon: IconReportMoney,
    title: "Financial emergency",
  },
  {
    icon: IconCat,
    title: "Animals",
  },
  {
    icon: IconFireHydrant,
    title: "Crisis Relief",
  },
  {
    icon: IconAugmentedReality,
    title: "Technology",
  },
  {
    icon: IconDeviceTv,
    title: "Film & Videos",
  },
];

interface IProps extends BoxProps {
  compressed?: boolean;
}

const LandingNavbar = ({ compressed }: IProps) => {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const [
    searchOpened,
    { toggle: toggleSearchDrawer, close: closeSearchDrawer },
  ] = useDisclosure(false);
  const { classes, theme } = useStyles();
  const [stickyClass, setStickyClass] = useState(false);
  const matchesMobile = useMediaQuery("(max-width: 768px)");
  const [role, setRole] = useState<string | null>(null);

  // Fetch role from local storage
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  const links = mockdata.map((item) => (
    <UnstyledButton className={classes.subLink} key={item.title}>
      <Group noWrap align="center">
        <ThemeIcon size={34} variant="default" radius="md">
          <item.icon
            size={rem(22)}
            stroke={1.5}
            color={theme.fn.primaryColor()}
          />
        </ThemeIcon>
        <div>
          <Text size="sm" fw={500}>
            {item.title}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  ));

  const buttonProps: ButtonProps = {
    variant: "subtle",
    radius: matchesMobile ? "sm" : 0,
  };

  const stickNavbar = () => {
    if (window !== undefined) {
      const windowHeight = window.scrollY;
      windowHeight > 240 ? setStickyClass(true) : setStickyClass(false);
    }
  };

  const handleLogout = () => {
    localStorage.setItem("isAuthenticated", "false");
    window.location.href = "/login";
  };

  useEffect(() => {
    window.addEventListener("scroll", stickNavbar);

    return () => {
      window.removeEventListener("scroll", stickNavbar);
    };
  }, []);

  return (
    <Box
      mt={compressed ? (stickyClass ? 0 : "xl") : 0}
      sx={{
        transition: "all ease 150ms",
        position: "fixed",
        top: "3%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 2,
        margin: "auto",
        width: compressed ? (stickyClass ? "100%" : "85%") : "100%",
        boxShadow: theme.shadows.sm,
      }}
    >
      <Header
        height={60}
        px="md"
        sx={{
          backgroundColor: stickyClass
            ? "rgba( 255, 255, 255, .9 )"
            : theme.white,
          backdropFilter: "blur(4px)",
          borderRadius: stickyClass ? 0 : theme.radius.sm,
        }}
      >
        <Container size="lg" fluid={compressed} sx={{ height: "100%" }}>
          <Flex justify="space-between" align="center" sx={{ height: "100%" }}>
            <BrandName size={28} asLink />
            <Flex
              align="center"
              gap="xs"
              sx={{ height: "100%" }}
              className={classes.hiddenMobile}
            >
              <Button
                component={Link}
                to="/disaster-preparedness"
                className={classes.link}
                {...buttonProps}
              >
                Disaster Info
              </Button>
              <Button
                component={Link}
                to="/hospitals-ngos"
                className={classes.link}
                {...buttonProps}
              >
                Donate Hospitals
              </Button>
              <Button
                component={Link}
                to="/campaigns"
                className={classes.link}
                {...buttonProps}
              >
                Campaigns
              </Button>
              {role !== "ngo_hospital" && role != "admin" && (
                <Button
                  component={Link}
                  to="/registerResource"
                  className={classes.link}
                  {...buttonProps}
                >
                  Register as Resource
                </Button>
              )}
              {role !== "user" && role != "admin" && (
                <Button
                  component={Link}
                  to="/inventory"
                  className={classes.link}
                  {...buttonProps}
                >
                  Inventory
                </Button>
              )}

              {role === "admin" || role === "ngo_hospital" ? (
                <>
                  <Button
                    component={Link}
                    // to="/create-campaign"
                    to="https://66c8d897bab988f37a398006--merry-alpaca-edbce1.netlify.app/"
                    className={classes.link}
                    {...buttonProps}
                  >
                    Start a campaign
                  </Button>
                  <Button
                    component={Link}
                    to="/all-resources"
                    className={classes.link}
                    {...buttonProps}
                  >
                    View Resources
                  </Button>
                  {role === "admin" && (
                    <Button
                      component={Link}
                      to="/dashboard"
                      className={classes.link}
                      {...buttonProps}
                    >
                      My dashboard
                    </Button>
                  )}
                </>
              ) : null}
              <Button
                className={`${classes.link} ${classes.logoutButton}`}
                onClick={handleLogout}
                {...buttonProps}
              >
                Logout
              </Button>
            </Flex>
            <Burger
              opened={drawerOpened}
              onClick={toggleDrawer}
              className={classes.hiddenDesktop}
            />
          </Flex>
        </Container>
      </Header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        className={classes.hiddenDesktop}
        zIndex={1000000}
      >
        <ScrollArea h={`calc(100vh - ${rem(0)})`} mx="-md">
          <Divider
            my="sm"
            color={theme.colorScheme === "dark" ? "dark.5" : "gray.1"}
          />

          <Button
            component={Link}
            to="/"
            className={classes.link}
            {...buttonProps}
          >
            Home
          </Button>
          <Button
            component={Link}
            to="/campaigns"
            className={classes.link}
            {...buttonProps}
          >
            Campaigns
          </Button>
          <UnstyledButton className={classes.link} onClick={toggleLinks}>
            <Center inline>
              <Box component="span" mr={5}>
                Invest
              </Box>
              <IconChevronDown size={16} className={classes.linkIcon} />
            </Center>
          </UnstyledButton>
          <Collapse in={linksOpened}>{links}</Collapse>

          {role === "admin" || role === "ngo_hospital" ? (
            <>
              <Button
                component={Link}
                to="/create-campaign"
                className={classes.link}
                {...buttonProps}
              >
                Start a campaign
              </Button>
              <Button
                component={Link}
                to="/all-resources"
                className={classes.link}
                {...buttonProps}
              >
                View Resources
              </Button>
              {role === "admin" && (
                <Button
                  component={Link}
                  to="/dashboard"
                  className={classes.link}
                  {...buttonProps}
                >
                  My dashboard
                </Button>
              )}
            </>
          ) : null}
          <Button onClick={handleLogout}>Logout</Button>
          <Button
            leftIcon={<IconSearch size={18} />}
            onClick={() => {
              closeDrawer();
              toggleSearchDrawer();
            }}
            className={classes.link}
            {...buttonProps}
          >
            Search
          </Button>
        </ScrollArea>
      </Drawer>

      <SearchDrawer opened={searchOpened} onClose={closeSearchDrawer} />
    </Box>
  );
};

export default LandingNavbar;
