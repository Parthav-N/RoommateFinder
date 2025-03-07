import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


function Home() {

  const { user } = useAuth();

  const roleContent = {
    lister: <div>
      <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
        Welcome, {user?.name}<br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
          List your properties <br />to a targeted student audience
        </span>
      </h1></div>,
    user: <div>
      <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
        Welcome, {user?.name}<br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
          Find Your Perfect <br />College Home & Friends
        </span>
      </h1></div>,
    default: (
      <div>
        <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
          Find Your Perfect<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
            College Home & Friends
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto">
          Connect with like-minded students and find your ideal living space near campus
        </p>
      </div>
    ),
  };

  const content = roleContent[user?.role] || roleContent.default;


  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-6 text-center text-white max-w-6xl">
          {content}
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            {user?.role === "lister" ? <> </> :
              <Link
                to="/roommate-search"
                className="group px-8 py-4 bg-white rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Browse Roommates
                </span>
              </Link>}
            <Link
              to="/building-search"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Browse Apartments
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section - Improved grid alignment */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Find Your College Community
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              More than just finding a room - discover lifelong friendships and create memorable experiences
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* Student Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-lg flex flex-col">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">For Students</h3>
              <ul className="space-y-6 flex-grow">
                <li className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-6 h-6 mt-1 text-blue-600">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700">Match with roommates based on lifestyle, interests, and study habits</p>
                </li>
                <li className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-6 h-6 mt-1 text-blue-600">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700">Virtual tours and detailed property information</p>
                </li>
                <li className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-6 h-6 mt-1 text-blue-600">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700">Verified reviews from fellow students</p>
                </li>
              </ul>
            </div>

            {/* Property Owners Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-2xl shadow-lg flex flex-col">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">For Property Owners</h3>
              <ul className="space-y-6 flex-grow">
                <li className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-6 h-6 mt-1 text-blue-600">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700">List your properties to a targeted student audience</p>
                </li>
                <li className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-6 h-6 mt-1 text-blue-600">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700">Streamlined application and screening process</p>
                </li>
                <li className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-6 h-6 mt-1 text-blue-600">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700">Secure payment processing and lease management</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* Features Section - Consistent card heights */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature cards with equal height */}
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                Find Roommates
              </h3>
              <p className="text-gray-600 text-center leading-relaxed flex-grow">
                Connect with other students looking for roommates who share your interests and lifestyle preferences
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                Discover Apartments
              </h3>
              <p className="text-gray-600 text-center leading-relaxed flex-grow">
                Browse available apartments and housing options near your campus with detailed information and virtual tours
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                Secure Housing
              </h3>
              <p className="text-gray-600 text-center leading-relaxed flex-grow">
                Find and secure your perfect housing situation with ease through our streamlined application process
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section - Consistent spacing */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Work done for CS5610 Fall 2024 @ Northeastern University, Boston
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 justify-center items-center">
            {/* Team Column */}
            <div className="space-y-6 text-center">
              <div>
                <h3 className="text-xl font-semibold text-gray-600"><u>Team Members (Section 3)</u></h3>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Sai Siddhartha Vivek Dhir Rangoju
                </h3>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Sai Ritish Reddy Musku
                </h3>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Parthav Nuthalapati
                </h3>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Hariharasudan Savithri Anbarasu
                </h3>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Bhuvan Nallamothu
                </h3>
              </div>
            </div>

            {/* Links Column */}
            <div className="space-y-6 text-center">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">GitHub (React + Nodejs)</h3>
                <div className="space-y-2">
                  <a href="https://github.com/vivekdhir77/Course-Project-Web-dev" target="_blank" className="text-blue-500">GitHub Link</a>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Website</h3>
                <div className="space-y-2">
                  <a href="https://course-project-web-dev.vercel.app/" target="_blank" className="text-blue-500">Website Link</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



    </div>
  );
}

export default Home;