import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Title,
  Text,
  Button,
  Modal,
  Textarea,
  Group,
  Badge,
  Loader,
} from "@mantine/core";
import { DataTable } from "mantine-datatable";
import axios from "axios";
import { showNotification } from "@mantine/notifications";

interface Resource {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  resourceType: string;
  status: string;
}

const PAGE_SIZE = 10;

const ResourcesPage = () => {
  const [page, setPage] = useState(1);
  const [resources, setResources] = useState<Resource[]>([]);
  const [opened, setOpened] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8000/resources");
        const approvedResources = response.data.filter(
          (resource: Resource) => resource.status === "accepted"
        );
        setResources(approvedResources);
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const openContactModal = (resource: Resource) => {
    setSelectedResource(resource);
    setOpened(true);
  };

  const handleSendProposal = async () => {
    if (selectedResource) {
      const emailContent = `
        <p>Dear ${selectedResource.firstName} ${selectedResource.lastName},</p>
        <p>We are pleased to inform you that your organization, ${selectedResource.resourceType}, has been reviewed and approved by our team. We are excited about the opportunity to work with you and support your initiatives.</p>
        <p>Here are the details of your organization:</p>
        <ul>
          <li><strong>Organization Name:</strong> ${selectedResource.resourceType}</li>
          <li><strong>Location:</strong> ${selectedResource.location}</li>
          <li><strong>Contact Person:</strong> ${selectedResource.firstName} ${selectedResource.lastName}</li>
          <li><strong>Contact Email:</strong> ${selectedResource.email}</li>
          <li><strong>Contact Phone:</strong> ${selectedResource.phone}</li>
          <li><strong>Additional Information:</strong> [Add any additional details here]</li>
        </ul>
        <p>If you have any questions or need further assistance, please do not hesitate to contact us at contact@yourorganization.com.</p>
        <p>Thank you for your dedication and support.</p>
        <p>Best regards,</p>
        <p>John Doe</p>
        <p>Coordinator</p>
        <p>Your Organization</p>
        <p>contact@yourorganization.com</p>
      `;
  
      try {
        await axios.post("http://localhost:8000/send-email", {
          to: selectedResource.email,
          subject: "Proposal from NGO",
          message: emailContent,
        });
        showNotification({
          title: "Success",
          message: "Proposal sent successfully!",
          color: "green",
        });
        setOpened(false);
        setMessage(""); // Clear the message
      } catch (error) {
        console.error("Error sending email:", error);
        showNotification({
          title: "Error",
          message: "Failed to send proposal.",
          color: "red",
        });
      }
    }
  };

  return (
    <Container size="xl" style={{ backgroundColor: "#f4f7fb", paddingBottom: "3rem" }}>
      <Paper shadow="lg" p="md" style={{ borderRadius: "10px" }}>
        <Title order={2} mb="lg" align="center">
          Approved Resources
        </Title>
        
        {loading ? (
          <Group position="center">
            <Loader size="xl" color="teal" />
          </Group>
        ) : (
          <DataTable
            columns={[
              {
                accessor: "fullName",
                title: "Name",
                render: (resource: Resource) => (
                  <Text weight={500}>{`${resource.firstName} ${resource.lastName}`}</Text>
                ),
              },
              { accessor: "email", title: "Email" },
              { accessor: "phone", title: "Phone" },
              { accessor: "location", title: "Location" },
              { accessor: "resourceType", title: "Resource Type" },
              {
                accessor: "status",
                title: "Status",
                render: (resource: Resource) => (
                  <Badge color="green" variant="light">
                    {resource.status}
                  </Badge>
                ),
              },
              {
                accessor: "contact",
                title: "Contact",
                render: (resource: Resource) => (
                  <Button
                    onClick={() => openContactModal(resource)}
                    color="gradient"
                    variant="filled"
                    size="sm"
                    radius="xl"
                  >
                    Contact
                  </Button>
                ),
              },
            ]}
            records={resources}
            totalRecords={resources.length}
            recordsPerPage={PAGE_SIZE}
            page={page}
            onPageChange={(p) => setPage(p)}
            highlightOnHover
            withBorder
            verticalSpacing="xs"
            classNames={{
              root: 'custom-root',  // Apply custom styles to the root element
              header: 'custom-header', // Add custom class for header styling
              footer: 'custom-footer', // Optional, if you want to customize footer
              pagination: 'custom-pagination', // Optional, for pagination styling
            }}
            rowClassName="custom-row" // Apply a custom class for the rows
          />
        )}
      </Paper>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Send Proposal"
        size="lg"
        centered
      >
        <Textarea
          placeholder="Write your message here..."
          minRows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ marginBottom: "1rem" }}
        />
        <Group position="right" mt="md">
          <Button
            onClick={handleSendProposal}
            color="teal"
            size="md"
            radius="xl"
            style={{ marginRight: "1rem" }}
          >
            Send Proposal
          </Button>
          <Button onClick={() => setOpened(false)} color="gray" size="md" radius="xl">
            Cancel
          </Button>
        </Group>
      </Modal>
    </Container>
  );
};

export default ResourcesPage;
