import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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

import LockIcon from "@mui/icons-material/Lock";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import api from "../../api/axios";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submit = async () => {
    setNotice("");
    setError("");

    if (!form.password || !form.confirmPassword) {
      setError("Please fill all fields.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post(`/auth/reset-password/${token}`, {
        password: form.password,
      });

      setNotice(data.message || "Password reset successful.");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
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
            Reset password
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 1.5, lineHeight: 1.7 }}>
            Create a new password for your Xenji account.
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
              label="New password"
              type="password"
              fullWidth
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
              helperText="Use at least 8 characters."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Confirm new password"
              type="password"
              fullWidth
              value={form.confirmPassword}
              onChange={(e) => updateField("confirmPassword", e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
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
              {loading ? "Resetting..." : "Reset password"}
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