import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Title,
  Group,
  Avatar,
  Text,
  Button,
} from "@mantine/core";
import { DataTable } from "mantine-datatable";
import axios from "axios";

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

const AdminDashboard = () => {
  const [page, setPage] = useState(1);
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get("http://localhost:8000/resources");
        const filteredResources = response.data.filter(
          (resource: Resource) => resource.status === "pending"
        ); // Filter out resources that are not pending
        setResources(filteredResources);
      } catch (error) {
        console.error("Error fetching resources:", error);
      }
    };

    fetchResources();
  }, []);

  const handleStatusUpdate = async (resourceId: string, newStatus: string) => {
    try {
      await axios.put(`http://localhost:8000/resources/${resourceId}/status`, {
        status: newStatus,
      });
      setResources((prevResources) =>
        prevResources.map((resource) =>
          resource._id === resourceId
            ? { ...resource, status: newStatus }
            : resource
        )
      );
      setResources((prevResources) =>
        prevResources.filter((resource) => resource._id !== resourceId)
      );
    } catch (error) {
      console.error("Error updating resource status:", error);
    }
  };

  return (
    <Container size="fluid">
      <Paper shadow="sm" p="md">
        <Title order={2} mb="lg">
          Manage Resources
        </Title>
        <DataTable
          columns={[
            {
              accessor: "createdBy",
              render: (resource: Resource) => (
                <Group>
                  <Avatar
                    src={null}
                    alt={`${resource.firstName} ${resource.lastName} avatar`}
                    size="sm"
                    radius="xl"
                  />
                  <Text>{`${resource.firstName} ${resource.lastName}`}</Text>
                </Group>
              ),
            },
            { accessor: "email" },
            { accessor: "phone" },
            { accessor: "location" },
            { accessor: "resourceType" },
            {
              accessor: "status",
              render: (resource: Resource) => (
                <Group position="left" spacing="xs">
                  <Button
                    color="green"
                    onClick={() => handleStatusUpdate(resource._id, "accepted")}
                  >
                    Accept
                  </Button>
                  <Button
                    color="red"
                    onClick={() => handleStatusUpdate(resource._id, "rejected")}
                  >
                    Reject
                  </Button>
                </Group>
              ),
            },
          ]}
          records={resources}
          totalRecords={resources.length}
          recordsPerPage={PAGE_SIZE}
          page={page}
          onPageChange={(p) => setPage(p)}
          highlightOnHover
          verticalSpacing="sm"
        />
      </Paper>
    </Container>
  );
};

export default AdminDashboard;
