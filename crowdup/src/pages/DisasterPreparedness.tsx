import React, { useState } from "react";
import {
  Container,
  Select,
  Card,
  Title,
  Text,
  Stack,
  Button,
  Collapse,
  Divider,
  Group,
  List,
  ThemeIcon,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconFlame,
  IconShieldCheck,
  IconHeartbeat,
} from "@tabler/icons-react";
import SurvivalKitChecklist from "../components/SurvivalCheck";
import DisasterMap from "../components/DisasterMap";

interface DisasterInfo {
  title: string;
  steps: string[];
  precautions: string[];
  supplies: string[];
  facts: string[];
  myths: string[];
}

const disasterData: { [key: string]: DisasterInfo } = {
  Earthquake: {
    title: "Earthquake",
    steps: [
      "Drop, Cover, and Hold On",
      "Stay away from windows",
      "If outdoors, move to an open area",
    ],
    precautions: [
      "Secure heavy furniture",
      "Have an emergency plan",
      "Identify safe spots indoors",
    ],
    supplies: ["First-aid kit", "Flashlight", "Emergency food and water"],
    facts: [
      "Most injuries occur from falling debris",
      "Aftershocks are common",
      "Prepare an emergency kit",
    ],
    myths: [
      "Stand in doorways",
      "Earthquakes can be predicted",
      "Tall buildings are safest",
    ],
  },
  Flood: {
    title: "Flood",
    steps: [
      "Move to higher ground immediately",
      "Avoid walking through water",
      "Listen to emergency alerts",
    ],
    precautions: [
      "Know your evacuation routes",
      "Avoid driving during floods",
      "Prepare a flood emergency kit",
    ],
    supplies: [
      "Waterproof clothing",
      "Battery-powered radio",
      "Non-perishable food",
    ],
    facts: [
      "6 inches of water can knock you down",
      "Most flood deaths occur in vehicles",
      "Floods can occur anywhere",
    ],
    myths: [
      "Only coastal areas flood",
      "Insurance always covers flood damage",
      "Swimming skills will save you",
    ],
  },
  Tsunami: {
    title: "Tsunami",
    steps: [
      "Move to higher ground immediately",
      "Avoid the shore and stay inland",
      "Listen to emergency broadcasts",
    ],
    precautions: [
      "Learn the signs of a tsunami",
      "Know evacuation routes",
      "Practice evacuation drills",
    ],
    supplies: ["Life jackets", "Portable radio", "Non-perishable food"],
    facts: [
      "Tsunamis can occur without warning",
      "They are caused by underwater earthquakes",
      "Multiple waves can occur over hours",
    ],
    myths: [
      "Tsunamis only happen in the ocean",
      "Small tsunamis aren’t dangerous",
      "The first wave is the largest",
    ],
  },
  Hurricane: {
    title: "Hurricane",
    steps: [
      "Evacuate if directed by authorities",
      "Move to a safe room or basement",
      "Avoid windows and stay indoors",
    ],
    precautions: [
      "Have a family emergency plan",
      "Secure outdoor items",
      "Stock up on essentials",
    ],
    supplies: ["Battery-powered radio", "Flashlights", "Emergency food"],
    facts: [
      "Hurricanes can cause flooding",
      "Storm surges are extremely dangerous",
      "Hurricanes weaken as they move inland",
    ],
    myths: [
      "Taping windows prevents breakage",
      "Only coastal areas are at risk",
      "The storm's center is the most dangerous",
    ],
  },
  ViralOutbreak: {
    title: "Viral Outbreak",
    steps: [
      "Avoid crowded places",
      "Wear a mask in public",
      "Isolate if you show symptoms",
    ],
    precautions: [
      "Practice good hygiene",
      "Avoid touching your face",
      "Stay informed on health advisories",
    ],
    supplies: ["Hand sanitizer", "Masks", "Thermometer"],
    facts: [
      "Viral outbreaks can spread rapidly",
      "Proper hygiene reduces transmission",
      "Vaccines help prevent infection",
    ],
    myths: [
      "Only sick people need masks",
      "You can self-diagnose",
      "Outbreaks only affect certain regions",
    ],
  },
  // Add more disasters as needed
};

const DisasterInfoPage: React.FC = () => {
  const [selectedDisaster, setSelectedDisaster] = useState<string | null>(null);
  const [checklistVisible, setChecklistVisible] = useState(false);

  const handleDisasterChange = (value: string | null) => {
    setSelectedDisaster(value);
  };
  const toggleChecklistVisibility = () => {
    setChecklistVisible((prev) => !prev);
  };

  return (
    <div style={{ padding: "2em" }}>
      <Container>
        <Title align="center" my="lg">
          Disaster Preparedness Guide
        </Title>
        <Text align="center" color="dimmed" mb="lg">
          Stay informed and prepared for natural and man-made disasters.
        </Text>

        <Select
          placeholder="Select a disaster"
          data={Object.keys(disasterData)}
          value={selectedDisaster}
          onChange={handleDisasterChange}
          size="lg"
          mb="lg"
          clearable
        />

        {selectedDisaster && (
          <Card
            shadow="lg"
            padding="xl"
            radius="md"
            style={{ marginTop: "20px" }}
          >
            <Group position="apart">
              <Title order={3}>{disasterData[selectedDisaster].title}</Title>
              <Button
                color="blue"
                variant="light"
                leftIcon={<IconShieldCheck size={18} />}
              >
                Learn More
              </Button>
            </Group>

            <Divider my="sm" />

            {/* Immediate Actions Section */}
            <Stack spacing="xs">
              <Group align="center" spacing="xs">
                <ThemeIcon color="red" size="lg">
                  <IconAlertCircle />
                </ThemeIcon>
                <Text weight={600} size="lg">
                  Immediate Actions:
                </Text>
              </Group>
              <List spacing="xs" size="sm" withPadding>
                {disasterData[selectedDisaster].steps.map((step, index) => (
                  <List.Item key={index}>{step}</List.Item>
                ))}
              </List>

              {/* Safety Precautions Section */}
              <Group align="center" spacing="xs">
                <ThemeIcon color="orange" size="lg">
                  <IconShieldCheck />
                </ThemeIcon>
                <Text weight={600} size="lg">
                  Safety Precautions:
                </Text>
              </Group>
              <List spacing="xs" size="sm" withPadding>
                {disasterData[selectedDisaster].precautions.map(
                  (precaution, index) => (
                    <List.Item key={index}>{precaution}</List.Item>
                  )
                )}
              </List>

              {/* Essential Supplies Section */}
              <Group align="center" spacing="xs">
                <ThemeIcon color="teal" size="lg">
                  <IconHeartbeat />
                </ThemeIcon>
                <Text weight={600} size="lg">
                  Essential Supplies:
                </Text>
              </Group>
              <List spacing="xs" size="sm" withPadding>
                {disasterData[selectedDisaster].supplies.map(
                  (supply, index) => (
                    <List.Item key={index}>{supply}</List.Item>
                  )
                )}
              </List>

              {/* Myths vs Facts Section */}
              <Group align="center" spacing="xs">
                <ThemeIcon color="violet" size="lg">
                  <IconFlame />
                </ThemeIcon>
                <Text weight={600} size="lg">
                  Myths vs Facts:
                </Text>
              </Group>
              <List spacing="xs" size="sm" withPadding>
                {disasterData[selectedDisaster].myths.map((myth, index) => (
                  <List.Item key={index}>
                    <strong>Myth:</strong> {myth} <br />
                    <strong>Fact:</strong>{" "}
                    {disasterData[selectedDisaster].facts[index]}
                  </List.Item>
                ))}
              </List>
            </Stack>

            <Divider my="lg" />

            {/* Emergency Contact Button */}
            <Stack align="center" mt="lg">
              <Button variant="filled" color="red" size="md">
                Emergency Contact Info
              </Button>
            </Stack>
          </Card>
        )}
        <div style={{ marginTop: 40 }}>
          <DisasterMap />
        </div>
        <Card shadow="sm" p="lg" radius="md" withBorder mt="lg">
          <Button
            onClick={toggleChecklistVisibility}
            variant="outline"
            color="green"
            fullWidth
            size="md"
          >
            {checklistVisible
              ? "Hide Survival Kit Checklist"
              : "Prepare Survival Kit"}
          </Button>

          <Collapse in={checklistVisible} mt="md">
            <SurvivalKitChecklist />
          </Collapse>
        </Card>
      </Container>
    </div>
  );
};

export default DisasterInfoPage;
