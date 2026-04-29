import { useState } from "react";
import { useSidebarStore } from "@/store/useSidebarStore";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { IoHome, IoBarChartSharp } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { ChevronDown, ChevronRight, } from "lucide-react";
import { PiHandWithdraw } from "react-icons/pi";


import { TooltipProvider } from "@/components/ui/tooltip";

const Sidebar = () => {
  const isOpen = useSidebarStore((state) => state.isOpen);
  const toggle = useSidebarStore((state) => state.toggle);

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const sidebarVariants = {
    open: { width: "16rem" },
    closed: { width: "4rem" },
  };

  const toggleDropdown = (key: string) => {
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  return (
    <motion.aside
      initial={isOpen ? "open" : "closed"}
      animate={isOpen ? "open" : "closed"}
      variants={sidebarVariants}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`bg-primary text-white dark:bg-primary-dark border-r min-h-screen p-4 overflow-hidden flex flex-col ${!isOpen ? "px-10 items-center" : ""
        }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-lg">
          {isOpen ? "Mercado Livre" : <TbLayoutDashboardFilled className="w-7 h-7" />}
        </h2>
        <Button className="ms-1" variant="ghost" size="sm" onClick={toggle}>
          {isOpen ? <FaLongArrowAltLeft /> : <FaLongArrowAltRight />}
        </Button>
      </div>

      <nav className="flex-1 mt-12">
        <TooltipProvider delayDuration={100}>
          <ul className="space-y-4">
            {/* Home (isolated) */}
            <li>
              <Link
                to="/dashboard"
                className="flex items-center p-2 rounded-lg hover:bg-white hover:text-black transition-colors"
              >
                <IoHome className="w-5 h-5" />
                {isOpen && <span className="ml-2 font-medium">Home</span>}
              </Link>
            </li>

            {/* Member Management */}
            <li>
              <button
                onClick={() => toggleDropdown("member")}
                className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-white hover:text-black transition-colors"
              >
                <div className="flex items-center">
                  <IoBarChartSharp className="w-5 h-5" />
                  {isOpen && (
                    <span className="ml-2 font-medium">Member Management</span>
                  )}
                </div>
                {isOpen &&
                  (openDropdown === "member" ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  ))}
              </button>

              {isOpen && openDropdown === "member" && (
                <ul className="ml-7 mt-2 space-y-2 text-md font-semibold">
                  <li>
                    <Link
                      to="/member-list"
                      className="block p-2 rounded-lg hover:bg-white hover:text-black"
                    >
                      Member List
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Order Management */}
            <li>
              <button
                onClick={() => toggleDropdown("order")}
                className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-white hover:text-black transition-colors"
              >
                <div className="flex items-center">
                  <IoMdSettings className="w-5 h-5" />
                  {isOpen && (
                    <span className="ml-2 font-medium">Order Management</span>
                  )}
                </div>
                {isOpen &&
                  (openDropdown === "order" ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  ))}
              </button>

              {isOpen && openDropdown === "order" && (
                <ul className="ml-7 mt-2 space-y-2 text-md font-semibold">
                  <li>
                    <Link
                      to="/product-list"
                      className="block p-2 rounded-lg hover:bg-white hover:text-black"
                    >
                      Product List
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Withdraw */}
            <li>
              <button
                onClick={() => toggleDropdown("withdraw")}
                className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-white hover:text-black transition-colors"
              >
                <div className="flex items-center">
                  <PiHandWithdraw className="w-5 h-5" />
                  {isOpen && <span className="ml-2 font-medium">Withdraw</span>}
                </div>
                {isOpen &&
                  (openDropdown === "withdraw" ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  ))}
              </button>

              {isOpen && openDropdown === "withdraw" && (
                <ul className="ml-7 mt-2 space-y-2 text-md font-semibold">
                  <li>
                    <Link
                      to="/withdraw"
                      className="block p-2 rounded-lg hover:bg-white hover:text-black"
                    >
                      Withdraw
                    </Link>
                  </li>

                </ul>
              )}
            </li>

            {/* Golden Egg (isolated) */}
            {/* <li>
              <Link
                to="/add-bonus"
                className="flex items-center p-2 rounded-lg hover:bg-white hover:text-black transition-colors"
              >
                <Gift className="w-5 h-5" />
                {isOpen && <span className="ml-2 font-medium">Add Bonus</span>}
              </Link>
            </li> */}

            {/* <li>
              <Link
                to="/superior-withdraw"
                className="flex items-center p-2 rounded-lg hover:bg-white hover:text-black transition-colors"
              >
                <FaCashRegister className="w-5 h-5" />
                {isOpen && <span className="ml-2 font-medium">Superior Withdraw & Recharge Count</span>}
              </Link>
            </li> */}
          </ul>
        </TooltipProvider>
      </nav>
    </motion.aside>
  );
};

export default Sidebar;
