import {
  Badge,
  Card,
  createStyles,
  Flex,
  getStylesRef,
  Group,
  Image,
  PaperProps,
  Progress,
  Stack,
  Text,
} from "@mantine/core";
import { ICampaign } from "../types";
import { Link } from "react-router-dom";

const useStyles = createStyles((theme) => ({
  card: {
    position: "relative",
    padding: theme.spacing.lg,
    backdropFilter: `blur(16px) saturate(180%)`,
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[7]
        : `rgba(255, 255, 255, 0.75)`,
    border: `2px solid rgba(209, 213, 219, 0.3)`,

    [`&:hover .${getStylesRef("image")}`]: {
      transform: "scale(1.03)",
    },

    "&:hover": {
      boxShadow: theme.shadows.xl,
      border: `2px solid ${theme.colors.primary[7]}`,
      backgroundColor: theme.colors.primary[0],
      transition: "all 150ms ease",
    },
  },

  title: {
    marginTop: theme.spacing.md,
  },

  image: {
    ref: getStylesRef("image"),
    transition: "transform 150ms ease",
  },
}));

interface IProps extends PaperProps {
  data: ICampaign;
  showActions?: boolean;
}

const CampaignCard = ({ data, showActions }: IProps) => {
  const { classes } = useStyles();

  // Use optional chaining to prevent errors if location is undefined
  const {
    profilePicture,
    _id,
    title,
    description,
    amount,
    deadline,
    location, // Keep the whole location object
    organizationName,
    organizationEmail,
    contactPersonName,
    campaignType,
  } = data;

  // Handle case where location or country might be missing
  const country = location?.country || "Unknown Country"; // Fallback for missing country
  const city = location?.city || "Unknown City"; // Fallback for missing city

  const linkProps = {
    to: `/campaigns/${_id}`,
    rel: "noopener noreferrer",
  };
  const imageUrl = profilePicture
    ? `http://localhost:8000/${profilePicture.replace(/\\/g, "/")}`
    : "path/to/fallback-image.jpg";

  return (
    <Card
      radius="sm"
      shadow="md"
      ml="xs"
      component={Link}
      {...linkProps}
      className={classes.card}
    >
      <Card.Section>
        <Image
          src={imageUrl}
          height={280}
          className={classes.image}
          alt={`${title} image`}
        />
      </Card.Section>

      <Card.Section pt={0} px="md" pb="md">
        <Stack>
          <Text className={classes.title} lineClamp={1} fw={500} size="lg">
            {title}
          </Text>

          <Group position="apart">
            <Text size="xs" transform="uppercase" color="dimmed" fw={700}>
              {country}
            </Text>
            <Badge variant="dot" color="secondary">
              {campaignType}
            </Badge>
          </Group>

          {showActions && (
            <Text lineClamp={3} size="sm">
              {description}
            </Text>
          )}

          <Progress value={deadline} />

          <Flex justify="space-between">
            <Text>
              <b>{amount}</b> raised
            </Text>
            <Text>
              <b>{contactPersonName}</b> donations
            </Text>
          </Flex>
        </Stack>
      </Card.Section>
    </Card>
  );
};

export default CampaignCard;
