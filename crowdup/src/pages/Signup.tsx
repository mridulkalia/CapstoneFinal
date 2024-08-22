import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { Helmet } from "react-helmet";
import { IconBrandFacebook, IconBrandGoogle } from "@tabler/icons-react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useState, ChangeEvent, FormEvent } from "react";

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
        <Title align="center" sx={{ fontWeight: 900 }}>
          Welcome back!
        </Title>
        <Text color="dimmed" size="sm" align="center" mt={5}>
          Already have an account?{" "}
          <Anchor size="sm" component={Link} to="/login">
            Login
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
            label="Name"
            placeholder="your name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <TextInput
            label="Email"
            placeholder="your email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
            mt="md"
          />
          <PasswordInput
            label="Password"
            placeholder="your password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            mt="md"
            disabled={loading}
          />
          <Group position="apart" mt="lg">
            {/* <Checkbox
              label="Remember me"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              disabled={loading}
            /> */}
            <Anchor component={Link} size="sm" to="/forgot-password">
              Forgot password?
            </Anchor>
          </Group>
          <Button type="submit" fullWidth mt="xl" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </Button>
        </Paper>
      </Container>
    </>
  );
};

export default SignupPage;
