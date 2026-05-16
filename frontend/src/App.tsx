import "./index.css";
import "./fonts.css";
import "./reset.css";
import "leaflet/dist/leaflet.css";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import { NavBar } from "./components/Navbar";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ImprintPrivacy } from "./pages/ImprintPrivacy";
import { Register } from "./pages/Register";
import { Send } from "./pages/Send";
import { Home } from "./pages/Home";
import { Profile } from "./pages/Profile";
import { Quest } from "./pages/Quest";
import { Message } from "./pages/Message";
import { Login } from "./pages/Login";
import { Gallery } from "./pages/Gallery";
import { Editor } from "./pages/Editor";
import { Details } from "./pages/Details";
import { Dashboard } from "./pages/Dashboard";
import type { ReactNode } from "react";
import { PreviewProvider, usePreview } from "./context/PreviewContext";

const ProtectedEditorRoute = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const isAllowed = location.state?.fromQuest;

  if (!isAllowed) {
    return <Navigate replace to="/dashboard" />;
  }

  return children;
};

const ProtectedMessageRoute = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const isAllowed = location.state?.fromEditor;

  if (!isAllowed) {
    return <Navigate replace to="/dashboard" />;
  }

  return children;
};

const ProtectedSendRoute = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const isAllowed = location.state?.fromMessage;

  if (!isAllowed) {
    return <Navigate replace to="/dashboard" />;
  }

  return children;
};

const ProtectedDetailRoute = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const isAllowed = location.state?.fromSend;

  if (!isAllowed) {
    return <Navigate replace to="/dashboard" />;
  }

  return children;
};

function AppContent() {
  const location = useLocation();
  const { previewOpen } = usePreview();

  const showNavbarPaths = [
    "/dashboard",
    "/editor",
    "/gallery",
    "/imprint",
    "/message",
    "/profile",
    "/quest",
  ];

  const shouldShowNavbar = showNavbarPaths.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <NavBar inert={previewOpen} />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/details"
          element={
            <ProtectedDetailRoute>
              <Details />
            </ProtectedDetailRoute>
          }
        />{" "}
        <Route
          path="/editor"
          element={
            <ProtectedEditorRoute>
              <Editor />
            </ProtectedEditorRoute>
          }
        />
        <Route path="/password" element={<ForgotPassword />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/home" element={<Home />} />
        <Route path="/imprint" element={<ImprintPrivacy />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/message"
          element={
            <ProtectedMessageRoute>
              <Message />
            </ProtectedMessageRoute>
          }
        />{" "}
        <Route path="/profile" element={<Profile />} />
        <Route path="/quest" element={<Quest />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/send"
          element={
            <ProtectedSendRoute>
              <Send />
            </ProtectedSendRoute>
          }
        />{" "}
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}
function App() {
  return (
    <PreviewProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </PreviewProvider>
  );
}

export default App;
