import { Route, Routes } from "react-router-dom";
// import PrivateRoute from "./privateRoute";
import DashboardLayout from "@/layout/DashboardLayout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import MemberList from "@/pages/MemberList";
import Withdraw from "@/pages/Withdraw";
import ProductList from "@/pages/ProductList";
import GoldenEgg from "@/pages/GoldenEgg";
import CollectionSettings from "@/pages/CollectionSettings";
import PrivateRoute from "./privateRoute";
import AddBonus from "@/pages/AddBonus";
import SuperiorWithdraw from "@/pages/SuperiorWithdraw";

const AppRoutes = () => {
  return (
    <Routes>
      {/* <Route path="/" element={<div className="text-white">Home</div>} /> */}
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        element={
          <PrivateRoute allowedRoles={["admin"]}>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route path="/dashboard" element={<Home />} />
        <Route path="/member-list" element={<MemberList />} />
        <Route path="/collection-setting/:id" element={<CollectionSettings />} />
        <Route path="/product-list" element={<ProductList />} />
        <Route path="/withdraw" element={<Withdraw />} />
        <Route path="/golden-egg" element={<GoldenEgg />} />
        <Route path="/add-bonus" element={<AddBonus />} />
        <Route path="/superior-withdraw" element={<SuperiorWithdraw />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
