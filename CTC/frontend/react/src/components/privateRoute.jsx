import React from "react";
import { Navigate } from "react-router-dom";
import authService from "../utils/auth/authService";

export default function PrivateRoute({ children }) {
    if (!authService.isLoggedIn()) {
        return <Navigate to="/login" replace />
    }
    return children
}
