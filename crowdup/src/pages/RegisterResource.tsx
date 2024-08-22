import React, { useState } from "react";
import {
  Container,
  Paper,
  SimpleGrid,
  Stack,
  TextInput,
  Select,
  Checkbox,
  Group,
  Button,
  Title,
  FileInput,
  Textarea,
  useMantineTheme,
  Modal,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconUpload, IconCheck } from "@tabler/icons-react";
import axios from "axios";

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  resourceType: string;
  identity: File | null;
  certificate: File | null;
  additionalInfo: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  experience: string;
  socialMedia: string;
  agreeToTerms: boolean;
}

const RegisterResourcePage = () => {
  const theme = useMantineTheme();
  const [modalOpened, setModalOpened] = useState(false);
  const [userId, setUserId] = useState(""); // Replace with logic to get user ID

  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
      resourceType: "",
      identity: null,
      certificate: null,
      additionalInfo: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      experience: "",
      socialMedia: "",
      agreeToTerms: false,
    },
    validate: {
      firstName: (value) => (value ? null : "First name is required"),
      lastName: (value) => (value ? null : "Last name is required"),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      resourceType: (value) => (value ? null : "Please select a resource type"),
      identity: (value) => (value ? null : "Identity verification is required"),
      agreeToTerms: (value) => (value ? null : "You must agree to the terms"),
    },
  });

  const fetchUserIdByEmail = async (email: string) => {
    try {
      const response = await axios.get('http://localhost:8000/user-by-email', {
        params: { email },
      });
      return response.data.userId;
    } catch (error) {
      console.error('Failed to fetch user ID', error);
      return null;
    }
  };

  const handleSubmit = async (values: FormValues) => {
    const email = values.email; // Or wherever you get the email from

    // Fetch user ID based on email
    const userId = await fetchUserIdByEmail(email);
  
    if (!userId) {
      console.error('User ID is missing');
      return;
    }
    try {

      const formData = new FormData();

      formData.append("userId", userId); // Add user ID dynamically
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("location", values.location);
      formData.append("resourceType", values.resourceType);
      if (values.identity) formData.append("identity", values.identity);
      if (values.certificate) formData.append("certificate", values.certificate);
      formData.append("additionalInfo", values.additionalInfo);
      formData.append("emergencyContactName", values.emergencyContactName);
      formData.append("emergencyContactPhone", values.emergencyContactPhone);
      formData.append("experience", values.experience);
      formData.append("socialMedia", values.socialMedia);
      formData.append("agreeToTerms", values.agreeToTerms.toString());
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      const response = await axios.post("http://localhost:8000/register-resource", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
      if (response.status === 201) {
        showNotification({
          title: "Registration Successful",
          message: "Your registration is received. We will verify the records and get back to you shortly.",
          color: "green",
        });
        setModalOpened(true);
      } else {
        throw new Error("Failed to submit form");
      }
    } catch (error) {
      showNotification({
        title: "Submission Failed",
        message: "There was an issue with your submission. Please try again.",
        color: "red",
      });
    }
  };

  return (
    <Container my={40}>
      <Title align="center" mb="xl">
        Register as a Resource
      </Title>
      <Paper withBorder shadow="sm" p="md" radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack spacing="md">
            <Title order={4}>User Details</Title>
            <SimpleGrid cols={2} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
              <TextInput
                label="First Name"
                placeholder="John"
                {...form.getInputProps("firstName")}
              />
              <TextInput
                label="Last Name"
                placeholder="Doe"
                {...form.getInputProps("lastName")}
              />
              <TextInput
                label="Email"
                placeholder="john.doe@example.com"
                {...form.getInputProps("email")}
              />
              <TextInput
                label="Phone"
                placeholder="123-456-7890"
                {...form.getInputProps("phone")}
              />
              <TextInput
                label="Location"
                placeholder="City, Country"
                {...form.getInputProps("location")}
              />
            </SimpleGrid>

            <Title order={4}>Resource Details</Title>
            <Select
              label="Resource Type"
              placeholder="Select a resource"
              data={[
                { value: "Medical", label: "Medical Services" },
                { value: "Shelter", label: "Shelter" },
                { value: "Food", label: "Food Supplies" },
                { value: "Tech", label: "Technical Support" },
                { value: "Transportation", label: "Transportation" },
                { value: "Volunteering", label: "Volunteering" },
                { value: "Other", label: "Other" },
              ]}
              {...form.getInputProps("resourceType")}
            />
            <FileInput
              label="Photo Identity"
              placeholder="Upload your ID"
              icon={<IconUpload size={14} />}
              {...form.getInputProps("identity")}
            />
            <FileInput
              label="Related Certificates"
              placeholder="Upload certificates"
              icon={<IconUpload size={14} />}
              {...form.getInputProps("certificate")}
            />
            <Textarea
              label="Additional Information"
              placeholder="Provide any extra details"
              {...form.getInputProps("additionalInfo")}
            />

            <Title order={4}>Emergency Contact</Title>
            <SimpleGrid cols={2} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
              <TextInput
                label="Emergency Contact Name"
                placeholder="Jane Doe"
                {...form.getInputProps("emergencyContactName")}
              />
              <TextInput
                label="Emergency Contact Phone"
                placeholder="987-654-3210"
                {...form.getInputProps("emergencyContactPhone")}
              />
            </SimpleGrid>

            <Title order={4}>Experience & Social Media</Title>
            <Textarea
              label="Experience"
              placeholder="Briefly describe your experience"
              {...form.getInputProps("experience")}
            />
            <TextInput
              label="Social Media Profile"
              placeholder="Link to your profile"
              {...form.getInputProps("socialMedia")}
            />

            <Checkbox
              label="I agree to the terms and conditions"
              {...form.getInputProps("agreeToTerms", { type: "checkbox" })}
            />

            <Group position="center" mt="md">
              <Button type="submit" leftIcon={<IconCheck />}>
                Register
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
        <Stack spacing="md">
          <p>
            Thank you for registering as a resource. Your records and
            certificates will be verified, and we will get back to you shortly.
          </p>
          <Button fullWidth onClick={() => setModalOpened(false)}>
            Close
          </Button>
        </Stack>
      </Modal>
    </Container>
  );
};

export default RegisterResourcePage;
