import { motion } from "framer-motion";

type SideNavProps = {
  children: JSX.Element[];
};

const SideNav: React.FC<SideNavProps> = ({ children }) => {
  return (
    <motion.aside className="flex h-screen flex-col space-y-3">
      {children}
    </motion.aside>
  );
};

export default SideNav;
