import React, { useEffect, useState } from "react";
import { checkCityAlert } from "../services/disasterService";
import { useAuth } from "../context/AuthProvider";
import { AlertCircle } from "tabler-icons-react";
import { Box, Text, Flex, Center } from "@mantine/core";
import { keyframes } from "@emotion/react";

interface AlertBannerProps {
  userCity: string;
  navbarHeight: number; // Pass the initial height of the navbar as a prop
}

// Define the blinking animation
const blinkAnimation = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const AlertBanner: React.FC<AlertBannerProps> = ({
  userCity,
  navbarHeight,
}) => {
  const { isAuthenticated } = useAuth();
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [isNavbarSticky, setIsNavbarSticky] = useState(false);

  useEffect(() => {
    const fetchAlert = async () => {
      if (isAuthenticated) {
        const { alertActive, alertMessage } = await checkCityAlert(userCity);
        if (alertActive) {
          setAlertMessage(alertMessage);
        } else {
          setAlertMessage(null);
        }
      }
    };

    fetchAlert();

    const interval = setInterval(fetchAlert, 60000); // Check for updates every 1 minute
    return () => clearInterval(interval); // Clear interval on component unmount
  }, [userCity, isAuthenticated]);

  useEffect(() => {
    const handleScroll = () => {
      // Check if navbar is sticky based on scroll position
      setIsNavbarSticky(window.scrollY > navbarHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [navbarHeight]);

  return alertMessage ? (
    <Box
      style={{
        backgroundColor: "#FF4D4D",
        color: "white",
        padding: "8px 16px",
        position: "fixed",
        top: isNavbarSticky ? navbarHeight : 80, // Adjust position based on navbar's stickiness
        borderRadius: 8,
        left: "9rem",
        right: 0,
        zIndex: 1000,
        width: "75rem",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
        transition: "top 1.3s ease", // Smooth transition for position change
        animation: `${blinkAnimation} 1.5s infinite`, // Apply the blink animation
      }}
    >
      <Flex align="center" justify="center">
        <Center style={{ marginRight: "8px" }}>
          <AlertCircle size={22} color="white" />
        </Center>
        <Text
          style={{ fontWeight: 500, fontSize: "1rem", textAlign: "center" }}
        >
          {alertMessage}
        </Text>
      </Flex>
    </Box>
  ) : null;
};

export default AlertBanner;
