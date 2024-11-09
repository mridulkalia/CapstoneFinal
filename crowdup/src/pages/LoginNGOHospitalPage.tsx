import {
  TextInput,
  PasswordInput,
  Paper,
  Text,
  Container,
  Group,
  Button,
  Anchor,
} from "@mantine/core";
import { Helmet } from "react-helmet";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useState, ChangeEvent, FormEvent } from "react";
import { showNotification } from "@mantine/notifications";

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
      const response = await axios.post(
        "http://localhost:8000/login-hospital",
        formData
      );
      if (response.data.status === false) {
        console.error("Login failed:", response.data.msg || "Unknown error");
        showNotification({
          title: "Login Failed",
          message: response.data.msg || "Unknown error. Please try again.",
          color: "red",
        });
        
      } else {
        const { city } = response.data.organization;
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("role", "ngo_hospital");
        if (city) {
          localStorage.setItem("userCity", city);
        } else {
          console.error("City is not available in the response.");
          showNotification({
            title: "Warning",
            message: "City information is not available in the response.",
            color: "orange",
          });
          
        }
        navigate("/");
        showNotification({
          title: "Success",
          message: "Logged in successfully!",
          color: "green",
        });
        
      }
    } catch (error) {
      console.error("Error during login:", error);
      showNotification({
        title: "Error",
        message: "An error occurred during login. Please check your details and try again.",
        color: "red",
      });
      
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
        <Button
          variant="outline"
          color="dark"
          size="sm"
          style={{
            position: "absolute",
            top: 55,
            right: 40,
            padding: "5px 10px",
            fontSize: "14px",
          }}
          onClick={() => navigate("/login")}
        >
          Login as User
        </Button>

        <Text color="#276749" size="sm" align="center" mt={5}>
          <span style={{ fontWeight: 800, fontSize: "46px" }}>
            Your Gateway to Aid & Impact
          </span>
        </Text>
        <Text color="#276749" size="sm" align="center" mt={5}>
          <span style={{ fontWeight: 600, fontSize: "16px" }}>
            Enter your credentials to login
          </span>
        </Text>

        <Paper
          withBorder
          shadow="md"
          p={30}
          mt={30}
          radius="lg"
          component="form"
          onSubmit={submitHandler}
          sx={{
            backgroundColor: "#eaf6f0",
            borderColor: "#276749",
          }}
        >
          <TextInput
            label="Email"
            placeholder="you@example.com"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
            styles={{ label: { color: "#276749" } }}
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
            styles={{ label: { color: "#276749" } }}
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
            styles={{ label: { color: "#276749" } }}
          />

          <Group position="apart" mt="lg">
            <Anchor component={Link} size="sm" to="/forgot-password">
              Forgot password?
            </Anchor>
          </Group>
          <Button
            type="submit"
            fullWidth
            mt="xl"
            disabled={loading}
            sx={{
              backgroundColor: "#276749",
              "&:hover": { backgroundColor: "#1d5242" },
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Paper>
      </Container>
    </>
  );
};

export default LoginNGOHospitalPage;
