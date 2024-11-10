import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  TextInput,
  NumberInput,
  Button,
  Group,
  Notification,
  Container,
  Grid,
  Card,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import axios from "axios";

interface Campaign {
  _id: string;
  title: string;
  description: string;
  amount: string;
  deadline: string;
  targetAmount: number;
  location: { country: string; city: string };
  profilePicture?: string;
  createdAt: string;
  status: string;
}

const CreateCampaignPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [deadline, setDeadline] = useState<Date | null>(new Date());
  const [file, setFile] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<
    string | null
  >(null);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  });

  const form = useForm({
    initialValues: {
      title: "",
      amount: "",
      targetAmount: 0,
      deadline: new Date(),
      location: { country: "", city: "" },
      profilePicture: "",
    },
    validate: {
      title: (value) => (value ? null : "Title is required"),
      amount: (value) => (value ? null : "Amount is required"),
      targetAmount: (value) =>
        value > 0 ? null : "Target amount should be greater than zero",
      location: {
        country: (value) => (value ? null : "Country is required"),
        city: (value) => (value ? null : "City is required"),
      },
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
      // const fileReader = new FileReader();
      // fileReader.onloadend = () => {
      //   setProfilePicturePreview(fileReader.result as string);
      // };
      // fileReader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (values: typeof form.values) => {
    let strippedDescription = editor
      ?.getHTML()
      .replace(/<p>/g, "")
      .replace(/<\/p>/g, "");
    if (!strippedDescription || strippedDescription.trim() === "") {
      strippedDescription = "No description provided";
    }

    const formData = new FormData();

    formData.append("title", values.title);
    formData.append("amount", values.amount);
    formData.append("targetAmount", String(values.targetAmount));
    formData.append("location", JSON.stringify(values.location));
    formData.append("description", strippedDescription);
    formData.append("deadline", String(deadline));

    // If a profile picture is selected, append it to FormData
    if (file) {
      formData.append("profilePicture", file);
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/campaign/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setNotification({
        message: "Campaign created successfully",
        type: "success",
      });
      setFile(null);
      const fileInput = document.getElementById(
        "profilePictureInput"
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = ""; // Reset the file input field
      }
      setCampaigns((prev) => [...prev, response.data.campaign]);
      form.reset();
      editor?.commands.setContent("");
      setDeadline(new Date());
    } catch (error) {
      setNotification({ message: "Failed to create campaign", type: "error" });
      console.error(error);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get("http://localhost:8000/campaigns");
      setCampaigns(response.data.campaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return (
    <Container>
      <h1>Create a Campaign</h1>
      {notification && (
        <Notification
          color={notification.type}
          onClose={() => setNotification(null)}
        >
          {notification.message}
        </Notification>
      )}
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput label="Title" {...form.getInputProps("title")} required />
        <Text weight={500} size="sm" mt="md" mb="xs">
          Description
        </Text>
        <RichTextEditor editor={editor}>
          <RichTextEditor.Content />
        </RichTextEditor>
        <TextInput label="Amount" {...form.getInputProps("amount")} required />
        <NumberInput
          label="Target Amount"
          {...form.getInputProps("targetAmount")}
          required
        />
        <label>Deadline</label>
        <DatePicker
          selected={deadline}
          onChange={(date: Date | null) => setDeadline(date)}
          dateFormat="yyyy-MM-dd"
        />
        <TextInput
          label="Country"
          {...form.getInputProps("location.country")}
          required
        />
        <TextInput
          label="City"
          {...form.getInputProps("location.city")}
          required
        />
        <div>
          <label htmlFor="profilePicture">Profile Picture</label>
          <input
            type="file"
            id="profilePicture"
            accept="image/*"
            onChange={handleFileChange}
          />
          {/* {profilePicturePreview && (
            <div>
              <img
                src={profilePicturePreview}
                alt="Profile Preview"
                style={{
                  width: 100,
                  height: 100,
                  objectFit: "cover",
                  marginTop: "10px",
                }}
              />
            </div>
          )} */}
        </div>
        <Group position="center" mt="md">
          <Button type="submit">Create Campaign</Button>
        </Group>
      </form>

      <h2>All Campaigns</h2>
      <Grid>
        {campaigns.map((campaign) => (
          <Grid.Col span={4} key={campaign._id}>
            <Card shadow="sm" padding="lg">
              <h3>{campaign.title}</h3>
              <p>Description:{campaign.description}</p>
              <p>Amount: {campaign.amount}</p>
              <p>Target Amount: {campaign.targetAmount}</p>
              <p>
                Location: {campaign.location.city}, {campaign.location.country}
              </p>
              <p>Status: {campaign.status}</p>
              <p>
                Created At: {new Date(campaign.createdAt).toLocaleDateString()}
              </p>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
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
