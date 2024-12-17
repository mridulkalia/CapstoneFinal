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
  const [predictionResult, setPredictionResult] = useState(null);
  const [probab, setProbab] = useState(null);


  const fetchWeatherDetails = async (state: string) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/weather/${state}`
      );
      setWeatherDetails({
        temperature: response.data.temperature,
        humidity: response.data.humidity,
        precipitation: response.data.precipitation,
        oxygen: response.data.ozone, // Added Ozone (O3)
        windSpeed: response.data.windSpeed || 0, // Default to 0 if windSpeed is not available
      });
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
      // Prepare the data to send as URLSearchParams (application/x-www-form-urlencoded)
      const requestBody = new URLSearchParams();
      requestBody.append("temperature", parseFloat(weatherDetails.temperature).toString());
      requestBody.append("humidity", parseFloat(weatherDetails.humidity).toString());
      requestBody.append("oxygen", parseFloat(weatherDetails.oxygen || "0").toString()); // Default to 0 if not available
  
      console.log("Sending request with body:", requestBody.toString());

      // Send the request to the backend with application/x-www-form-urlencoded
      const response = await axios.post("http://localhost:8000/predict", requestBody, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded", // Specify x-www-form-urlencoded content type
        },
      });

      setPredictionResult(response.data.prediction);
      setProbab(response.data.probability)
      setSuccess("Forest fire prediction completed successfully! Check the results.");
      setError(null);
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
                  label="Precipitation (mm)"
                  value={weatherDetails.precipitation || "No rain"}
                  disabled
                />
                <TextInput
                  label="Oxygen (µg/m³)" //
                  value={weatherDetails.oxygen || "Unavailable"}
                  disabled
                />
                <TextInput
                  label="Wind Speed (km/h)" //
                  value={weatherDetails.windSpeed || "Unavailable"}
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
          {predictionResult && (
            <Card shadow="sm" padding="md" withBorder>
              <Text align="center" size="lg" weight={500}>
                Prediction: {predictionResult } with probabilty { probab}
              </Text>
            </Card>
          )}
        </Stack>
      </Card>
    </Container>
  );
};

export default AdminForestFirePredictor;
