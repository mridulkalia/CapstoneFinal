import { LandingFooter, LandingNavbar } from "../components";
import { ReactNode } from "react";
import { Box } from "@mantine/core";

import footerLinksData from "../data/Footer.json";
import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";

interface IProps {
  children?: ReactNode;
  compressedNav?: boolean;
}

const PublicLayout = ({ compressedNav }: IProps) => {
  return (
    <>
      <ScrollToTop />
      <LandingNavbar compressed={compressedNav} />
      <Box sx={{ marginTop: compressedNav ? 0 : 96 }}>
        <Outlet />
      </Box>
      <LandingFooter data={footerLinksData.data} />
    </>
  );
};

export default PublicLayout;
