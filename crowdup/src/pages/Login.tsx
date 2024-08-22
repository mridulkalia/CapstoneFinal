import {
  TextInput,
  PasswordInput,
  Checkbox,
  Radio,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  Divider,
} from "@mantine/core";
import { Helmet } from "react-helmet";
import { IconBrandFacebook, IconBrandGoogle } from "@tabler/icons-react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useState, ChangeEvent, FormEvent } from "react";
import { useAuth } from "../context/AuthProvider";

const LoginPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<{
    email: string;
    password: string;
    profile: string; // Added profile state
  }>({
    email: "",
    password: "",
    profile: "user", // Default profile is user
  });
  const navigate = useNavigate();
  const { login } = useAuth(); // Use login function from context

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log("Form data:", formData);
      // setLoading(true);
      const response = await axios.post(
        "http://localhost:8000/login",
        formData
      );
      console.log("Server response:", response);

      // Check the status and message from the response
      if (response.data.status === false) {
        console.error("Login failed:", response.data.msg || "Unknown error");
      } else {
        localStorage.setItem("role", formData.profile);
        // Assume `login` is a function to handle additional login tasks
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
        <Title align="center" sx={{ fontWeight: 900 }}>
          Welcome back!
        </Title>
        <Text color="dimmed" size="sm" align="center" mt={5}>
          Do not have an account yet?{" "}
          <Anchor size="sm" component={Link} to="/register">
            Create account
          </Anchor>
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
          <Group grow mb="md" mt="md">
            <Button
              radius="xl"
              leftIcon={<IconBrandFacebook size={18} />}
              disabled={loading}
            >
              Facebook
            </Button>
            <Button
              radius="xl"
              leftIcon={<IconBrandGoogle size={18} />}
              disabled={loading}
            >
              Google
            </Button>
          </Group>
          <Divider
            label="Or continue with email"
            labelPosition="center"
            my="lg"
          />
          <TextInput
            label="Email"
            placeholder="you@example.com"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
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

          {/* Profile Selection */}
          <Radio.Group
            name="profile"
            label="Select your profile"
            value={formData.profile}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, profile: value }))
            }
            required
          >
            <Radio value="user" label="User" />
            <Radio value="admin" label="Admin" />
          </Radio.Group>

          <Group position="apart" mt="lg">
            <Anchor component={Link} size="sm" to="/forgot-password">
              Forgot password?
            </Anchor>
          </Group>
          <Button type="submit" fullWidth mt="xl" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </Paper>
      </Container>
    </>
  );
};

export default LoginPage;
