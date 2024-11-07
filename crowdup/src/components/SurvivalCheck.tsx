// SurvivalKitChecklist.tsx
import React, { useState } from "react";
import { Checkbox, Progress, Card, Text, Group } from "@mantine/core";

const checklistItems = [
  "Water (at least 3 days' supply)",
  "Non-perishable food",
  "Flashlight with extra batteries",
  "First aid kit",
  "Portable charger",
  "Whistle to signal for help",
  "Dust mask",
  "Local maps",
  "Medications",
];

const SurvivalKitChecklist: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const handleCheck = (item: string) => {
    setCheckedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const completionPercentage =
    (checkedItems.length / checklistItems.length) * 100;

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Text weight={600} size="lg" mb="sm">
        Survival Kit Checklist
      </Text>
      <Text color="dimmed" size="sm">
        Check off items as you prepare them to see your readiness level.
      </Text>

      <Progress
        value={completionPercentage}
        color="green"
        size="xl"
        radius="xl"
        mt="md"
      />

      <div style={{ marginTop: "1em" }}>
        {checklistItems.map((item) => (
          <Checkbox
            key={item}
            label={item}
            checked={checkedItems.includes(item)}
            onChange={() => handleCheck(item)}
            mb="xs"
          />
        ))}
      </div>

      <Group position="apart" mt="lg">
        <Text>{completionPercentage.toFixed(0)}% Complete</Text>
        <Text color={completionPercentage === 100 ? "green" : "red"}>
          {completionPercentage === 100
            ? "You're fully prepared!"
            : "Keep preparing!"}
        </Text>
      </Group>
    </Card>
  );
};

export default SurvivalKitChecklist;
