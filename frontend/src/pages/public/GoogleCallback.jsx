import { useEffect } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useSnackbar } from "../../context/SnackbarContext";

export default function GoogleCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { handleGoogleCallback } = useAuth();
  const { show } = useSnackbar();

  useEffect(() => {
    try {
      const token = params.get("token");
      const user = params.get("user");

      if (!token || !user) {
        show("Google login failed", "error");
        navigate("/login");
        return;
      }

      const parsedUser = handleGoogleCallback({
        token,
        user: decodeURIComponent(user),
      });

      show("Google login successful");

      navigate(parsedUser.role === "admin" ? "/admin" : "/dashboard");
    } catch {
      show("Google login failed", "error");
      navigate("/login");
    }
  }, []);

  return (
    <Box sx={{ minHeight: "70vh", display: "grid", placeItems: "center" }}>
      <Box textAlign="center">
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Signing you in with Google...</Typography>
      </Box>
    </Box>
  );
}