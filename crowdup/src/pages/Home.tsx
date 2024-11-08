import HeroSection from "../sections/Home/Hero.tsx";
import {
  Alert,
  Box,
  BoxProps,
  Container,
  Text,
  TextProps,
  Title,
  TitleProps,
} from "@mantine/core";
import { TitleBadge } from "../components";
import FeaturesSection from "../sections/Home/Features.tsx";
import JoinUsSection from "../sections/Home/JoinUs";
import WaysToFundSection from "../sections/Home/WaysToFund";
import CampaignsSection from "../sections/Home/Campaigns";
import GetStartedSection from "../sections/Home/GetStarted";
import TestimonialsSection from "../sections/Home/Testimonials";
import { Helmet } from "react-helmet";
import AlertBanner from "../components/AlertBanner.tsx";
import { useAuth } from "../context/AuthProvider.tsx";
import { useEffect, useState } from "react";
// import { checkCityAlert } from "../services/disasterService.js";

const HomePage = (): JSX.Element => {
  const boxProps: BoxProps = {
    mt: 36,
    mb: 96,
    py: 48,
  };

  const titleProps: TitleProps = {
    size: 32,
    weight: 800,
    mb: "lg",
    transform: "capitalize",
    sx: { lineHeight: "40px" },
  };

  const subTitleProps: TextProps = {
    size: 20,
    weight: 700,
    mb: "xs",
    sx: { lineHeight: "28px" },
  };

  // interface AlertData {
  //   message: string;
  // }

  const { isAuthenticated } = useAuth();
  const [userCity, setUserCity] = useState<string | null>(null);
  // const [alertData, setAlertData] = useState<AlertData | null>(null);

  useEffect(() => {
    // Retrieve user's city from local storage or wherever it's stored
    const savedUserCity = localStorage.getItem("userCity");
    if (savedUserCity) {
      setUserCity(savedUserCity);
    }
  }, []);

  // useEffect(() => {
  //   // Retrieve userCity from local storage
  //   const userCity = localStorage.getItem("userCity");

  //   if (userCity) {
  //     // Check for an active alert in the user's city
  //     checkCityAlert(userCity)
  //       .then((data) => {
  //         if (data.alertActive) {
  //           setAlertData({
  //             message: data.alertMessage || "Alert active in your area!",
  //           });
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching alert data:", error);
  //       });
  //   }
  // }, []);

  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <Box>
        {/* {alertData && (
          <Alert
            title="Emergency Alert"
            color="red"
            radius="md"
            style={{ marginBottom: "1rem", zIndex: 10 }}
          >
            {alertData.message || "Alert active in your area!"}
          </Alert>
        )} */}
        {isAuthenticated && userCity && (
          <AlertBanner userCity={userCity} navbarHeight={50} />
        )}
        <HeroSection />
        <Container>
          <Box {...boxProps}>
            <TitleBadge title="About us" />
            <Title {...titleProps}>more people more impact</Title>
            <Text {...subTitleProps}>
              Because together, we can make a real difference. Our volunteers
              service in a variety of roles according to their skills and
              interests.
            </Text>
          </Box>
          <FeaturesSection boxProps={boxProps} subtitleProps={subTitleProps} />

          <JoinUsSection
            boxProps={boxProps}
            titleProps={titleProps}
            subtitleProps={subTitleProps}
          />
        </Container>
        <WaysToFundSection
          boxProps={boxProps}
          titleProps={titleProps}
          subtitleProps={subTitleProps}
        />
        <Container>
          <TestimonialsSection boxProps={boxProps} titleProps={titleProps} />
          <CampaignsSection
            boxProps={boxProps}
            titleProps={titleProps}
            subtitleProps={subTitleProps}
          />
          <GetStartedSection boxProps={boxProps} titleProps={titleProps} />
        </Container>
      </Box>
    </>
  );
};

export default HomePage;
