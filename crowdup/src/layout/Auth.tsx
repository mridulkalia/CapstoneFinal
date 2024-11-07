import { Outlet } from "react-router-dom";
import { ReactNode } from "react";
import ScrollToTop from "../components/ScrollToTop";

interface AuthLayoutProps {
  children?: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div>
      <ScrollToTop />
      {children}
      <Outlet />
    </div>
  );
};

export default AuthLayout;
