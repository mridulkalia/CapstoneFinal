import React, { useState } from "react";
import {
  Container,
  Paper,
  SimpleGrid,
  Stack,
  TextInput,
  Select,
  FileInput,
  Textarea,
  Button,
  Title,
  Checkbox,
  Modal,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import axios from "axios";

interface FormValues {
  organizationName: string;
  organizationType: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  servicesProvided: string;
  certificates: File | null;
  socialMedia: string;
  missionStatement: string;
  agreeToTerms: boolean;
}

const AddOrganizationPage = () => {
  const [modalOpened, setModalOpened] = useState(false);

  const form = useForm({
    initialValues: {
      organizationName: "",
      organizationType: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      servicesProvided: "",
      certificates: null,
      socialMedia: "",
      missionStatement: "",
      agreeToTerms: false,
    },
    validate: {
      organizationName: (value) => (value ? null : "Organization name is required"),
      organizationType: (value) => (value ? null : "Please select the type"),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      agreeToTerms: (value) => (value ? null : "You must agree to the terms"),
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      const formData = new FormData();
      formData.append("organizationName", values.organizationName);
      formData.append("organizationType", values.organizationType);
      formData.append("contactPerson", values.contactPerson);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("address", values.address);
      formData.append("servicesProvided", values.servicesProvided);
      if (values.certificates) formData.append("certificates", values.certificates);
      formData.append("socialMedia", values.socialMedia);
      formData.append("missionStatement", values.missionStatement);
      formData.append("agreeToTerms", values.agreeToTerms.toString());

      const response = await axios.post("http://localhost:8000/add-organization", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        showNotification({
          title: "Submission Successful",
          message: "Your organization has been submitted for review.",
          color: "green",
        });
        setModalOpened(true);
      }
    } catch (error) {
      showNotification({
        title: "Submission Failed",
        message: "An error occurred during submission. Please try again.",
        color: "red",
      });
    }
  };

  return (
    <Container my={40}>
      <Title align="center" mb="xl">
        Add Your NGO/Hospital
      </Title>
      <Paper withBorder shadow="sm" p="md" radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack spacing="md">
            <TextInput
              label="Organization Name"
              placeholder="Name of your organization"
              {...form.getInputProps("organizationName")}
            />
            <Select
              label="Organization Type"
              placeholder="Select type"
              data={[
                { value: "NGO", label: "NGO" },
                { value: "Hospital", label: "Hospital" },
              ]}
              {...form.getInputProps("organizationType")}
            />
            <TextInput
              label="Contact Person"
              placeholder="Person to contact"
              {...form.getInputProps("contactPerson")}
            />
            <TextInput
              label="Email"
              placeholder="organization@example.com"
              {...form.getInputProps("email")}
            />
            <TextInput
              label="Phone"
              placeholder="123-456-7890"
              {...form.getInputProps("phone")}
            />
            <TextInput
              label="Address"
              placeholder="Street, City, Country"
              {...form.getInputProps("address")}
            />
            <Textarea
              label="Services Provided"
              placeholder="Briefly describe services"
              {...form.getInputProps("servicesProvided")}
            />
            <FileInput
              label="Certificates"
              placeholder="Upload supporting certificates"
              {...form.getInputProps("certificates")}
            />
            <TextInput
              label="Social Media Profile"
              placeholder="Link to your profile"
              {...form.getInputProps("socialMedia")}
            />
            <Textarea
              label="Mission Statement"
              placeholder="What is your mission?"
              {...form.getInputProps("missionStatement")}
            />
            <Checkbox
              label="I agree to the terms and conditions"
              {...form.getInputProps("agreeToTerms", { type: "checkbox" })}
            />
            <Button type="submit">Submit</Button>
          </Stack>
        </form>
      </Paper>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Submission Successful"
        centered
      >
        <p>Your organization has been submitted for review. The admin will decide whether to approve it for the platform.</p>
        <Button fullWidth onClick={() => setModalOpened(false)}>Close</Button>
      </Modal>
    </Container>
  );
};

export default AddOrganizationPage;
