import { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Paper, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { refresh } = useAuth();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    let mounted = true;

    const verify = async () => {
      try {
        const { data } = await api.get(`/auth/verify-email/${token}`);

        await refresh();

        if (!mounted) return;

        setStatus("success");
        setMessage(data.message || "Email verified successfully");
      } catch (error) {
        const latestUser = await refresh();

        if (!mounted) return;

        const backendMessage = error.response?.data?.message || "";

        if (
          latestUser?.isEmailVerified ||
          backendMessage.includes("Invalid or expired")
        ) {
          setStatus("success");
          setMessage("Email already verified successfully");
          return;
        }

        setStatus("error");
        setMessage(backendMessage || "Verification failed");
      }
    };

    verify();

    return () => {
      mounted = false;
    };
  }, [token, refresh]);

  return (
    <Box
      sx={{
        minHeight: "70vh",
        display: "grid",
        placeItems: "center",
        p: 2,
      }}
    >
      <Paper
        sx={{
          p: 4,
          borderRadius: 5,
          textAlign: "center",
          maxWidth: 480,
        }}
      >
        {status === "loading" && <CircularProgress />}

        <Typography variant="h4" fontWeight={900} sx={{ mt: 2 }}>
          {status === "success"
            ? "Email Verified"
            : status === "error"
            ? "Verification Failed"
            : "Please wait"}
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 2 }}>
          {message}
        </Typography>

        <Button
          variant="contained"
          sx={{ mt: 3 }}
          onClick={() => navigate("/profile")}
        >
          Go to Profile
        </Button>
      </Paper>
    </Box>
  );
}