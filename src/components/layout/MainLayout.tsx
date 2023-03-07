import { appStore } from "../../store/appStore";
import Toasts from "../common/Toasts/Toasts";
import Footer from "./Footer";
import Header from "./Header";

const MainLayout: React.FC<{ children: JSX.Element | JSX.Element[] }> = ({
  children,
}) => {
  const layoutWidth = appStore((state) => state.layoutWidth);

  return (
    <>
      <Header />
      <Toasts />
      <main
        className={`min-h-screen transition-all duration-300 ease-in-out ${
          layoutWidth === "full" ? "w-full" : "container"
        } mx-auto px-3 py-8`}
      >
        {children}
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
