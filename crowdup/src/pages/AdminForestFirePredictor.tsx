import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Select,
  Button,
  Stack,
  TextInput,
  Notification,
  Group,
  Text,
} from "@mantine/core";
import axios from "axios";

const statesAndUTs = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

const AdminForestFirePredictor: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [weatherDetails, setWeatherDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchWeatherDetails = async (state: string) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/weather/${state}`
      );
      setWeatherDetails(response.data);
      setError(null);
    } catch (err) {
      setWeatherDetails(null);
      setError("Failed to fetch weather details. Please try again.");
      console.error(err);
    }
  };

  const predictForestFire = async () => {
    if (!weatherDetails) {
      setError("Weather details are required for prediction.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/predict-forest-fire",
        weatherDetails
      );
      setSuccess(
        "Forest fire prediction completed successfully! Check the results."
      );
      setError(null);
      console.log(response.data); // Log prediction results for debugging
    } catch (err) {
      setError("Failed to predict forest fire. Please try again.");
      setSuccess(null);
      console.error(err);
    }
  };

  return (
    <Container size="md" py="xl">
      <Card shadow="sm" padding="lg">
        <Text align="center" size="xl" weight={700} mb="md">
          Admin Forest Fire Predictor
        </Text>

        {error && (
          <Notification color="red" onClose={() => setError(null)}>
            {error}
          </Notification>
        )}

        {success && (
          <Notification color="green" onClose={() => setSuccess(null)}>
            {success}
          </Notification>
        )}

        <Stack spacing="md">
          {/* State/UT Selection */}
          <Select
            label="Select State/Union Territory"
            placeholder="Choose a state/UT"
            data={statesAndUTs.map((state) => ({ value: state, label: state }))}
            value={selectedState}
            onChange={(value) => {
              setSelectedState(value);
              if (value) fetchWeatherDetails(value);
            }}
          />

          {/* Weather Details Display */}
          {weatherDetails && (
            <Card shadow="sm" padding="md" withBorder>
              <Stack spacing="sm">
                <TextInput
                  label="Temperature (°C)"
                  value={weatherDetails.temperature || ""}
                  disabled
                />
                <TextInput
                  label="Humidity (%)"
                  value={weatherDetails.humidity || ""}
                  disabled
                />
                <TextInput
                  label="Wind Speed (km/h)"
                  value={weatherDetails.windSpeed || ""}
                  disabled
                />
                <TextInput
                  label="Precipitation (mm)"
                  value={weatherDetails.precipitation || ""}
                  disabled
                />
              </Stack>
            </Card>
          )}

          {/* Predict Button */}
          <Group position="center">
            <Button onClick={predictForestFire} disabled={!weatherDetails}>
              Predict Forest Fire
            </Button>
          </Group>
        </Stack>
      </Card>
    </Container>
  );
};

export default AdminForestFirePredictor;
