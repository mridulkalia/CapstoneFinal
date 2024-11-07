import {
  Anchor,
  Button,
  Container,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
} from "@mantine/core";
import { Helmet } from "react-helmet";
import { IconBuildingHospital } from "@tabler/icons-react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";

const SignupPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    password: string;
  }>({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

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
      setLoading(true);
      console.log("Form Data:", formData);
      await axios.post("http://localhost:8000/register", formData);
      setLoading(false);
      navigate("/login");
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Signup</title>
      </Helmet>
      <Container size={420} my={40}>
        <Text color="#276749" size="sm" align="center" mt={5}>
          <span style={{ fontWeight: 800, fontSize: "46px" }}>
            Create Account{" "}
          </span>
        </Text>

        <Text color="#276749" size="sm" align="center" mt={5}>
          <span style={{ fontWeight: 600, fontSize: "16px" }}>
            Already a member?{" "}
          </span>
          <Anchor
            size="sm"
            component={Link}
            to="/login"
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
            LOGIN HERE
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
            backgroundColor: "#eaf6f0",
            padding: "30px",
          }}
        >
          <Text color="#276749" size="sm" align="center" mt={5}>
            <span style={{ fontWeight: 600, fontSize: "16px" }}>
              Are you an NGO or Hospital?{" "}
            </span>
            <Anchor
              size="sm"
              component={Link}
              to="/register-ngo-hospital"
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
              <span>Register your NGO/Hospital</span>
            </Anchor>
          </Text>

          <Divider
            label="Or continue as User"
            labelPosition="center"
            my="lg"
            color="#276749"
          />

          <TextInput
            label="Name"
            placeholder="Your name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
            sx={{
              ".mantine-TextInput-label": { color: "#276749" },
              marginBottom: "15px",
              borderRadius: "8px",
            }}
          />
          <TextInput
            label="Email"
            placeholder="Your email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
            mt="md"
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

          <Group position="apart" mt="lg">
            <Anchor
              component={Link}
              size="sm"
              to="/forgot-password"
              color="#276749"
            >
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
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </Paper>
      </Container>
    </>
  );
};

export default SignupPage;
