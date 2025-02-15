import { Link } from 'react-router-dom';

const Onboarding = () => {
  return (
    <>
      <main className="w-full text-center h-screen text-black bg-white flex flex-col items-center justify-between overflow-hidden">
        {/* Hero Image Section */}
        <div className="relative w-full h-[50vh] overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src="https://i.pinimg.com/736x/c6/51/21/c651218a6c17efc7fb2cf237eb68bf9c.jpg"
            alt="Mining Background"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white text-shadow-lg">
              Begin Your Mining Journey
            </h1>
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full py-8 px-4 flex flex-col items-center gap-6 justify-center bg-gradient-to-b from-white to-gray-50">
          <h2 className="text-3xl md:text-4xl font-bold text-green-600">
            Welcome to Sin Coin
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl text-center">
            Start your journey today and unlock the potential of cryptocurrency mining. Follow these simple steps to get started:
          </p>

          {/* Steps List */}
          <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-green-600 mb-2">Step 1</h3>
              <p className="text-gray-700">Register or Login to your account.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-green-600 mb-2">Step 2</h3>
              <p className="text-gray-700">Click on "Start Mining" to begin.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-green-600 mb-2">Step 3</h3>
              <p className="text-gray-700">Complete daily tasks and claim rewards.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-green-600 mb-2">Step 4</h3>
              <p className="text-gray-700">Participate in airdrops and wait for the launch date.</p>
            </div>
          </div>

          {/* Call-to-Action Button */}
          <Link to="/register">
            <button className="mt-6 text-white bg-green-600 hover:bg-green-700 text-2xl font-semibold rounded-full px-8 py-3 transition-all transform hover:scale-105">
              Get Started
            </button>
          </Link>
        </div>
      </main>
    </>
  );
};

export default Onboarding;
