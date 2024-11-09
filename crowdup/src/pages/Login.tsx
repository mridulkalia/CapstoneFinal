import {
  TextInput,
  PasswordInput,
  Radio,
  Anchor,
  Paper,
  Text,
  Container,
  Group,
  Button,
  Divider,
} from "@mantine/core";
import { Helmet } from "react-helmet";
import { IconBuildingHospital } from "@tabler/icons-react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import { showError, showSuccess } from "../utils/notifications";

const LoginPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<{
    email: string;
    password: string;
    profile: string;
  }>({
    email: "",
    password: "",
    profile: "user", // Default profile is user
  });
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log("Form data:", formData);
      const response = await axios.post(
        "http://localhost:8000/login",
        formData
      );
      console.log("Server response:", response);

      if (response.data.status === false) {
        console.error("Login failed:", response.data.msg || "Unknown error");
        showError(response.data.msg || "Login failed. Please try again.");
      } else {
        localStorage.setItem("role", formData.profile);
        showSuccess("Login successful! Redirecting...");
        login(formData.profile);
        navigate("/");
      }
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error)) {
        console.error(
          "Error during login:",
          error.response?.data?.message || error.message
        );
      } else if (error instanceof Error) {
        console.error("Error during login:", error.message);
      } else {
        console.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <Container size={420} my={40}>
        <Text color="#276749" size="sm" align="center" mt={5}>
          <span style={{ fontWeight: 800, fontSize: "46px" }}>
            Welcome Back!
          </span>
        </Text>
        <Text color="#276749" size="sm" align="center" mt={5}>
          <span style={{ fontWeight: 600, fontSize: "16px" }}>
            Don't have an account?{" "}
          </span>
          <Anchor
            size="sm"
            component={Link}
            to="/register"
            color="green"
            style={{
              fontWeight: 800,
              fontSize: "16px",
              color: "#276749",
              display: "inline-flex",
              alignItems: "center",
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLAnchorElement;
              target.style.color = "#1d4e2e"; // Slightly darker on hover
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLAnchorElement;
              target.style.color = "#276749"; // Back to original on hover out
            }}
          >
            SIGN UP HERE
          </Anchor>
        </Text>

        <Paper
          withBorder
          shadow="lg"
          p={35}
          mt={30}
          radius="lg"
          component="form"
          onSubmit={submitHandler}
          sx={{
            borderColor: "#276749",
            backgroundColor: "#eaf6f0", // light greenish background for subtle contrast
            padding: "30px",
          }}
        >
          <Text color="#276749" size="sm" align="center" mt={5}>
            <span style={{ fontWeight: 600, fontSize: "16px" }}>
              Are you an NGO/Hospital?{" "}
            </span>
            <Anchor
              size="sm"
              component={Link}
              to="/login-ngo-hospital"
              color="green"
              style={{
                fontWeight: 700,
                fontSize: "16px",
                color: "#276749",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              <IconBuildingHospital size={18} style={{ marginRight: "8px" }} />
              <span>Login your NGO/Hospital</span>
            </Anchor>
          </Text>

          <Divider
            label="Or continue as User"
            labelPosition="center"
            my="lg"
            color="#276749"
          />

          <TextInput
            label="Email"
            placeholder="Your email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
            sx={{
              ".mantine-TextInput-label": { color: "#276749" },
              marginBottom: "15px",
              borderRadius: "8px",
            }}
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
            sx={{
              ".mantine-PasswordInput-label": { color: "#276749" },
              marginBottom: "15px",
              borderRadius: "8px",
            }}
          />

          <Radio.Group
            name="profile"
            label="Select your profile"
            value={formData.profile}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, profile: value }))
            }
            required
            sx={{
              marginBottom: "15px",
              color: "#276749",
              "& .mantine-Radio-label": {
                color: "#276749",
                fontWeight: 500,
              },
            }}
          >
            <Radio
              value="user"
              label="User"
              style={{
                color: "#276749",
                marginTop: 4,
                marginBottom: 5,
              }}
            />
            <Radio
              value="admin"
              label="Admin"
              style={{
                color: "#276749",
              }}
            />
          </Radio.Group>

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
            color="green"
            sx={{
              backgroundColor: "#276749",
              ":hover": { backgroundColor: "#1d5242" },
            }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </Paper>
      </Container>
    </>
  );
};

export default LoginPage;
