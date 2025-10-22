import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SignUp from './components/Auth/Signup';
import SignIn from './components/Auth/SignIn';
import UserDashboardLayout from './components/User/UserDashboardLayout';
import UserDashboard from './components/User/UserDashboard';
import UserProfile from './components/User/UserProfile';
import UserHistory from './components/User/UserHistory';
import UserImage from './components/User/UserImage';

// Component that conditionally shows Navbar/Footer
function ConditionalLayout({ children }) {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <>
      {/* Only show Navbar if NOT on dashboard */}
      {!isDashboard && <Navbar />}

      {children}
    </>
  );
}

function App() {
  return (
    <Router>
      <ConditionalLayout>
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path='/signup' element={<SignUp />} />
              <Route path='/signin' element={<SignIn />} />

              {/* Dashboard routes - has its own DashboardNavbar */}
              <Route path="/dashboard" element={<UserDashboardLayout />}>
                <Route index element={<UserDashboard />} />
                <Route path="profile" element={<UserProfile />} />
                <Route path="history" element={<UserHistory />} />
                <Route path="image" element={<UserImage />} />
              </Route>

              <Route path="*" element={<Home />} />
            </Routes>

            <Footer />
          </main>
        </div>
      </ConditionalLayout>
    </Router>
  );
}

export default App;
