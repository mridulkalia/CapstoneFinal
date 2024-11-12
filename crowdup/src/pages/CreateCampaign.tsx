import { Helmet } from "react-helmet";
import {
  Box,
  Button,
  Container,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Stepper,
  TextInput,
  Select,
  Textarea,
  Title,
  TitleProps,
  useMantineTheme,
  Text,
  Divider,
  FileInput,
} from "@mantine/core";
import {
  IconChevronLeft,
  IconChevronRight,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { useState } from "react";
import axios from "axios";
import { showNotification } from "@mantine/notifications";

interface Location {
  country: string;
  city: string;
}

interface CampaignData {
  title: string;
  description: string;
  amount: string;
  deadline: string;
  targetAmount: number;
  location: Location;
  category: string;
  contactPersonName: string;
  organizerContact: string;
  socialMediaLinks: string[];
  campaignType: string;
  organizationName: string;
  organizationEmail: string;
  ethereumAddress:String;
}

const CreateCampaignPage = () => {
  const theme = useMantineTheme();
  const [active, setActive] = useState(0);
  const [file, setFile] = useState<File | null>(null); // For handling file upload
  const [locationError, setLocationError] = useState<string>(""); // State to handle location errors
  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      amount: "",
      deadline: "",
      targetAmount: "",
      country: "",
      city: "",
      category: "",
      contactPersonName: "",
      organizerContact: "",
      socialMediaLinks: [""], // Start with one link for simplicity
      campaignType: "",
      organizationName: "",
      organizationEmail: "",
      ethereumAddress:"",
    },
  });

  const titleProps: TitleProps = {
    size: 36,
    mb: "md",
    align: "center",
    color: theme.colors.blue[6], // Custom title color
  };

  const paperProps = {
    p: "md",
    withBorder: true,
    shadow: "lg", // Added more shadow for depth
    mb: "md",
    sx: {
      backgroundColor: theme.white,
      minHeight: "300px",
      borderRadius: "8px",
    },
  };

  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const handleSubmit = async (values: any) => {
    const formData = new FormData();

    // Validate location
    const location = { country: values?.country, city: values?.city };
    if (!location?.country || !location?.city) {
      setLocationError("Both country and city are required for location.");
      return; // Stop form submission if location is incomplete
    }

    setLocationError(""); // Reset location error

    // Prepare campaign data
    const campaignData: CampaignData = {
      title: values.title,
      description: values.description,
      amount: values.amount,
      deadline: values.deadline,
      targetAmount: Number(values.targetAmount), // Convert to number
      location: location,
      category: values.category,
      contactPersonName: values.contactPersonName,
      organizerContact: values.organizerContact,
      socialMediaLinks: values.socialMediaLinks,
      campaignType: values.campaignType,
      organizationName: values.organizationName,
      organizationEmail: values.organizationEmail,
      ethereumAddress:values.ethereumAddress,
      
    };

    // Append fields to FormData
    Object.keys(campaignData).forEach((key) => {
      const value = campaignData[key as keyof CampaignData];
      if (key !== "location") {
        if (typeof value === "number") {
          formData.append(key, value.toString());
        } else if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value as string);
        }
      }
    });

    // Append location as JSON string
    formData.append("location", JSON.stringify(location));

    // Append the profile picture if selected
    if (file) {
      formData.append("profilePicture", file); // Append file as part of the FormData
    }

    try {
      // Send POST request with form data
      const response = await axios.post(
        "http://localhost:8000/campaign/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data); // Log successful response

      // Show success notification
      showNotification({
        title: "Campaign Created!",
        message: "Your campaign was successfully created.",
        color: "green",
        icon: <IconCheck size={18} />,
      });
    } catch (error) {
      console.error(error); // Log any errors
      showNotification({
        title: "Error",
        message: "Failed to create campaign.",
        color: "red",
        icon: <IconX size={18} />,
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Campaign</title>
      </Helmet>
      <Box sx={{ padding: "40px 20px", backgroundColor: theme.colors.gray[0] }}>
        <Container size="lg" my={36}>
          <Title {...titleProps}>Create Your Campaign</Title>

          <Stepper
            active={active}
            onStepClick={setActive}
            breakpoint="sm"
            sx={{
              width: "80%",
              margin: "auto",
              padding: "10px",
              borderRadius: "8px",
              backgroundColor: theme.colors.blue[0],
            }}
          >
            {/* Step 1: Basic Info */}
            <Stepper.Step
              label="Get Started"
              description="Fill in basic campaign info"
            >
              <Title {...titleProps}>Campaign Information</Title>
              <Paper {...paperProps}>
                <SimpleGrid
                  cols={2}
                  spacing="lg"
                  breakpoints={[{ maxWidth: "sm", cols: 1 }]}
                >
                  <TextInput
                    label="Title"
                    placeholder="Enter campaign title"
                    {...form.getInputProps("title")}
                    required
                  />
                  <TextInput
                    label="Amount"
                    placeholder="Enter current amount raised"
                    {...form.getInputProps("amount")}
                    required
                  />
                  <TextInput
                    label="Deadline"
                    type="datetime-local"
                    {...form.getInputProps("deadline")}
                    required
                  />
                  <TextInput
                    label="Country"
                    placeholder="Enter country"
                    {...form.getInputProps("country")}
                    required
                  />
                  <TextInput
                    label="City"
                    placeholder="Enter city"
                    {...form.getInputProps("city")}
                    required
                  />
                  <Textarea
                    label="Description"
                    placeholder="Enter campaign description"
                    {...form.getInputProps("description")}
                    required
                  />
                </SimpleGrid>
                {locationError && <Text color="red">{locationError}</Text>}
              </Paper>
            </Stepper.Step>

            {/* Step 2: Donation Info */}
            <Stepper.Step
              label="Donation Info"
              description="Set your donation goals"
            >
              <Title {...titleProps}>Donation Information</Title>
              <Paper {...paperProps}>
                <SimpleGrid
                  cols={2}
                  spacing="lg"
                  breakpoints={[{ maxWidth: "sm", cols: 1 }]}
                >
                  <TextInput
                    label="Target Amount"
                    placeholder="Enter target amount"
                    {...form.getInputProps("targetAmount")}
                    required
                  />
                  <TextInput
                    label="Ethereum Address"
                    placeholder="Enter Ethereum address"
                    {...form.getInputProps("ethereumAddress")}
                    required
                  />
                  <FileInput
                    label="Profile Picture"
                    placeholder="Upload your profile picture"
                    value={file} // Bind the file state to this input
                    onChange={setFile} // Update state with selected file
                    required
                    accept="image/*" // Accept only image files
                  />
                  <Select
                    label="Campaign Type"
                    placeholder="Select campaign type"
                    data={[
                      "Non-Profit",
                      "Commercial",
                      "Personal",
                      "Government",
                    ]}
                    {...form.getInputProps("campaignType")}
                    required
                  />
                </SimpleGrid>
              </Paper>
            </Stepper.Step>

            {/* Step 3: Organizer Info */}
            <Stepper.Step
              label="Organizer Info"
              description="Provide your organizer details"
            >
              <Title {...titleProps}>Organizer Information</Title>
              <Paper {...paperProps}>
                <SimpleGrid
                  cols={2}
                  spacing="lg"
                  breakpoints={[{ maxWidth: "sm", cols: 1 }]}
                >
                  <TextInput
                    label=" Contact Person Name"
                    placeholder="Enter Contact Person's name"
                    {...form.getInputProps("contactPersonName")}
                    required
                  />
                  <TextInput
                    label="Organizer Contact"
                    placeholder="Enter organizer's contact number"
                    {...form.getInputProps("organizerContact")}
                    required
                  />
                  <TextInput
                    label="Organization Name"
                    placeholder="Enter organization name"
                    {...form.getInputProps("organizationName")}
                    required
                  />
                  <TextInput
                    label="Organization Email"
                    placeholder="Enter organization email"
                    {...form.getInputProps("organizationEmail")}
                    required
                  />
                </SimpleGrid>
              </Paper>
            </Stepper.Step>

            {/* Step 4: Review & Submit */}
            <Stepper.Step
              label="Review"
              description="Final review before submitting"
            >
              <Title {...titleProps}>Review Campaign</Title>
              <Paper {...paperProps}>
                <Stack spacing="lg">
                  <Text weight={500} size="lg">
                    Review the information you've entered:
                  </Text>

                  {/* Campaign Title */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text size="md" color="gray">
                      Campaign Title
                    </Text>
                    <Text size="md" weight={500}>
                      {form.values.title}
                    </Text>
                  </Box>

                  {/* Amount Raised */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text size="md" color="gray">
                      Amount Raised
                    </Text>
                    <Text size="md" weight={500}>
                      ₹{form.values.amount}
                    </Text>
                  </Box>

                  {/* Target Amount */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text size="md" color="gray">
                      Target Amount
                    </Text>
                    <Text size="md" weight={500}>
                      ₹{form.values.targetAmount}
                    </Text>
                  </Box>

                  {/* Deadline */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text size="md" color="gray">
                      Deadline
                    </Text>
                    <Text size="md" weight={500}>
                      {form.values.deadline}
                    </Text>
                  </Box>

                  {/* Country & City */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text size="md" color="gray">
                      Location
                    </Text>
                    <Text size="md" weight={500}>
                      {form.values?.country}, {form.values?.city}
                    </Text>
                  </Box>

                  {/* Campaign Type */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text size="md" color="gray">
                      Campaign Type
                    </Text>
                    <Text size="md" weight={500}>
                      {form.values.campaignType}
                    </Text>
                  </Box>

                  {/* Organizer Name */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text size="md" color="gray">
                      Contact Person Name
                    </Text>
                    <Text size="md" weight={500}>
                      {form.values.contactPersonName}
                    </Text>
                  </Box>

                  {/* Organizer Contact */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text size="md" color="gray">
                      Organizer Contact
                    </Text>
                    <Text size="md" weight={500}>
                      {form.values.organizerContact}
                    </Text>
                  </Box>

                  {/* Social Media Links */}
                  {/* <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Text size="md" color="gray">
                      Social Media Links
                    </Text>
                    {form.values.socialMediaLinks.map((link, index) => (
                      <Text key={index} size="md" weight={500}>
                        {link}
                      </Text>
                    ))}
                  </Box> */}

                  {/* Organization Info */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text size="md" color="gray">
                      Organization Name
                    </Text>
                    <Text size="md" weight={500}>
                      {form.values.organizationName}
                    </Text>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text size="md" color="gray">
                      Organization Email
                    </Text>
                    <Text size="md" weight={500}>
                      {form.values.organizationEmail}
                    </Text>
                  </Box>

                  {/* Contact Person */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text size="md" color="gray">
                      Contact Person
                    </Text>
                    <Text size="md" weight={500}>
                      {form.values.contactPersonName}
                    </Text>
                  </Box>
                </Stack>
              </Paper>
            </Stepper.Step>
          </Stepper>

          <Group position="center" mt="xl">
            <Button
              variant="default"
              color="gray"
              onClick={prevStep}
              leftIcon={<IconChevronLeft size={16} />}
              disabled={active === 0}
            >
              Back
            </Button>
            <Button
              onClick={nextStep}
              leftIcon={<IconChevronRight size={16} />}
              disabled={active === 3}
            >
              Next Step
            </Button>
          </Group>

          <Group position="center" mt="xl">
            <Button onClick={() => handleSubmit(form.values)}>
              Submit Campaign
            </Button>
          </Group>
        </Container>
      </Box>
    </>
  );
};

export default CreateCampaignPage;
