import {
  Box,
  Button,
  Card,
  Container,
  createStyles,
  Flex,
  Group,
  Paper,
  PaperProps,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title,
  TitleProps,
  Modal,
  ScrollArea,
  Notification,
} from "@mantine/core";
import {
  IconArrowDownRight,
  IconArrowUpRight,
  IconFunction,
  IconPlus,
  IconReceipt2,
  IconTrophy,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import AdminDashboard from "../components/AdminDashboard";
import { showNotification } from "@mantine/notifications";
import { DonatorsTable } from "../components";
import DisasterAdminPanel from "../components/DisasterAdminPortal";

const useStyles = createStyles((theme) => ({
  root: {
    padding: `calc(${theme.spacing.xl} * 1.5)`,
  },
  value: {
    fontSize: theme.fontSizes.xl,
    fontWeight: 700,
    lineHeight: 1,
  },
  diff: {
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
  },
  icon: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[3]
        : theme.colors.gray[5],
  },
  title: {
    fontWeight: 700,
    textTransform: "uppercase",
  },
  table: {
    minWidth: 800,
  },
  modalTitle: {
    fontWeight: 700,
    marginBottom: theme.spacing.md,
  },
  modalContent: {
    whiteSpace: "pre-wrap",
  },
  modalSection: {
    marginBottom: theme.spacing.md,
  },
  detailLabel: {
    fontWeight: 700,
    marginRight: theme.spacing.sm,
  },
  detailValue: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.gray[7],
  },
}));

interface Organization {
  _id: string;
  name: string;
  status: string;
  details: string;
  address?: string;
  contactNumber?: string;
  email?: string;
  website?: string;
}

const DashboardPage = () => {
  const { classes } = useStyles();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrganization, setSelectedOrganization] =
    useState<Organization | null>(null);
  const [statusOptions] = useState([
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/get-ngo-hospital-list"
        );
        setOrganizations(response.data.data);
      } catch (error) {
        console.error("Failed to fetch organizations", error);
      }
    };

    fetchOrganizations();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/update-ngo-hospital-status",
        {
          id,
          status: newStatus,
        }
      );

      if (response.status === 200) {
        showNotification({
          title: "Success",
          message: "Status updated successfully",
          color: "green",
        });

        if (newStatus === "approved") {
          setOrganizations((prevOrganizations) =>
            prevOrganizations.filter((org) => org._id !== id)
          );
        } else {
          setOrganizations((prevOrganizations) =>
            prevOrganizations.map((org) =>
              org._id === id ? { ...org, status: newStatus } : org
            )
          );
        }
      }
    } catch (error) {
      console.error("Failed to update status", error);
      showNotification({
        title: "Error",
        message: "Failed to update status",
        color: "red",
      });
    }
  };

  const openModal = (org: Organization) => {
    setSelectedOrganization(org);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedOrganization(null);
  };

  const paperProps: PaperProps = {
    p: "md",
    shadow: "sm",
  };

  const subTitleProps: TitleProps = {
    size: 18,
    mb: "sm",
  };

  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Admin Dashboard
      </h1>
      <AdminDashboard />
      <Box>
        <Container fluid my="xl">
          <Stack spacing="xl">
            <SimpleGrid
              cols={4}
              breakpoints={[
                { maxWidth: "md", cols: 2, spacing: "md" },
                { maxWidth: "sm", cols: 1, spacing: "sm" },
              ]}
            >
              {/* Your Statistics Cards */}
            </SimpleGrid>
            <Paper {...paperProps}>
              <Card.Section mb="lg">
                <Flex align="center" justify="space-between">
                  <Box>
                    <Title {...subTitleProps}>Organizations</Title>
                    <Text size="sm">Review and manage the organizations</Text>
                  </Box>

                  <Button
                    leftIcon={<IconPlus size={18} />}
                    component={Link}
                    to="/create-campaign"
                  >
                    Create a Campaign
                  </Button>
                </Flex>
              </Card.Section>
              <Card.Section>
                <ScrollArea>
                  <Table className={classes.table} highlightOnHover>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {organizations.map((org) => (
                        <tr key={org._id}>
                          <td>
                            <Button
                              variant="subtle"
                              onClick={() => openModal(org)}
                            >
                              {org.name}
                            </Button>
                          </td>
                          <td>
                            <Select
                              value={org.status}
                              onChange={(value) =>
                                handleStatusChange(org._id, value as string)
                              }
                              data={statusOptions}
                              placeholder="Change Status"
                            />
                          </td>
                          <td>
                            <Button
                              onClick={() =>
                                handleStatusChange(org._id, "approved")
                              }
                              color="green"
                            >
                              Approve
                            </Button>
                            <Button
                              onClick={() =>
                                handleStatusChange(org._id, "rejected")
                              }
                              color="red"
                              ml="xs"
                            >
                              Reject
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </ScrollArea>
              </Card.Section>
            </Paper>
            <Paper {...paperProps}>
              <Card.Section>
                <Title {...subTitleProps}>Alert System</Title>
                <DisasterAdminPanel />
              </Card.Section>
              <Card.Section></Card.Section>
            </Paper>
            <Paper {...paperProps}>
              <Card.Section>
                <Title {...subTitleProps}>Top Contributors</Title>
                <DonatorsTable />
              </Card.Section>
              <Card.Section></Card.Section>
            </Paper>
          </Stack>
        </Container>

        {selectedOrganization && (
          <Modal
            opened={modalOpen}
            onClose={closeModal}
            title={
              <Title className={classes.modalTitle}>
                {selectedOrganization.name}
              </Title>
            }
            size="lg"
          >
            <div className={classes.modalContent}>
              <Text className={classes.modalSection}>
                <span className={classes.detailLabel}>Name:</span>
                <span className={classes.detailValue}>
                  {selectedOrganization.name}
                </span>
              </Text>
              <Text className={classes.modalSection}>
                <span className={classes.detailLabel}>Status:</span>
                <span className={classes.detailValue}>
                  {selectedOrganization.status}
                </span>
              </Text>
              <Text className={classes.modalSection}>
                <span className={classes.detailLabel}>Details:</span>
                <span className={classes.detailValue}>
                  {selectedOrganization.details}
                </span>
              </Text>
              {selectedOrganization.address && (
                <Text className={classes.modalSection}>
                  <span className={classes.detailLabel}>Address:</span>
                  <span className={classes.detailValue}>
                    {selectedOrganization.address}
                  </span>
                </Text>
              )}
              {selectedOrganization.contactNumber && (
                <Text className={classes.modalSection}>
                  <span className={classes.detailLabel}>Contact Number:</span>
                  <span className={classes.detailValue}>
                    {selectedOrganization.contactNumber}
                  </span>
                </Text>
              )}
              {selectedOrganization.email && (
                <Text className={classes.modalSection}>
                  <span className={classes.detailLabel}>Email:</span>
                  <span className={classes.detailValue}>
                    {selectedOrganization.email}
                  </span>
                </Text>
              )}
              {selectedOrganization.website && (
                <Text className={classes.modalSection}>
                  <span className={classes.detailLabel}>Website:</span>
                  <span className={classes.detailValue}>
                    <a
                      href={selectedOrganization.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {selectedOrganization.website}
                    </a>
                  </span>
                </Text>
              )}
            </div>
          </Modal>
        )}
      </Box>
    </>
  );
};

export default DashboardPage;
