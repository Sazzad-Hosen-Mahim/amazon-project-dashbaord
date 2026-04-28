import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { connectSocket, disconnectSocket } from "@/utils/socket";
// import { Input } from "@/components/ui/input";
import Sidebar from "@/features/Sidebar/Sidebar";
import { useAuthStore } from "@/store/useAuthStore";
import { useThemeStore } from "@/store/useThemeStore";
import { IoMoon, IoSunny } from "react-icons/io5";
import { Outlet, useNavigate } from "react-router-dom";
import { MdOutlineLogout } from "react-icons/md";
import { useLogoutMutation } from "@/store/rtk/api/authApi";
import { toast } from "react-toastify";

const DashboardLayout = () => {
  const { theme, toggleTheme } = useThemeStore();
  const { clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      // Optional backend logout
      await logout().unwrap();

      // Clear auth state + localStorage
      clearAuth();
      disconnectSocket();

      toast.success("Logged out successfully");

      // Redirect to login
      navigate("/", { replace: true });
    } catch (error) {
      // Even if backend fails, force logout locally
      clearAuth();
      disconnectSocket();
      navigate("/", { replace: true });
    }
  };

  useEffect(() => {
    const token = useAuthStore.getState().token;
    if (token) {
      connectSocket(token);
    }
    return () => {
      disconnectSocket();
    }
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <header className="bg-green-50 dark:bg-primary-dark border-b p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <IoSunny className="h-5 w-5" />
              ) : (
                <IoMoon className="h-5 w-5" />
              )}
            </Button>

            <div className="flex gap-4 items-center">

              <Button
                onClick={handleLogout}
                disabled={isLoading}

                className="cursor-pointer bg-[#D02752] hover:bg-red-600"
              >
                <MdOutlineLogout className="mr-2" />
                {isLoading ? "Logging out..." : "Logout"}
              </Button>
            </div>
          </div>
        </header>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
