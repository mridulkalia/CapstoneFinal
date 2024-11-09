import { useRouteError, Link } from "react-router-dom";
import {
  Container,
  Text,
  Button,
  Center,
  Box,
  Title,
  keyframes,
} from "@mantine/core";
import { AlertCircle } from "tabler-icons-react";

const shakeAnimation = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
`;

const Error404Page = () => {
  const error: any = useRouteError();
  console.error(error);

  return (
    <Container size="xs" style={{ textAlign: "center", marginTop: "100px" }}>
      <Box
        sx={{
          borderColor: "#276749",
          backgroundColor: "#eaf6f0",
          borderRadius: "10px",
          padding: "40px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.244)",
          border: "1px solid #e0e0e0",
        }}
      >
        <Center>
          <AlertCircle
            size={80}
            color="#FF4D4D"
            style={{
              animation: `${shakeAnimation} 0.5s ease-in-out infinite`,
            }}
          />
        </Center>
        <Title
          order={1}
          style={{ color: "#FF4D4D", fontSize: "36px", marginTop: "20px" }}
        >
          Page Not Found
        </Title>
        <Text size="sm" color="#276749" style={{ marginTop: "10px" }}>
          <span style={{ fontWeight: 600, fontSize: "18px" }}>
            Oops! The page you are looking for doesn't exist. Please check the
            URL or try navigating to a different page.
          </span>
        </Text>
        <Text size="sm" style={{ color: "#666", marginTop: "20px" }}>
          The page might have been moved or removed. Feel free to go back to the
          homepage.
        </Text>

        <div style={{ marginTop: "30px" }}>
          <Button
            component={Link}
            to="/"
            variant="filled"
            color="teal"
            size="lg"
            style={{
              borderRadius: "50px",
              textTransform: "uppercase",
              fontWeight: 600,
              padding: "12px 30px",
            }}
            sx={{
              backgroundColor: "#276749",
              ":hover": { backgroundColor: "#1d5242" },
            }}
          >
            Back to Home
          </Button>
        </div>
      </Box>
    </Container>
  );
};

export default Error404Page;
