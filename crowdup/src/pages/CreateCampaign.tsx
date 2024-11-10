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
    const location = { country: values.country, city: values.city };
    if (!location.country || !location.city) {
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
                      {form.values.country}, {form.values.city}
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

// import { Helmet } from "react-helmet";
// import {
//   ActionIcon,
//   Alert,
//   Anchor,
//   Box,
//   Button,
//   Checkbox,
//   Container,
//   Group,
//   NumberInput,
//   Paper,
//   PaperProps,
//   Select,
//   SimpleGrid,
//   Stack,
//   Stepper,
//   Text,
//   TextInput,
//   Title,
//   TitleProps,
//   useMantineTheme,
// } from "@mantine/core";
// import { Link, RichTextEditor } from "@mantine/tiptap";
// import { useEditor } from "@tiptap/react";
// import Highlight from "@tiptap/extension-highlight";
// import StarterKit from "@tiptap/starter-kit";
// import Underline from "@tiptap/extension-underline";
// import TextAlign from "@tiptap/extension-text-align";
// import Superscript from "@tiptap/extension-superscript";
// import SubScript from "@tiptap/extension-subscript";
// import React, { forwardRef, useState } from "react";
// import { DateInput } from "@mantine/dates";
// import {
//   IconBrandApple,
//   IconBrandFacebook,
//   IconBrandGoogle,
//   IconBrandLinkedin,
//   IconBrandPaypal,
//   IconBrandTwitter,
//   IconBrandWhatsapp,
//   IconBrandYoutube,
//   IconCalendar,
//   IconCheck,
//   IconChevronLeft,
//   IconChevronRight,
//   IconCurrency,
//   IconCurrencyDollar,
//   IconLink,
//   IconTrash,
// } from "@tabler/icons-react";
// import {
//   CategorySelect,
//   CountrySelect,
//   CurrencySelect,
//   FileDropzone,
// } from "../components";
// import { randomId } from "@mantine/hooks";
// import { useForm } from "@mantine/form";
// import { createCampaign } from "../services/campaignService";
// import axios from "axios";

// interface ISocialProps {
//   icon: React.FC<any>;
//   title: React.ReactNode;
// }

// const SocialSelectItem = forwardRef<HTMLDivElement, ISocialProps>(
//   ({ title, icon: Icon, ...others }: ISocialProps, ref) => (
//     <div ref={ref} {...others}>
//       <Group noWrap>
//         <Icon size={18} stroke={1.5} />
//         <Text size="sm" transform="capitalize">
//           {title}
//         </Text>
//       </Group>
//     </div>
//   )
// );

// interface Campaign {
//   [key: string]: any;
//   title: string;
//   description: string;
//   amount: string;
//   deadline: string ;
//   targetAmount: string;
//   location: string;
//   socialLinks: string;
//   profilePicture: null;
// }

// const CreateCampaignPage = ({ createCampaign }: any) => {
//   const [campaign, setCampaign] = useState<Campaign>({
//     title: "",
//     description: "",
//     amount: "",
//     deadline: null as Date | null,
//     targetAmount: "",
//     location: "",
//     socialLinks: "",
//     profilePicture: null,
//   });

//   const handleInputChange = (e: any) => {
//     const { name, value } = e.target;
//     setCampaign({ ...campaign, [name]: value });
//   };

//   const handleFileChange = (file: any) => {
//     setCampaign({ ...campaign, profilePicture: file });
//   };

//   const theme = useMantineTheme();
//   const [active, setActive] = useState(0);
//   const [target, setTarget] = useState("deadline");
//   const [deadlineDate, setDeadlineDate] = useState<Date | null>(null);
//   const [minimumCheck, setMinimumCheck] = useState(false);

//   const createNewCampaign = async (e: React.MouseEvent) => {
//     e.preventDefault();
//     try {
//       const formData = new FormData();
//       Object.keys(campaign).forEach((key) => {
//         formData.append(key, campaign[key]);
//       });
//       const data = await createCampaign(formData);
//       console.log("Campaign created successfully:", data);
//     } catch (error) {
//       console.error("Campaign creation failed", error);
//     }
//   };

//   const editor = useEditor({
//     extensions: [
//       StarterKit,
//       Underline,
//       Link,
//       Superscript,
//       SubScript,
//       Highlight,
//       TextAlign.configure({ types: ["heading", "paragraph"] }),
//     ],
//     content: "",
//   });

//   const socialForm = useForm({
//     initialValues: {
//       employees: [{ name: "", active: false, key: randomId() }],
//     },
//   });

//   const nextStep = () =>
//     setActive((current: number) => (current < 4 ? current + 1 : current));
//   const prevStep = () =>
//     setActive((current: number) => (current > 0 ? current - 1 : current));

//   const socialFields = socialForm.values.employees.map((item, index) => (
//     <Group key={item.key} mt="xs">
//       <Select
//         aria-label="social"
//         data={[
//           { title: "Facebook", icon: IconBrandFacebook },
//           { title: "Whatsapp", icon: IconBrandWhatsapp },
//           { title: "LinkedIn", icon: IconBrandLinkedin },
//           { title: "Twitter", icon: IconBrandTwitter },
//           { title: "Youtube", icon: IconBrandYoutube },
//           { title: "Other links", icon: IconLink },
//         ].map((c) => ({ value: c.title, label: c.title, ...c }))}
//         itemComponent={SocialSelectItem}
//       />
//       <TextInput
//         placeholder="https://"
//         sx={{ flex: 1 }}
//         {...socialForm.getInputProps(`employees.${index}.name`)}
//       />
//       <ActionIcon
//         color="red"
//         onClick={() => socialForm.removeListItem("employees", index)}
//       >
//         <IconTrash size="1rem" />
//       </ActionIcon>
//     </Group>
//   ));

//   const titleProps: TitleProps = {
//     size: 24,
//     mb: "md",
//   };

//   const subTitleProps: TitleProps = {
//     size: 18,
//     mb: "sm",
//   };

//   const paperProps: PaperProps = {
//     p: "md",
//     withBorder: false,
//     shadow: "sm",
//     mb: "md",
//     sx: { backgroundColor: theme.white },
//   };

//   return (
//     <>
//       <Helmet>
//         <title>Create campaign</title>
//       </Helmet>
//       <Box>
//         <Container my={36}>
//           <Title mb="xl" align="center">
//             Create your campaign
//           </Title>
//           <Stepper active={active} onStepClick={setActive} breakpoint="sm">
//             <Stepper.Step
//               label="Get started"
//               description="Set essential fundraiser details such as fundraiser title, target and currency"
//             >
//               <Title {...titleProps}>Campaign information</Title>
//               <Paper {...paperProps}>
//                 <SimpleGrid
//                   cols={2}
//                   breakpoints={[{ maxWidth: "sm", cols: 1 }]}
//                 >
//                   <TextInput
//                     label="Title"
//                     name="title"
//                     value={campaign.title}
//                     onChange={handleInputChange}
//                   />
//                   <CategorySelect />
//                 </SimpleGrid>
//               </Paper>
//               <Paper {...paperProps}>
//                 <Title {...subTitleProps}>Campaign location</Title>
//                 <Text size="sm" mb="sm">
//                   Please select the country that we&apos;ll be sending funds to
//                   (typically where you&apos;re resident). This helps match you
//                   to the correct payment processors.
//                 </Text>
//                 <SimpleGrid
//                   cols={2}
//                   breakpoints={[{ maxWidth: "sm", cols: 1 }]}
//                 >
//                   <CountrySelect />
//                   <TextInput
//                     label="City"
//                     placeholder="city"
//                     name="location"
//                     value={campaign.location}
//                     onChange={handleInputChange}
//                   />
//                 </SimpleGrid>
//               </Paper>
//               <Paper {...paperProps}>
//                 <Stack spacing="sm">
//                   <Title {...subTitleProps}>Donation information</Title>
//                   <CurrencySelect />
//                   <Paper {...paperProps}>
//                     {target === "deadline" ? (
//                       <Stack spacing="xs">
//                         <DateInput
//                           value={campaign.deadline}
//                           onChange={(value) =>
//                             setCampaign({
//                               ...campaign,
//                               deadline: value.toISOString(),
//                             })
//                           }
//                           label="Deadline"
//                           placeholder="Date input"
//                           icon={<IconCalendar size={18} />}
//                         />
//                         <NumberInput
//                           label="Target amount"
//                           value={campaign.targetAmount}
//                           icon={<IconCurrencyDollar size={18} />}
//                           onChange={(value) =>
//                             setCampaign({
//                               ...campaign,
//                               amount: value ? value.toString() : "",
//                             })
//                           }
//                         />
//                       </Stack>
//                     ) : (
//                       <Stack spacing="xs">
//                         <Text size="sm">Ongoing (no deadline) fundraiser?</Text>
//                         <Checkbox
//                           checked={minimumCheck}
//                           onChange={(event) =>
//                             setMinimumCheck(event.currentTarget.checked)
//                           }
//                           label="Set a specific minimum financial target"
//                         />
//                         {minimumCheck && (
//                           <NumberInput
//                             label="Target amount"
//                             icon={<IconCurrencyDollar size={18} />}
//                           />
//                         )}
//                       </Stack>
//                     )}
//                   </Paper>
//                 </Stack>
//               </Paper>
//               <Paper {...paperProps}>
//                 <Stack spacing="sm">
//                   <Title {...subTitleProps}>Fund & Registration details</Title>
//                   <Text size="sm">
//                     *Name of the person receiving funds. For organizations, the
//                     legal representative name (this can be amended later).
//                   </Text>
//                   <SimpleGrid
//                     cols={2}
//                     breakpoints={[{ maxWidth: "sm", cols: 1 }]}
//                   >
//                     <TextInput label="First name" />
//                     <TextInput label="Last name" />
//                   </SimpleGrid>
//                   <FileDropzone
//                     label="Upload your profile picture"
//                     description="This picture will be shown next to your name"
//                   />
//                   <Checkbox
//                     label={
//                       <>
//                         I agree to the CrisisChain{" "}
//                         <Anchor href="#" target="_blank">
//                           terms and conditions & privacy policy
//                         </Anchor>
//                       </>
//                     }
//                   />
//                 </Stack>
//               </Paper>
//             </Stepper.Step>
//             <Stepper.Step
//               label="Campaign story"
//               description="Tell your story! Add your description, images, videos and more"
//             >
//               <Title {...titleProps}>Your campaign story</Title>
//               <Paper {...paperProps}>
//                 <Stack spacing="sm">
//                   <Text size="sm">
//                     Explain why you&apos;re raising money, what the funds will
//                     be used for, and how much you value the support.
//                   </Text>
//                   <RichTextEditor editor={editor}>
//                     <RichTextEditor.Toolbar sticky stickyOffset={60}>
//                       <RichTextEditor.ControlsGroup>
//                         <RichTextEditor.Bold />
//                         <RichTextEditor.Italic />
//                         <RichTextEditor.Underline />
//                         <RichTextEditor.Strikethrough />
//                         <RichTextEditor.ClearFormatting />
//                         <RichTextEditor.Highlight />
//                         <RichTextEditor.Code />
//                       </RichTextEditor.ControlsGroup>
//                       <RichTextEditor.ControlsGroup>
//                         <RichTextEditor.H1 />
//                         <RichTextEditor.H2 />
//                         <RichTextEditor.H3 />
//                         <RichTextEditor.H4 />
//                       </RichTextEditor.ControlsGroup>
//                       <RichTextEditor.ControlsGroup>
//                         <RichTextEditor.Blockquote />
//                         <RichTextEditor.Hr />
//                         <RichTextEditor.BulletList />
//                         <RichTextEditor.OrderedList />
//                         <RichTextEditor.Subscript />
//                         <RichTextEditor.Superscript />
//                       </RichTextEditor.ControlsGroup>
//                       <RichTextEditor.ControlsGroup>
//                         <RichTextEditor.Link />
//                         <RichTextEditor.Unlink />
//                       </RichTextEditor.ControlsGroup>
//                       <RichTextEditor.ControlsGroup>
//                         <RichTextEditor.AlignLeft />
//                         <RichTextEditor.AlignCenter />
//                         <RichTextEditor.AlignJustify />
//                         <RichTextEditor.AlignRight />
//                       </RichTextEditor.ControlsGroup>
//                     </RichTextEditor.Toolbar>
//                     <RichTextEditor.Content />
//                   </RichTextEditor>
//                   <FileDropzone
//                     label="Upload fundraiser photos"
//                     description="You can select and upload several in one go"
//                   />
//                 </Stack>
//               </Paper>
//             </Stepper.Step>
//             <Stepper.Step label="Payment methods" description="Get full access">
//               <Title {...titleProps}>Fundraiser Payment Methods</Title>
//               <Paper {...paperProps}>
//                 <Stack spacing="sm">
//                   <Title {...subTitleProps}>
//                     Enable payment processors for your fundraising page
//                   </Title>
//                   <Alert icon={<IconCurrency size={18} />} color="blue">
//                     You can enable GGF Card Payments (powered by MangoPay) if
//                     you switch your currency from GBP to USD{" "}
//                   </Alert>
//                   <Text size="sm">Available payment methods</Text>
//                   <Group>
//                     <Button
//                       variant="light"
//                       leftIcon={<IconBrandPaypal size={18} />}
//                     >
//                       Connect with Paypal
//                     </Button>
//                     <Button
//                       variant="light"
//                       leftIcon={<IconBrandGoogle size={18} />}
//                     >
//                       Connect with Google Pay
//                     </Button>
//                     <Button
//                       variant="light"
//                       leftIcon={<IconBrandApple size={18} />}
//                     >
//                       Connect with Apple Pay
//                     </Button>
//                   </Group>
//                 </Stack>
//               </Paper>
//             </Stepper.Step>
//             <Stepper.Completed>
//               <Title {...titleProps} align="center" my="xl">
//                 Completed, take a seat while we finish setting up things for you
//               </Title>
//             </Stepper.Completed>
//           </Stepper>

//           <Group position="center" mt="xl">
//             <Button
//               variant="default"
//               onClick={prevStep}
//               leftIcon={<IconChevronLeft size={18} />}
//             >
//               Back
//             </Button>
//             {active < 4 ? (
//               <Button
//                 onClick={nextStep}
//                 leftIcon={<IconChevronRight size={18} />}
//               >
//                 Next step
//               </Button>
//             ) : (
//               <Button
//                 component="a"
//                 href="/dashboard"
//                 leftIcon={<IconCheck size={18} />}
//                 onClick={(e) => createNewCampaign(e)}
//               >
//                 Launch campaign
//               </Button>
//             )}
//           </Group>
//         </Container>
//       </Box>
//     </>
//   );
// };

// export default CreateCampaignPage;
