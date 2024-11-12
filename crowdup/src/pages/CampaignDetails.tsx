import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { ICampaign } from "../types";
import {
  Accordion,
  ActionIcon,
  Anchor,
  Avatar,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Grid,
  Group,
  Image,
  Loader,
  Modal,
  Paper,
  PaperProps,
  Progress,
  ScrollArea,
  Stack,
  Text,
  TextProps,
  Title,
  TitleProps,
  UnstyledButton,
  Table
} from "@mantine/core";
import {
  IconChevronDown,
  IconChevronUp,
  IconFlag,
  IconHeart,
  IconHeartFilled,
  IconSearch,
  IconSeparator,
  IconShare,
} from "@tabler/icons-react";
import { useDisclosure, useMediaQuery, useToggle } from "@mantine/hooks";
import {
  BackButton,
  DonationDrawer,
  NotFound,
  ShareModal,
  UserCard,
} from "../components";
import { Helmet } from "react-helmet";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { notifications } from "@mantine/notifications";
import { Link } from "react-router-dom";

interface Transaction {
  donorAddress: string;
  amount: number;
  date: string; // or Date, if you handle it as a Date object
  _id: string;

}



const CampaignDetailsPage = (): JSX.Element => {
  dayjs.extend(customParseFormat);
  const { id } = useParams<{ id: string }>(); // Get campaign ID from URL params
  const [campaign, setCampaign] = useState<ICampaign | undefined>(undefined);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [opened, { open, close }] = useDisclosure(false);
  const [donationsOpened, { open: openDonations, close: closeDonations }] =
    useDisclosure(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [transactionsLoading, setTransactionsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [sortAsc, setSortAsc] = useState<boolean>(true);
    const matchesMobile = useMediaQuery("(max-width: 768px)");
  
    const fetchTransactions = async () => {
      try {
        setTransactionsLoading(true);
        const response = await axios.get(
          `http://localhost:8000/campaigns/${campaignId}/transactions`
        );
        setTransactions(response.data.transactions);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setTransactionsLoading(false);
      }
    };

  // const [donateOpened, { open: donateOpen, close: donateClose }] =
  //   useDisclosure(false);
  const [following, setFollowing] = useToggle();

  const paperProps: PaperProps = {
    p: "md",
    shadow: "sm",
  };

  
  const titleProps: TitleProps = {
    size: 32,
    weight: 700,
    transform: "capitalize",
    sx: { lineHeight: "40px" },
  };

  const subTitleProps: TextProps = {
    size: 20,
    weight: 600,
    sx: { lineHeight: "28px" },
  };
  const { id: campaignId } = useParams(); // Extract the campaignId from URL params
  console.log("Campaign ID from URL:", campaignId); // Ensure this logs the correct ID



  const iconSize = 18;

  useEffect(() => {
    // Fetch campaign data from backend
    const fetchCampaign = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/campaigns/${id}`
        );
        console.log(response);
        setCampaign(response.data.campaign); // Set campaign data
        setLoading(false);
        setError(null); // Reset error state
      } catch (error) {
        setError("Failed to load campaign details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);
  const filteredTransactions = transactions.filter((transaction) =>
    transaction.donorAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedTransactions = filteredTransactions.sort((a, b) =>
    sortAsc ? new Date(a.date).getTime() - new Date(b.date).getTime() : new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const toggleSort = () => {
    setSortAsc(!sortAsc);
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text color="red">{error}</Text>;
  }
  if (loading) {
    return <Text>Loading...</Text>; // Display loading state
  }

  if (error) {
    return <Text color="red">{error}</Text>; // Display error message if fetch fails
  }
  // console.log(campaign?.title);
  const formattedDeadline = dayjs(campaign?.deadline).format(
    "YYYY-MM-DD HH:mm"
  );
  // const imageUrl = `http://localhost:8000/${campaign?.profilePicture.replace(
  //   /\\/g,
  //   "/"
  // )}`;
  const imageUrl = campaign?.profilePicture
  ? `http://localhost:8000/${campaign.profilePicture.replace(/\\/g, "/")}`
  : ''; // Default to an empty string or a fallback image if profilePicture is undefined

  // console.log(imageUrl);

  return (
    <>
      <Helmet>
        <title>{campaign?.title}</title>
      </Helmet>
      <Box>
        {campaign ? (
          <Container size="lg">
            <BackButton mb="md" />
            <Grid>
              <Grid.Col lg={8}>
                <Stack>
                  <Card padding="md" shadow="sm">
                    <Card.Section>
                      <Image src={imageUrl} height={480} />
                    </Card.Section>
                    <Stack mt="md">
                      <Title>{campaign?.title}</Title>
                      {!matchesMobile ? (
                        <Flex gap="xs" align="center">
                          <Text size="sm">Fundraise campaign created by</Text>
                          <UnstyledButton component={Anchor}>
                            <Flex gap="xs" align="center">
                              <Avatar src={imageUrl} radius="xl" size="sm" />
                              <Text size="sm">
                                {campaign?.contactPersonName}
                              </Text>
                            </Flex>
                          </UnstyledButton>
                          <IconSeparator size={18} />
                          <Text component={Anchor} size="sm">
                            {campaign?.location?.country}
                          </Text>
                          <IconSeparator size={18} />
                          <Text component={Anchor} size="sm">
                            {campaign?.campaignType}
                          </Text>
                        </Flex>
                      ) : (
                        <Stack>
                          <Flex gap="md">
                            <Text size="sm">Fundraise campaign created by</Text>
                            <UnstyledButton component={Anchor}>
                              <Flex gap="xs" align="center">
                                <Avatar src={imageUrl} radius="xl" size="sm" />
                                <Text size="sm">
                                  {campaign?.contactPersonName}
                                </Text>
                              </Flex>
                            </UnstyledButton>
                          </Flex>
                          <Group>
                            <Text size="sm">
                              Location -{" "}
                              <Anchor>{campaign?.location?.country}</Anchor>
                            </Text>
                            <Text size="sm">
                              Category -{" "}
                              <Anchor>{campaign?.campaignType}</Anchor>
                            </Text>
                          </Group>
                        </Stack>
                      )}
                      <Text {...subTitleProps}>Our story</Text>
                      <Text size="sm">{campaign?.description}</Text>
                      {matchesMobile && (
                        <>
                          <Divider />
                          <Flex align="flex-end" gap="sm">
                            <Title {...titleProps} align="center">
                              {campaign?.amount}
                            </Title>
                            <Text fw={500} align="center" color="dimmed">
                              raised of {campaign?.targetAmount}
                            </Text>
                          </Flex>

                          <Progress
                            value={
                              (campaign?.amount / campaign?.targetAmount) * 100
                            }
                            size="md"
                          />
                          <Flex justify="space-between">
                            <Text fw={500}>
                              {formattedDeadline} - {campaign?.amount} Funded
                            </Text>
                            <Text fw={500}>
                              {campaign?.contactPersonName} Donors
                            </Text>
                          </Flex>
                          <Flex align="center" gap="xs">
                            <Link to={`/campaigns/${campaign._id}/donate`}>
                              <Button fullWidth>Donate</Button>
                            </Link>

                            <ActionIcon
                              variant="subtle"
                              onClick={open}
                              color="blue"
                              title="Share with your friends"
                              size="lg"
                            >
                              <IconShare size={iconSize} />
                            </ActionIcon>
                            <ActionIcon
                              title={`${
                                following ? "Unfollow" : "Follow"
                              } this campaign`}
                              size="lg"
                              color={"secondary"}
                              onClick={() => {
                                setFollowing();
                                notifications.show({
                                  title: "Notification",
                                  message: `${
                                    following ? "Following" : "Unfollowed"
                                  } this campaign`,
                                  withBorder: true,
                                  styles: (theme) => ({
                                    root: {
                                      backgroundColor: theme.colors.blue[6],
                                      borderColor: theme.colors.blue[6],
                                      "&::before": {
                                        backgroundColor: theme.white,
                                      },
                                    },
                                    title: { color: theme.white },
                                    description: { color: theme.white },
                                    closeButton: {
                                      color: theme.white,
                                      "&:hover": {
                                        backgroundColor: theme.colors.blue[7],
                                      },
                                    },
                                  }),
                                });
                              }}
                            >
                              {following ? (
                                <IconHeartFilled size={iconSize} />
                              ) : (
                                <IconHeart size={iconSize} />
                              )}
                            </ActionIcon>
                          </Flex>
                        </>
                      )}
                    </Stack>
                  </Card>

                  <Paper {...paperProps}>
                    <Text {...subTitleProps} mb="sm">
                      Organizer
                    </Text>
                    <UserCard />
                  </Paper>
                  <Paper {...paperProps}>
                    <Text>
                      Created on {dayjs(campaign?.createdAt).format("LL")}
                    </Text>
                  </Paper>
                  {!matchesMobile && (
                    <Button
                      leftIcon={<IconFlag size={iconSize} />}
                      variant="subtle"
                      color="secondary"
                    >
                      Report campaign
                    </Button>
                  )}
                </Stack>
              </Grid.Col>
              <Grid.Col lg={4}>
                <Stack>
                  {!matchesMobile && (
                    <Paper {...paperProps}>
                      <Stack spacing="sm">
                        <Title {...titleProps} align="center">
                          {campaign?.amount}
                        </Title>
                        <Text fw={500} align="center" color="dimmed">
                          raised of {campaign?.targetAmount}
                        </Text>
                        <Progress
                          value={
                            (campaign?.amount / campaign?.targetAmount) * 100
                          }
                          size="md"
                        />
                        <Flex justify="space-between">
                          <Text fw={500}>
                            {formattedDeadline} <br />
                            Funded - {campaign?.amount}
                          </Text>
                          <Text fw={500}>
                            Donors - {campaign?.contactPersonName}
                          </Text>
                        </Flex>
                        <Link to={`/campaigns/${campaign._id}/donate`}>
                          <Button style={{ width: "100% " }} size="xl">
                            Donate
                          </Button>
                        </Link>
                        <Button
                          onClick={() => {
                            fetchTransactions();
                            openDonations();
                          }}
                          mt="md"
                        >
                          See all Donations
                        </Button>

                        <Button
                          leftIcon={<IconShare size={iconSize} />}
                          variant="outline"
                          onClick={open}
                          color="blue"
                        >
                          Share with friends
                        </Button>
                        <Button
                          leftIcon={
                            following ? (
                              <IconHeartFilled size={iconSize} />
                            ) : (
                              <IconHeart size={iconSize} />
                            )
                          }
                          variant={following ? "filled" : "subtle"}
                          color="secondary"
                          onClick={() => {
                            setFollowing();
                            notifications.show({
                              title: "Notification",
                              message: `${
                                following ? "Following" : "Unfollowed"
                              } this campaign`,
                              withBorder: true,
                              styles: (theme) => ({
                                root: {
                                  backgroundColor: theme.colors.blue[6],
                                  borderColor: theme.colors.blue[6],
                                  "&::before": { backgroundColor: theme.white },
                                },
                                title: { color: theme.white },
                                description: { color: theme.white },
                                closeButton: {
                                  color: theme.white,
                                  "&:hover": {
                                    backgroundColor: theme.colors.blue[7],
                                  },
                                },
                              }),
                            });
                          }}
                        >
                          {following ? "Unfollow" : "Follow"} this campaign
                        </Button>
                      </Stack>
                    </Paper>
                  )}
                  <Paper {...paperProps}>
                    <Text {...subTitleProps} mb="md">
                      Donation FAQ
                    </Text>
                    <Accordion defaultValue="customization" variant="separated">
                      <Accordion.Item value="customization">
                        <Accordion.Control>
                          When will {campaign?.contactPersonName} get my
                          payment?
                        </Accordion.Control>
                        <Accordion.Panel>
                          Your payment is sent directly to Dora so it
                          immediately helps their campaign.
                        </Accordion.Panel>
                      </Accordion.Item>
                      <Accordion.Item value="flexibility">
                        <Accordion.Control>
                          How secure is the payment process?
                        </Accordion.Control>
                        <Accordion.Panel>
                          Payments are made in a highly-secure environment. We
                          use industry leading technology (such as SSL) to keep
                          your information safe and encrypted.
                        </Accordion.Panel>
                      </Accordion.Item>
                    </Accordion>
                  </Paper>
                  {matchesMobile && (
                    <Button
                      leftIcon={<IconFlag size={iconSize} />}
                      variant="subtle"
                      color="secondary"
                    >
                      Report campaign
                    </Button>
                  )}
                </Stack>
              </Grid.Col>
            </Grid>
          </Container>
        ) : (
          <NotFound />
        )}

        <ShareModal
          opened={opened}
          onClose={close}
          campaign={campaign}
          iconSize={iconSize}
        />
        {/* <DonationDrawer
          campaign={campaign}
          // opened={donateOpened}
          // onClose={donateClose}
          iconSize={iconSize}
        /> */}
      </Box>
      <Modal
  opened={donationsOpened}
  onClose={closeDonations}
  title={
    <Text
      weight={600}
      size="lg"
      color="green"
      sx={{ borderBottom: '2px solid', paddingBottom: '5px' }}
    >
      Donations History
    </Text>
  }
  size="xl"
  centered
  overlayProps={{
    opacity: 0.55,
    blur: 3,
  }}
  transitionProps={{
    transition: 'scale',
    duration: 300,
    timingFunction: 'ease-in-out',
  }}
  styles={{
    header: {
      backgroundColor: '#f0f4ff',
      padding: '16px',
      borderRadius: '8px 8px 0 0',
    },
    body: {
      padding: '20px',
    },
  }}
>
  <ScrollArea style={{ maxHeight: '400px' }}>
    {/* Replace with your table or content */}
    <Text align="center" color="dimmed" size="sm">
      This section contains detailed information about past donations.
    </Text>
    <Divider my="sm" />
    <Table highlightOnHover striped withBorder>
      <thead>
        <tr>
          <th>Donor Address</th>
          <th>Amount</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td>{transaction.donorAddress}</td>
              <td>{transaction.amount}</td>
              <td>{new Date(transaction.date).toLocaleDateString()}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={3} align="center">
              No transactions found.
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  </ScrollArea>
</Modal>


    </>
  );
};

export default CampaignDetailsPage;
