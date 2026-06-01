import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router";

import "./index.css";
import { UserProvider } from "./context/UserContext.jsx";
import Home from "./views/Home.jsx";
import Profile from "./views/Profile.jsx";
import PostDetails from "./views/PostDetails.jsx";
import SelectUser from "./views/SelectUser.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <UserProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/select-user" element={<SelectUser />} />
                    <Route path="/profile/:userId" element={<Profile />} />
                    <Route path="/profile/:userId/posts/:postId" element={<PostDetails />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </BrowserRouter>
        </UserProvider>
    </StrictMode>
);
