import { ChevronRight, CirclePlus,X } from "lucide-react";
import { useState } from "react";
import DailyCheckin from "../../components/dailycheckin";

const Mining = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [popupContent, setPopupContent] = useState("");

  const openPopup = (content) => {
    setPopupContent(content);
    setIsOpen(true);
  };

  return (
    <>
      <main className="w-full flex flex-col gap-[17px] relative">
        {/* Daily Task Card */}
        <div
          className="flex bg-white rounded-lg w-full h-fit items-center justify-center px-[15px] py-[10px] cursor-pointer hover:bg-gray-100 transition"
          onClick={() => openPopup("Complete your daily tasks to earn rewards!")}
        >
          <img
            className="w-[60px] rounded-full"
            src="https://i.pinimg.com/736x/c4/1c/5c/c41c5cc63b37ac8929ad764295d946fc.jpg"
            alt=""
          />
          <span className="flex flex-col pr-[50px] pl-3">
            <h2 className="text-[23px]">Daily Task</h2>
            <p>Daily earnings 🥳🥳</p>
          </span>
          <ChevronRight className="text-3xl" />
        </div>

        {/* Mining Power Card */}
        <div
          className="flex bg-white rounded-lg w-full h-fit items-center justify-center px-[15px] py-[10px] cursor-pointer hover:bg-gray-100 transition"
          onClick={() => openPopup("Increase your mining power to earn more!")}
        >
          <img
            className="w-[60px] rounded-full"
            src="https://i.pinimg.com/736x/c4/1c/5c/c41c5cc63b37ac8929ad764295d946fc.jpg"
            alt=""
          />
          <span className="flex flex-col pr-[50px] pl-3">
            <h2 className="text-[23px]">Mining Power</h2>
            <p>Boost your earnings ⚡</p>
          </span>
          <ChevronRight className="text-3xl" />
        </div>

        <DailyCheckin />

        {/* Popup Modal */}
        {isOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.64)] px-[10px] bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <button
                className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
                onClick={() => setIsOpen(false)}
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-semibold mb-4">Task Details</h2>
              <p className="text-gray-700 pb-4">{popupContent}</p>
              <div
          className="flex bg-slate-200 mb-4 rounded-lg w-full h-fit items-center justify-center px-[15px] py-[10px] cursor-pointer hover:bg-gray-100 transition"
          onClick={() => openPopup("Increase your mining power to earn more!")}
        >
          <img
            className="w-[50px] rounded-full"
            src="https://i.pinimg.com/736x/9a/e8/5e/9ae85eaa9cea5decea8817bd8fcf650b.jpg"
            alt="youtube"
          />
          <span className="flex flex-col pr-[50px] pl-3">
            <h2 className="text-[20px]">Youtube</h2>
            <p>Suscribe to our channel⚡+180</p>
          </span>
          <CirclePlus className="text-4xl" />
        </div>
        <div
          className="flex bg-slate-200 mb-4 rounded-lg w-full h-fit items-center justify-center px-[15px] py-[10px] cursor-pointer hover:bg-gray-100 transition"
          onClick={() => openPopup("Increase your mining power to earn more!")}
        >
          <img
            className="w-[50px] rounded-full"
            src="https://i.pinimg.com/736x/20/35/96/20359662fcd835fa8637bdee18ad6697.jpg"
            alt="telegram"
          />
          <span className="flex flex-col pr-[50px] pl-3">
            <h2 className="text-[20px]">Mining Power</h2>
            <p>Suscribe to our channel⚡+180</p>
          </span>
          <CirclePlus className="text-4xl" />
        </div>
        <div
          className="flex bg-slate-200 rounded-lg w-full h-fit items-center justify-center px-[15px] py-[10px] cursor-pointer hover:bg-gray-100 transition"
          onClick={() => openPopup("Increase your mining power to earn more!")}
        >
          <img
            className="w-[50px] rounded-full"
            src="https://i.pinimg.com/736x/c8/d3/d4/c8d3d4d12a8ea35b58e35de9ec820a22.jpg"
            alt="x"
          />
          <span className="flex flex-col pr-[50px] pl-3">
            <h2 className="text-[20px]">Mining Power</h2>
            <p>Follow us on x⚡+180</p>
          </span>
          <CirclePlus className="text-4xl" />
        </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default Mining;
