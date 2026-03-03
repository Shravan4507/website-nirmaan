import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Grainient from './components/background/grainient'
import Navbar from './components/navbar/Navbar'
import Footer from './components/footer/Footer'
import PageTransition from './components/PageTransition'
import Home from './pages/home/home'
import Workshops from './pages/events/events'
import Competitions from './pages/competitions/competitions'
import Sponsors from './pages/sponsors/sponsors'
import Team from './pages/team/team'
import Schedule from './pages/schedule/schedule'
import Contact from './pages/contact/contact'
import Register from './pages/register/register'
import Login from './components/login/login'
import { PrivacyPolicy, TermsOfService } from './components/policy/policy'
import UserDashboard from './user/user-dashboard/user-dashboard'
import AdminDashboard from './admin/admin-dashboard/admin-dashboard'
import AdminSignup from './admin/admin-signup/admin-signup'
import AdminSignupForm from './admin/admin-signup/admin-signup-form'
import UserSignup from './user/user-signup/user-signup'
import { ToastProvider } from './components/toast/Toast'
import './App.css'

function AnimatedRoutes() {
  const location = useLocation();

  // Helper to wrap components with transitions
  const withTransition = (element: React.ReactNode) => (
    <PageTransition>{element}</PageTransition>
  );

  return (
    <AnimatePresence mode="wait" initial={true}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={withTransition(<Home />)} />
        <Route path="/workshops" element={withTransition(<Workshops />)} />
        <Route path="/competitions" element={withTransition(<Competitions />)} />
        <Route path="/sponsors" element={withTransition(<Sponsors />)} />
        <Route path="/team" element={withTransition(<Team />)} />
        <Route path="/schedule" element={withTransition(<Schedule />)} />
        <Route path="/contact" element={withTransition(<Contact />)} />
        <Route path="/login" element={withTransition(<Login />)} />
        <Route path="/user-signup" element={withTransition(<UserSignup />)} />
        <Route path="/privacy" element={withTransition(<PrivacyPolicy />)} />
        <Route path="/terms" element={withTransition(<TermsOfService />)} />
        <Route path="/register" element={withTransition(<Register />)} />
        <Route path="/user-dashboard" element={withTransition(<UserDashboard />)} />
        <Route path="/admin-dashboard" element={withTransition(<AdminDashboard />)} />
        <Route path="/admin-signup" element={withTransition(<AdminSignup />)} />
        <Route path="/admin-signup-form" element={withTransition(<AdminSignupForm />)} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ToastProvider>
        <div className="app">
          <div className="app-background">
            <Grainient
              color1="#201d20"
              color2="#5227FF"
              color3="#000000"
              timeSpeed={0.25}
              colorBalance={0}
              warpStrength={1}
              warpFrequency={5}
              warpSpeed={2}
              warpAmplitude={50}
              blendAngle={0}
              blendSoftness={0.05}
              rotationAmount={500}
              noiseScale={2}
              grainAmount={0.1}
              grainScale={2}
              grainAnimated={false}
              contrast={1.5}
              gamma={1}
              saturation={1}
              centerX={0}
              centerY={0}
              zoom={0.9}
            />
          </div>
          <div className="app-content">
            <header className="app-header">
              <Navbar />
            </header>
            <main>
              <AnimatedRoutes />
            </main>
            <Footer />
          </div>
        </div>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App
