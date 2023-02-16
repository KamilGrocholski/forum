import { appStore } from "../../store/appStore"
import Footer from "./Footer"
import Header from "./Header"
import SideNav from "./SideNav"

const MainLayout: React.FC<{ children: JSX.Element | JSX.Element[] }> = ({ children }) => {
    const layoutWidth = appStore(state => state.layoutWidth)

    return (
        <>
            <Header />
            <main className={`transition-all duration-300 ease-in-out min-h-screen ${layoutWidth === 'full' ? 'w-full' : 'container'} mx-auto px-3 py-8`}>{children}</main>
            <Footer />
        </>
    )
}

export default MainLayout