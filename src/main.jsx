import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import "./index.css";
import Home from "./views/Home.jsx";
import Profile from "./views/Profile.jsx";
import PostDetails from "./views/PostDetails.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile/:userId" element={<Profile />} />
                <Route path="/profile/:userId/posts/:postId" element={<PostDetails />} />
            </Routes>
            </BrowserRouter>
    </StrictMode>
);
