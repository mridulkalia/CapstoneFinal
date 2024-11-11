import React, { useEffect, useState } from "react";
import { checkCityAlert } from "../services/disasterService";
import { useAuth } from "../context/AuthProvider";
import { AlertCircle } from "tabler-icons-react";
import { Box, Text, Flex, Center } from "@mantine/core";

interface AlertBannerProps {
  userCity: string;
  navbarHeight: number; // Pass the initial height of the navbar as a prop
}

// Define the blinking animation
// const blinkAnimation = keyframes`
//   0% { opacity: 0.8; transform: scale(1); }
//   25% { opacity: 1; transform: scale(1.05); }
//   50% { opacity: 0.8; transform: scale(1); }
//   75% { opacity: 1; transform: scale(1.05); }
//   100% { opacity: 0.8; transform: scale(1); }
// `;

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

    const interval = setInterval(fetchAlert, 30000); // Check for updates every 1 minute
    return () => clearInterval(interval);
  }, [userCity, isAuthenticated]);

  useEffect(() => {
    const handleScroll = () => {
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
        top: isNavbarSticky ? navbarHeight : navbarHeight + 30,
        borderRadius: 8,
        left: "10%",
        right: "10%",
        zIndex: 1000,
        maxWidth: "80%",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
        transition: "top 1.2s ease",
        // animation: `${blinkAnimation} 2s infinite`,
        // WebkitAnimation: `${blinkAnimation} 2s infinite`,
        // MozAnimation: `${blinkAnimation} 2s infinite`,
      }}
      sx={{
        "@media (max-width: 768px)": {
          left: "3%",
          right: "3%",
        },
        "@media (max-width: 480px)": {
          left: "2%",
          right: "2%",
        },
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
