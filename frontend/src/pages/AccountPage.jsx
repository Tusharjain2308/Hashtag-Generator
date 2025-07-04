import AccountInfo from "../components/hero_sections/AccountInfo.jsx";
import { NavbarDemo } from "../components/navbar/HeroNavbar.jsx";

export default function LoginPage() {
  return (
    <div className="relative">
      <div className="relative z-20">
        <NavbarDemo />
      </div>

      <div className="">
        <AccountInfo />
      </div>
    </div>
  );
}
