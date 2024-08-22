import { Outlet } from "react-router-dom";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children?: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div>
      {children}
      <Outlet />
    </div>
  );
};

export default AuthLayout;
