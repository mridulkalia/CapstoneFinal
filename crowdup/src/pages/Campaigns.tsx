import { useEffect, useState } from "react";
import {
  Box,
  BoxProps,
  Container,
  Flex,
  Select,
  SimpleGrid,
  Stack,
  TextInput,
  Title,
  TitleProps,
} from "@mantine/core";
import { CampaignCard } from "../components";
import { Helmet } from "react-helmet";
import { useMediaQuery } from "@mantine/hooks";
import axios from "axios";
import { ICampaign } from "../types";

interface Campaign {
  _id: string;
  title: string;
  description: string;
  amount: number;
  targetAmount: number;
  profilePicture: string; // Include this field
  location: {
    country: string;
    city: string;
  };
  deadline: number;
  organizerContact: string;
  campaignType: string;
  contactPersonName: string; // Include this field
  organizationEmail: string;
  organizationName: string;
  status: string;
  createdAt: string;
}

const CampaignsPage = (): JSX.Element => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const matchesMobile = useMediaQuery("(max-width: 768px)");

  const boxProps: BoxProps = {
    mt: matchesMobile ? 4 : 24,
    mb: matchesMobile ? 4 : 48,
  };

  const titleProps: TitleProps = {
    size: 32,
    weight: 700,
    mb: "lg",
    transform: "capitalize",
    sx: { lineHeight: "40px" },
  };

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get("http://localhost:8000/campaigns");
        console.log("Fetched campaigns:", response.data.campaigns);
        setCampaigns(response.data.campaigns);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      }
    };

    fetchCampaigns();
  }, []);

  const items = campaigns.map((c) => (
    <CampaignCard
      key={c._id}
      data={{
        ...c,
        _id: c._id,
        profilePicture: c.profilePicture,
        amount: c.amount || 0,
        targetAmount: c.targetAmount || 0,
        location: c.location || { country: "Unknown", city: "Unknown" },
        deadline: c.deadline,
        // Include any other required fields with defaults if needed
      }}
      showActions={true}
    />
  ));

  return (
    <>
      <Helmet>
        <title>Discover campaigns to fund</title>
      </Helmet>
      <Box>
        <Container size="lg">
          <Stack>
            <Box {...boxProps}>
              <Title {...titleProps} align="center">
                Discover campaigns to fund
              </Title>
            </Box>
            <Flex
              justify="space-between"
              gap={{ base: "sm", sm: "lg" }}
              direction={{ base: "column-reverse", sm: "row" }}
            >
              <TextInput
                placeholder="search campaigns..."
                sx={{ width: 500 }}
              />
              <Flex
                align="center"
                gap="sm"
                justify={{ base: "space-between", sm: "flex-start" }}
              >
                <Select
                  label=""
                  placeholder="campaigns in"
                  defaultValue=""
                  data={[
                    { value: "10", label: "show: 10" },
                    { value: "25", label: "show: 25" },
                    { value: "50", label: "show: 50" },
                    { value: "100", label: "show: 100" },
                  ]}
                />
                <Select
                  label=""
                  placeholder="Explore"
                  defaultValue="featured"
                  data={[
                    { value: "featured", label: "sort by: featured" },
                    { value: "popular", label: "sort by: popular" },
                    { value: "latest", label: "sort by: latest" },
                  ]}
                />
              </Flex>
            </Flex>
            <SimpleGrid
              cols={3}
              spacing="lg"
              breakpoints={[
                { maxWidth: "md", cols: 2, spacing: "md" },
                { maxWidth: "sm", cols: 1, spacing: 0 },
              ]}
            >
              {items}
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default CampaignsPage;
