import React, { useState } from "react";
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
  Loader,
} from "@mantine/core";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  const [predictionResult, setPredictionResult] = useState(null);
  const [probab, setProbab] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchWeatherDetails = async (state: string) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/weather/${state}`
      );
      setWeatherDetails({
        temperature: response.data.temperature,
        humidity: response.data.humidity,
        precipitation: response.data.precipitation,
        oxygen: response.data.ozone,
        windSpeed: response.data.windSpeed || 0,
      });
      setError(null);
    } catch (err) {
      setWeatherDetails(null);
      setError("Failed to fetch weather details. Please try again.");
    }
  };

  const predictForestFire = async () => {
    if (!weatherDetails) {
      setError("Weather details are required for prediction.");
      return;
    }

    setLoading(true);
    setTimeout(async () => {
      try {
        const requestBody = new URLSearchParams();
        requestBody.append(
          "temperature",
          parseFloat(weatherDetails.temperature).toString()
        );
        requestBody.append(
          "humidity",
          parseFloat(weatherDetails.humidity).toString()
        );
        requestBody.append(
          "oxygen",
          parseFloat(weatherDetails.oxygen || "0").toString()
        );

        const response = await axios.post(
          "http://localhost:8000/predict",
          requestBody,
          {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
          }
        );

        setPredictionResult(response.data.prediction);
        setProbab(response.data.probability);
        setSuccess("Forest fire prediction completed successfully!");
        setError(null);
      } catch (err) {
        setError("Failed to predict forest fire. Please try again.");
        setSuccess(null);
      } finally {
        setLoading(false);
      }
    }, 3000); // Simulate a 3-second delay
  };

  return (
    <Container size="md" py="xl">
      <Card shadow="sm" padding="lg" radius="md">
        <Text align="center" size="xl" weight={700} mb="md">
          Forest Fire Predictor
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
          <Select
            label="Select State/Union Territory"
            placeholder="Choose a state/UT"
            data={statesAndUTs.map((state) => ({ value: state, label: state }))}
            value={selectedState}
            onChange={(value) => {
              setSelectedState(value);
              if (value) fetchWeatherDetails(value);
            }}
            searchable
            dropdownPosition="bottom" // Ensures dropdown always opens below the input
            withinPortal // Renders the dropdown outside parent containers to avoid clipping
          />

          {weatherDetails && (
            <Card shadow="sm" padding="md" radius="md" withBorder>
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
                  label="Precipitation (mm)"
                  value={weatherDetails.precipitation || "No rain"}
                  disabled
                />
                <TextInput
                  label="Oxygen (µg/m³)"
                  value={weatherDetails.oxygen || "Unavailable"}
                  disabled
                />
                <TextInput
                  label="Wind Speed (km/h)"
                  value={weatherDetails.windSpeed || "Unavailable"}
                  disabled
                />
              </Stack>
            </Card>
          )}

          <Group position="center">
            <Button
              onClick={predictForestFire}
              disabled={!weatherDetails || loading}
            >
              {loading ? <Loader size="xs" /> : "Predict Forest Fire"}
            </Button>
            <Button
              onClick={() => navigate("/dashboard")}
              disabled={!weatherDetails || loading}
            >
              {loading ? <Loader size="xs" /> : "Raise Alert"}
            </Button>
          </Group>

          {predictionResult && (
            <Card shadow="sm" padding="md" radius="md" withBorder>
              <Text align="center" size="lg" weight={500}>
                Prediction: {predictionResult} with probability {probab}
              </Text>
            </Card>
          )}
        </Stack>
      </Card>
    </Container>
  );
};

export default AdminForestFirePredictor;
