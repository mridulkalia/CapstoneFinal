import { useState } from "react";
import {
  Container,
  Paper,
  SimpleGrid,
  Stack,
  TextInput,
  Textarea,
  Button,
  Title,
  Checkbox,
  Modal,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import axios from "axios";
import { Navigate } from "react-router-dom";

interface FormValues {
  name: string;
  registrationNumber: string;
  contactPerson: string;
  contactPersonPhone: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  city: string;
  country: string;
  agreeToTerms: boolean;
}

const AddOrganizationPage = () => {
  const [modalOpened, setModalOpened] = useState(false);
  const [navigateToSignup, setNavigateToSignup] = useState(false);

  const form = useForm({
    initialValues: {
      name: "",
      registrationNumber: "",
      contactPerson: "",
      contactPersonPhone: "",
      email: "",
      phone: "",
      address: "",
      description: "",
      city: "",
      country: "",
      agreeToTerms: false,
    },
    validate: {
      name: (value) => (value ? null : "Organization name is required"),
      registrationNumber: (value) =>
        value ? null : "Registration number is required",
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      agreeToTerms: (value) => (value ? null : "You must agree to the terms"),
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/add-ngo-hospital",
        values
      );

      if (response.status === 201) {
        showNotification({
          title: "Submission Successful",
          message: "Your organization has been submitted for review.",
          color: "green",
        });
        setModalOpened(true);
        showNotification({
          title: "Submission Successful",
          message: "Your organization has been submitted for review.",
          color: "green",
        });
        
      }
    } catch (error) {
      showNotification({
        title: "Submission Failed",
        message: "An error occurred during submission. Please try again.",
        color: "red",
      });
    }
  };

  if (navigateToSignup) {
    return <Navigate to="/login-ngo-hospital" />;
  }

  return (
    <Container my={45}>
      <Title
        align="center"
        mb="xl"
        style={{ color: "#276749", fontWeight: 800, fontSize: 45 }}
      >
        Register Organization
      </Title>
      <Paper
        withBorder
        shadow="xl"
        p={30}
        radius="lg"
        sx={{
          borderColor: "#276749",
          backgroundColor: "#eaf6f0",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)", // Added custom shadow
        }}
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack spacing="md">
            <SimpleGrid cols={2} spacing="md">
              <TextInput
                label={
                  <span>
                    Organization Name <span style={{ color: "red" }}>*</span>
                  </span>
                }
                placeholder="Name of your organization"
                {...form.getInputProps("name")}
                sx={{
                  ".mantine-TextInput-label": { color: "#276749" },
                  marginBottom: "15px",
                  borderRadius: "8px",
                }}
              />
              <TextInput
                label={
                  <span>
                    Registration Number <span style={{ color: "red" }}>*</span>
                  </span>
                }
                placeholder="Your registration number"
                {...form.getInputProps("registrationNumber")}
                sx={{
                  ".mantine-TextInput-label": { color: "#276749" },
                  marginBottom: "10px",
                  borderRadius: "8px",
                }}
              />
              <TextInput
                label={
                  <span>
                    Contact Person <span style={{ color: "red" }}>*</span>
                  </span>
                }
                placeholder="Person to contact"
                {...form.getInputProps("contactPerson")}
                sx={{
                  ".mantine-TextInput-label": { color: "#276749" },
                  marginBottom: "10px",
                  borderRadius: "8px",
                }}
              />
              <TextInput
                label={
                  <span>
                    Contact Person Phone <span style={{ color: "red" }}>*</span>
                  </span>
                }
                placeholder="Phone of the contact person"
                {...form.getInputProps("contactPersonPhone")}
                sx={{
                  ".mantine-TextInput-label": { color: "#276749" },
                  marginBottom: "10px",
                  borderRadius: "8px",
                }}
              />
              <TextInput
                label={
                  <span>
                    Email <span style={{ color: "red" }}>*</span>
                  </span>
                }
                placeholder="organization@example.com"
                {...form.getInputProps("email")}
                sx={{
                  ".mantine-TextInput-label": { color: "#276749" },
                  marginBottom: "10px",
                  borderRadius: "8px",
                }}
              />
              <TextInput
                label={
                  <span>
                    Phone <span style={{ color: "red" }}>*</span>
                  </span>
                }
                placeholder="123-456-7890"
                {...form.getInputProps("phone")}
                sx={{
                  ".mantine-TextInput-label": { color: "#276749" },
                  marginBottom: "10px",
                  borderRadius: "8px",
                }}
              />
              <TextInput
                label={
                  <span>
                    Address <span style={{ color: "red" }}>*</span>
                  </span>
                }
                placeholder="Street, City, Country"
                {...form.getInputProps("address")}
                sx={{
                  ".mantine-TextInput-label": { color: "#276749" },
                  marginBottom: "10px",
                  borderRadius: "8px",
                }}
              />
              <TextInput
                label={
                  <span>
                    City <span style={{ color: "red" }}>*</span>
                  </span>
                }
                placeholder="City where the organization is located"
                {...form.getInputProps("city")}
                sx={{
                  ".mantine-TextInput-label": { color: "#276749" },
                  marginBottom: "10px",
                  borderRadius: "8px",
                }}
              />
              <TextInput
                label={
                  <span>
                    Country <span style={{ color: "red" }}>*</span>
                  </span>
                }
                placeholder="Country where the organization is located"
                {...form.getInputProps("country")}
                sx={{
                  ".mantine-TextInput-label": { color: "#276749" },
                  marginBottom: "10px",
                  borderRadius: "8px",
                }}
              />
            </SimpleGrid>

            <Textarea
              label="Description"
              placeholder="Briefly describe the organization"
              {...form.getInputProps("description")}
              styles={{ label: { color: "#276749" } }}
            />

            <Checkbox
              label="I agree to the terms and conditions"
              {...form.getInputProps("agreeToTerms", { type: "checkbox" })}
              styles={{ label: { color: "#276749" } }}
            />

            <Button
              variant="outline"
              color="dark"
              onClick={() => setNavigateToSignup(true)}
              style={{
                position: "absolute",
                top: 55,
                right: 40,
              }}
            >
              Login Organization
            </Button>
            <Group position="center" mt="md">
              <Button
                type="submit"
                style={{
                  backgroundColor: "#276749",
                  color: "white",
                  fontWeight: "bold",
                  width: 500,
                }}
                sx={{
                  "&:hover": { backgroundColor: "#2f855a" }, // Darker green on hover
                }}
              >
                Submit
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Submission Successful"
        centered
      >
        <p>
          Your organization has been submitted for review. The admin will decide
          whether to approve it for the platform.
        </p>
        <Button fullWidth onClick={() => setModalOpened(false)}>
          Close
        </Button>
      </Modal>
    </Container>
  );
};

export default AddOrganizationPage;
