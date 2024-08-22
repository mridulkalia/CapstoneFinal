import { Helmet } from "react-helmet";
import {
  ActionIcon,
  Alert,
  Anchor,
  Box,
  Button,
  Checkbox,
  Container,
  Group,
  NumberInput,
  Paper,
  PaperProps,
  Select,
  SimpleGrid,
  Stack,
  Stepper,
  Text,
  TextInput,
  Title,
  TitleProps,
  useMantineTheme,
} from "@mantine/core";
import { Link, RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import React, { forwardRef, useState } from "react";
import { DateInput } from "@mantine/dates";
import {
  IconBrandApple,
  IconBrandFacebook,
  IconBrandGoogle,
  IconBrandLinkedin,
  IconBrandPaypal,
  IconBrandTwitter,
  IconBrandWhatsapp,
  IconBrandYoutube,
  IconCalendar,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconCurrency,
  IconCurrencyDollar,
  IconLink,
  IconTrash,
} from "@tabler/icons-react";
import {
  CategorySelect,
  CountrySelect,
  CurrencySelect,
  FileDropzone,
} from "../components";
import { randomId } from "@mantine/hooks";
import { useForm } from "@mantine/form";
// import { CrowdFundingProvider } from "../../../blockchain/context/CrowdFunding";

interface ISocialProps {
  icon: React.FC<any>;
  title: React.ReactNode;
}

const SocialSelectItem = forwardRef<HTMLDivElement, ISocialProps>(
  ({ title, icon: Icon, ...others }: ISocialProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Icon size={18} stroke={1.5} />
        <Text size="sm" transform="capitalize">
          {title}
        </Text>
      </Group>
    </div>
  )
);

const CreateCampaignPage = ({ createCampaign }: any) => {
  const theme = useMantineTheme();
  const [active, setActive] = useState(0);
  const [target, setTarget] = useState("deadline");
  const [deadlineDate, setDeadlineDate] = useState<Date | null>(null);
  const [minimumCheck, setMinimumCheck] = useState(false);
  const [campaign, setCampaign] = useState({
    title: "",
    description: "",
    amount: "",
    deadline: "",
  });

  // console.log("Campaign Data:", campaign);

  const createNewCampaign = async (e: any) => {
    e.preventDefault();
    try {
      const data = await createCampaign(campaign);
    } catch (error) {
      console.log("Contract call Failure", error);
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: "",
  });

  const socialForm = useForm({
    initialValues: {
      employees: [{ name: "", active: false, key: randomId() }],
    },
  });

  const nextStep = () =>
    setActive((current: number) => (current < 4 ? current + 1 : current));
  const prevStep = () =>
    setActive((current: number) => (current > 0 ? current - 1 : current));

  const socialFields = socialForm.values.employees.map((item, index) => (
    <Group key={item.key} mt="xs">
      <Select
        aria-label="social"
        data={[
          { title: "Facebook", icon: IconBrandFacebook },
          { title: "Whatsapp", icon: IconBrandWhatsapp },
          { title: "LinkedIn", icon: IconBrandLinkedin },
          { title: "Twitter", icon: IconBrandTwitter },
          { title: "Youtube", icon: IconBrandYoutube },
          { title: "Other links", icon: IconLink },
        ].map((c) => ({ value: c.title, label: c.title, ...c }))}
        itemComponent={SocialSelectItem}
      />
      <TextInput
        placeholder="https://"
        sx={{ flex: 1 }}
        {...socialForm.getInputProps(`employees.${index}.name`)}
      />
      <ActionIcon
        color="red"
        onClick={() => socialForm.removeListItem("employees", index)}
      >
        <IconTrash size="1rem" />
      </ActionIcon>
    </Group>
  ));

  const titleProps: TitleProps = {
    size: 24,
    mb: "md",
  };

  const subTitleProps: TitleProps = {
    size: 18,
    mb: "sm",
  };

  const paperProps: PaperProps = {
    p: "md",
    withBorder: false,
    shadow: "sm",
    mb: "md",
    sx: { backgroundColor: theme.white },
  };

  return (
    <>
      <Helmet>
        <title>Create campaign</title>
      </Helmet>
      <Box>
        <Container my={36}>
          <Title mb="xl" align="center">
            Create your campaign
          </Title>
          <Stepper active={active} onStepClick={setActive} breakpoint="sm">
            <Stepper.Step
              label="Get started"
              description="Set essential fundraiser details such as fundraiser title, target and currency"
            >
              <Title {...titleProps}>Campaign information</Title>
              <Paper {...paperProps}>
                <SimpleGrid
                  cols={2}
                  breakpoints={[{ maxWidth: "sm", cols: 1 }]}
                >
                  <TextInput
                    label="Title"
                    onChange={(e) =>
                      setCampaign({ ...campaign, title: e.target.value })
                    }
                  />
                  <CategorySelect />
                </SimpleGrid>
              </Paper>
              <Paper {...paperProps}>
                <Title {...subTitleProps}>Campaign location</Title>
                <Text size="sm" mb="sm">
                  Please select the country that we&apos;ll be sending funds to
                  (typically where you&apos;re resident). This helps match you
                  to the correct payment processors.
                </Text>
                <SimpleGrid
                  cols={2}
                  breakpoints={[{ maxWidth: "sm", cols: 1 }]}
                >
                  <CountrySelect />
                  <TextInput
                    label="City"
                    placeholder="city"
                    onChange={(e) =>
                      setCampaign({ ...campaign, title: e.target.value })
                    }
                  />
                </SimpleGrid>
              </Paper>
              <Paper {...paperProps}>
                <Stack spacing="sm">
                  <Title {...subTitleProps}>Donation information</Title>
                  <CurrencySelect />
                  <Paper {...paperProps}>
                    {target === "deadline" ? (
                      <Stack spacing="xs">
                        <DateInput
                          value={deadlineDate}
                          onChange={(value) => {
                            setDeadlineDate(value);
                            setCampaign({
                              ...campaign,
                              deadline: value ? value.toISOString() : "",
                            });
                          }}
                          label="Deadline"
                          placeholder="Date input"
                          icon={<IconCalendar size={18} />}
                        />
                        <NumberInput
                          label="Target amount"
                          icon={<IconCurrencyDollar size={18} />}
                          onChange={(value) =>
                            setCampaign({
                              ...campaign,
                              amount: value ? value.toString() : "",
                            })
                          }
                        />
                        {/* <Checkbox label="Allow your fundraiser to be funded over the needed amount?" /> */}
                      </Stack>
                    ) : (
                      <Stack spacing="xs">
                        <Text size="sm">Ongoing (no deadline) fundraiser?</Text>
                        <Text size="sm">
                          This should be used if you are collecting money on a
                          regular basis.
                        </Text>
                        <Checkbox
                          checked={minimumCheck}
                          onChange={(event) =>
                            setMinimumCheck(event.currentTarget.checked)
                          }
                          label="Select this if you would like to set a specific a minimum financial target"
                        />
                        {minimumCheck && (
                          <NumberInput
                            label="Target amount"
                            icon={<IconCurrencyDollar size={18} />}
                          />
                        )}
                      </Stack>
                    )}
                  </Paper>
                </Stack>
              </Paper>
              {/* <Paper {...paperProps}>
                                <Title {...subTitleProps}>Donation type</Title>
                                <SegmentedControl
                                    size="md"
                                    value={donationType}
                                    onChange={setDonationType}
                                    data={[
                                        {label: 'Any (popular option)', value: 'any'},
                                        {label: 'Minimum', value: 'minimum'},
                                        {label: 'Fixed', value: 'fixed'},
                                    ]}
                                    mb="sm"
                                />
                                {donationType === 'minimum' ?
                                    <NumberInput label="Minimum amount(s)"/> :
                                    <NumberInput label="Fixed amount(s)"/>}
                                <Checkbox
                                    label="Would you like your fundraising page shown in more than one language?"
                                    mt="sm"
                                />
                            </Paper> */}
              <Paper {...paperProps}>
                <Stack spacing="sm">
                  <Title {...subTitleProps}>Fund & Registration details</Title>
                  <Text size="sm">
                    *Name of the person receiving funds. For organizations, the
                    legal representative name (this can be amended later).
                  </Text>
                  <SimpleGrid
                    cols={2}
                    breakpoints={[{ maxWidth: "sm", cols: 1 }]}
                  >
                    <TextInput label="First name" />
                    <TextInput label="Last name" />
                  </SimpleGrid>
                  <FileDropzone
                    label="Upload your profile picture"
                    description="This picture will be shown next to your name"
                  />
                  <Checkbox
                    label={
                      <>
                        I agree to the CrisisChain{" "}
                        <Anchor href="#" target="_blank">
                          terms and conditions & privacy policy
                        </Anchor>
                      </>
                    }
                  />
                </Stack>
              </Paper>
            </Stepper.Step>
            <Stepper.Step
              label="Campaign story"
              description="Tell your story! Add your description, images, videos and more"
            >
              <Title {...titleProps}>Your campaign story</Title>
              <Paper {...paperProps}>
                <Stack spacing="sm">
                  <Text size="sm">
                    Explain why you&apos;re raising money, what the funds will
                    be used for, and how much you value the support
                  </Text>
                  <RichTextEditor editor={editor}>
                    <RichTextEditor.Toolbar sticky stickyOffset={60}>
                      <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Bold />
                        <RichTextEditor.Italic />
                        <RichTextEditor.Underline />
                        <RichTextEditor.Strikethrough />
                        <RichTextEditor.ClearFormatting />
                        <RichTextEditor.Highlight />
                        <RichTextEditor.Code />
                      </RichTextEditor.ControlsGroup>

                      <RichTextEditor.ControlsGroup>
                        <RichTextEditor.H1 />
                        <RichTextEditor.H2 />
                        <RichTextEditor.H3 />
                        <RichTextEditor.H4 />
                      </RichTextEditor.ControlsGroup>

                      <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Blockquote />
                        <RichTextEditor.Hr />
                        <RichTextEditor.BulletList />
                        <RichTextEditor.OrderedList />
                        <RichTextEditor.Subscript />
                        <RichTextEditor.Superscript />
                      </RichTextEditor.ControlsGroup>

                      <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Link />
                        <RichTextEditor.Unlink />
                      </RichTextEditor.ControlsGroup>

                      <RichTextEditor.ControlsGroup>
                        <RichTextEditor.AlignLeft />
                        <RichTextEditor.AlignCenter />
                        <RichTextEditor.AlignJustify />
                        <RichTextEditor.AlignRight />
                      </RichTextEditor.ControlsGroup>
                    </RichTextEditor.Toolbar>

                    <RichTextEditor.Content />
                  </RichTextEditor>
                  <FileDropzone
                    label="Upload fundraiser photos"
                    description="You can select and upload several in one go"
                  />
                </Stack>
              </Paper>
            </Stepper.Step>
            <Stepper.Step label="Payment methods" description="Get full access">
              <Title {...titleProps}>Fundraiser Payment Methods</Title>
              <Paper {...paperProps}>
                <Stack spacing="sm">
                  <Title {...subTitleProps}>
                    Enable payment processors for your fundraising page
                  </Title>
                  <Alert icon={<IconCurrency size={18} />} color="blue">
                    You can enable GGF Card Payments (powered by MangoPay) if
                    you switch your currency from GBP to USD{" "}
                  </Alert>
                  <Text size="sm">Available payment methods</Text>
                  <Group>
                    <Button
                      variant="light"
                      leftIcon={<IconBrandPaypal size={18} />}
                    >
                      Connect with Paypal
                    </Button>
                    <Button
                      variant="light"
                      leftIcon={<IconBrandGoogle size={18} />}
                    >
                      Connect with Google Pay
                    </Button>
                    <Button
                      variant="light"
                      leftIcon={<IconBrandApple size={18} />}
                    >
                      Connect with Apple Pay
                    </Button>
                  </Group>
                </Stack>
              </Paper>
            </Stepper.Step>
            <Stepper.Completed>
              <Title {...titleProps} align="center" my="xl">
                Completed, take a seat while we finish setting up things for you
              </Title>
            </Stepper.Completed>
          </Stepper>

          <Group position="center" mt="xl">
            <Button
              variant="default"
              onClick={prevStep}
              leftIcon={<IconChevronLeft size={18} />}
            >
              Back
            </Button>
            {active < 4 ? (
              <Button
                onClick={nextStep}
                leftIcon={<IconChevronRight size={18} />}
              >
                Next step
              </Button>
            ) : (
              <Button
                component="a"
                href="/dashboard"
                leftIcon={<IconCheck size={18} />}
                onClick={(e) => createNewCampaign(e)}
              >
                Launch campaign
              </Button>
            )}
          </Group>
        </Container>
      </Box>
    </>
  );
};

export default CreateCampaignPage;
