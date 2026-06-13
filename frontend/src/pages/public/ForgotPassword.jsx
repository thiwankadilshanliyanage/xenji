import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Container,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import EmailIcon from "@mui/icons-material/Email";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import api from "../../api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setNotice("");
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post("/auth/forgot-password", {
        email: email.trim(),
      });

      setNotice(data.message || "Reset instructions sent.");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "calc(100vh - 70px)", bgcolor: "background.default", py: 6 }}>
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="h3" fontWeight={900}>
            Forgot password?
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 1.5, lineHeight: 1.7 }}>
            Enter your email address. If the account exists, Xenji will send a password reset link.
          </Typography>

          {notice && (
            <Alert severity="success" sx={{ mt: 3 }}>
              {notice}
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}

          <Stack spacing={2.2} sx={{ mt: 3 }}>
            <TextField
              label="Email address"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              variant="contained"
              size="large"
              disabled={loading}
              onClick={submit}
              sx={{ py: 1.35, borderRadius: 2.5, fontWeight: 850 }}
            >
              {loading ? "Sending..." : "Send reset link"}
            </Button>

            <Button component={Link} to="/login" startIcon={<ArrowBackIcon />}>
              Back to login
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}