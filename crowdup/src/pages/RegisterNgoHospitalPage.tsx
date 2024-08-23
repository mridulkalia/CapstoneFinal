import React, { useState } from "react";
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
      registrationNumber: (value) => (value ? null : "Registration number is required"),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      agreeToTerms: (value) => (value ? null : "You must agree to the terms"),
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      const response = await axios.post("http://localhost:8000/add-ngo-hospital", values);

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
              {...form.getInputProps("name")}
            />
            <TextInput
              label="Registration Number"
              placeholder="Your registration number"
              {...form.getInputProps("registrationNumber")}
            />
            <TextInput
              label="Contact Person"
              placeholder="Person to contact"
              {...form.getInputProps("contactPerson")}
            />
            <TextInput
              label="Contact Person Phone"
              placeholder="Phone of the contact person"
              {...form.getInputProps("contactPersonPhone")}
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
              label="Description"
              placeholder="Briefly describe the organization"
              {...form.getInputProps("description")}
            />
            <TextInput
              label="City"
              placeholder="City where the organization is located"
              {...form.getInputProps("city")}
            />
            <TextInput
              label="Country"
              placeholder="Country where the organization is located"
              {...form.getInputProps("country")}
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
