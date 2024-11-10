import {
  Avatar,
  Button,
  Flex,
  Paper,
  PaperProps,
  Stack,
  Text,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { IconSend } from "@tabler/icons-react";
import userData from "../data/User.json";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ICampaign } from "../types";

type IProps = PaperProps;

const UserCard = ({ ...others }: IProps) => {
  const { id } = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<ICampaign | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/campaigns/${id}`
        );
        setCampaign(response.data.campaign);
        setLoading(false);
        setError(null);
      } catch (error) {
        setError("Failed to fetch user data");
        setLoading(false); // Set loading to false on error
      }
    };

    if (id) {
      fetchCampaignData(); // Fetch data if _id is available
    }
  }, [id]);

  if (loading) {
    return <Text>Loading...</Text>; // Show loading state
  }

  if (error) {
    return <Text color="red">{error}</Text>; // Show error message if there was a failure fetching data
  }
  const imageUrl = `http://localhost:8000/${campaign?.profilePicture.replace(
    /\\/g,
    "/"
  )}`;

  return (
    <Paper {...others}>
      <Flex gap="lg" align="center">
        <Avatar src={imageUrl} size={120} radius={120} />
        <Stack spacing="xs" align="flex-start">
          <Text ta="center" fz="lg" weight={500}>
            {campaign?.organizationName}
          </Text>
          <Text ta="center" c="dimmed" fz="sm">
            {campaign?.organizationEmail} • {campaign?.campaignType}
          </Text>

          <Button variant="light" leftIcon={<IconSend size={18} />} fullWidth>
            Send message
          </Button>
        </Stack>
      </Flex>
    </Paper>
  );
};

export default UserCard;
