import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Test from './pages/Test/Test';
import TestResults from './pages/Test/TestResults';
import Chat from './pages/Chat/Chat';
import Profile from './pages/Profile/Profile';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ApplicationSuccess from './pages/Applications/ApplicationSuccess';
// New Pages
import ApplicationForm from './pages/Applications/ApplicationForm';
import MyApplications from './pages/Applications/MyApplications';
import NewsList from './pages/News/NewsList';
import NewsDetails from './pages/News/NewsDetails';
// Set axios base URL
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:5000';

// Import i18n
import './i18n/i18n';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/test" element={<Test />} />
            <Route path="/test/results" element={<TestResults />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/news" element={<NewsList />} />
            <Route path="/news/:id" element={<NewsDetails />} />
            {/* Protected routes */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
             <Route path="/applications/success" element={
              <ProtectedRoute>
                <ApplicationSuccess />
              </ProtectedRoute>
            } />
            <Route path="/applications" element={
              <ProtectedRoute>
                <MyApplications />
              </ProtectedRoute>
            } />
            
            <Route path="/applications/new" element={
              <ProtectedRoute>
                <ApplicationForm />
              </ProtectedRoute>
            } />
            
            {/* Admin only routes */}
            <Route path="/admin" element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;