import { Home, Gem, Settings, Gamepad2 } from "lucide-react";
import { Link } from "react-router-dom";

const FloatingTaskbar = () => {
  return (
    <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-[#172228] text-white shadow-lg rounded-full px-6 py-3 flex gap-10 items-center border border-gray-300">
      <Link to="/dashboard"><button className="p-2 rounded-full hover:bg-gray-200 transition">
        <Home size={24} />
      </button></Link>
      <Link to="/mining"><button className="p-2 rounded-full hover:bg-gray-200 transition">
        <Gem size={24} />
      </button></Link>
      <Link to="/game"><button className="p-2 rounded-full hover:bg-gray-200 transition">
        <Gamepad2 size={24} />
      </button></Link>
      <Link to="/profile"><button className="p-2 rounded-full hover:bg-gray-200 transition">
        <Settings size={24} />
      </button></Link>
    </div>
  );
};

export default FloatingTaskbar;
