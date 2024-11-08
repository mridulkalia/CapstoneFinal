import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  Divider,
  Anchor,
  Radio,
} from "@mantine/core";
import { Helmet } from "react-helmet";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useState, ChangeEvent, FormEvent } from "react";

const LoginNGOHospitalPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<{
    email: string;
    registrationNumber: string;
    password: string;
  }>({
    email: "",
    registrationNumber: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Form data:", formData);
      const response = await axios.post(
        "http://localhost:8000/login-hospital",
        formData
      );
      console.log(response);
      if (response.data.status === false) {
        console.error("Login failed:", response.data.msg || "Unknown error");
      } else {
        const { city } = response.data.organization;
        console.log(city);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("role", "ngo_hospital"); // Set role after login success
        if (city) {
          localStorage.setItem("userCity", city); // Save userCity in local storage
        } else {
          console.error("City is not available in the response.");
        }
        navigate("/");
      }
    } catch (error) {
      console.error("Error during login:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>NGO/Hospital Login</title>
      </Helmet>
      <Container size={420} my={40}>
        <Title align="center" sx={{ fontWeight: 900 }}>
          Welcome NGO/Hospital!
        </Title>
        <Text color="dimmed" size="sm" align="center" mt={5}>
          Enter your credentials to login
        </Text>

        <Paper
          withBorder
          shadow="md"
          p={30}
          mt={30}
          radius="md"
          component="form"
          onSubmit={submitHandler}
        >
          <TextInput
            label="Email"
            placeholder="you@example.com"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <TextInput
            label="Registration Number"
            placeholder="Your registration number"
            name="registrationNumber"
            value={formData.registrationNumber}
            onChange={handleChange}
            required
            mt="md"
            disabled={loading}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            mt="md"
            disabled={loading}
          />

          <Group position="apart" mt="lg">
            <Anchor component={Link} size="sm" to="/forgot-password">
              Forgot password?
            </Anchor>
          </Group>
          <Button type="submit" fullWidth mt="xl" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Paper>
      </Container>
    </>
  );
};

export default LoginNGOHospitalPage;
