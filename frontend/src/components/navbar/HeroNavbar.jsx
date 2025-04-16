import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem } from "../ui/Navbar.jsx";
import { cn } from "../../lib/utils.jsx";
import { useNavigate } from "react-router-dom";

export function NavbarDemo() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <Navbar className="top-2 z-10" />
    </div>
  );
}

function Navbar({ className }) {
  const [active, setActive] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // remove the token
    console.log("Logged out successfully");
    navigate("/"); // redirect to login or landing page
  };

  const handleAccountInfo = () => {
    navigate("/account");
  }

  return (
    <div className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-[100]", className)}>
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item="Your Account">
          <div className="flex flex-col space-y-4 text-sm">
            {/* <HoveredLink Linkto="/account">Account Information</HoveredLink> */}
            <button
              onClick={handleAccountInfo}
              className="text-neutral-700 dark:text-neutral-200 hover:text-pink-400 transition-colors duration-200">
              Account Information
            </button>
            <HoveredLink Linkto="/hashtags">Generated Hashtags</HoveredLink>
            <HoveredLink Linkto="/change-password">Change Password</HoveredLink>
            <button
              onClick={handleLogout}
              className="text-left text-sm text-gray-200 hover:text-red-500 transition-colors"
            >
              Logout
            </button>
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Learn More">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink Linkto="/hobby">Hobby</HoveredLink>
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
}
