import { Outlet } from "react-router-dom";
import DashboardNavBar from "../User/DashboardNavBar";
import Footer from "../Footer";

export default function UserLayout() {
    return (
        <>
            <DashboardNavBar />
            <Outlet />
            <Footer />
        </>
    );
}