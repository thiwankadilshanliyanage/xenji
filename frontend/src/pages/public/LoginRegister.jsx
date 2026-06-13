import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  InputAdornment,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";

import EmailIcon from "@mui/icons-material/Email";
import GoogleIcon from "@mui/icons-material/Google";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import LanguageIcon from "@mui/icons-material/Language";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

import { useAuth } from "../../context/AuthContext";
import { useSnackbar } from "../../context/SnackbarContext";

const authImageUrl =
  "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=1400&q=80";

const trustItems = [
  {
    title: "Foreigner friendly support",
    icon: <SupportAgentIcon fontSize="small" />,
  },
  {
    title: "Multi-language information",
    icon: <LanguageIcon fontSize="small" />,
  },
  {
    title: "Secure verified account",
    icon: <VerifiedUserIcon fontSize="small" />,
  },
];

export default function LoginRegister() {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { login, register, startGoogleLogin } = useAuth();
  const { show } = useSnackbar();
  const navigate = useNavigate();

  const isRegister = tab === 1;

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validate = () => {
    if (!form.email || !form.password || (isRegister && !form.name)) {
      return "Please fill all required fields.";
    }

    if (isRegister && form.password.length < 8) {
      return "Password must be at least 8 characters.";
    }

    if (isRegister && form.password !== form.confirmPassword) {
      return "Passwords do not match.";
    }

    return "";
  };

  const submit = async () => {
    setError("");

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const data = isRegister ? await register(form) : await login(form);

      show(data.message || "Success");
      navigate(data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (requestError) {
      const message =
        requestError.response?.data?.message || "Something went wrong";

      setError(message);
      show(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      className="auth-page"
      sx={{
        minHeight: "calc(100vh - 70px)",
        bgcolor: "background.default",
        py: {
          xs: 3,
          md: 6,
        },
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={{
            overflow: "hidden",
            borderRadius: {
              xs: 3,
              md: 4,
            },
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr",
              },
              minHeight: {
                xs: "auto",
                md: 640,
              },
            }}
          >
            <Box
              sx={{
                position: "relative",
                minHeight: {
                  xs: 260,
                  sm: 340,
                  md: "auto",
                },
                backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.16), rgba(0,0,0,0.62)), url(${authImageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  p: {
                    xs: 3,
                    md: 5,
                  },
                  color: "white",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Stack direction="row" spacing={1.2} alignItems="center">
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2.5,
                      display: "grid",
                      placeItems: "center",
                      bgcolor: "rgba(255,255,255,0.18)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <TravelExploreIcon />
                  </Box>

                  <Box>
                    <Typography fontWeight={900} fontSize={20} lineHeight={1}>
                      Xenji
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "rgba(255,255,255,0.78)" }}
                    >
                      Japan life navigator
                    </Typography>
                  </Box>
                </Stack>

                <Box>
                  <Typography
                    sx={{
                      maxWidth: 420,
                      fontSize: {
                        xs: 30,
                        sm: 36,
                        md: 42,
                      },
                      fontWeight: 900,
                      lineHeight: 1.08,
                      letterSpacing: "-0.03em",
                    }}
                  >
                    Settle into Japan with confidence.
                  </Typography>

                  <Typography
                    sx={{
                      mt: 1.5,
                      maxWidth: 430,
                      color: "rgba(255,255,255,0.84)",
                      lineHeight: 1.7,
                      fontSize: {
                        xs: 15,
                        md: 16,
                      },
                    }}
                  >
                    Save useful services, get trusted information and manage your
                    profile from one simple account.
                  </Typography>

                  <Stack
                    spacing={1.2}
                    sx={{
                      mt: 3,
                      display: {
                        xs: "none",
                        sm: "flex",
                      },
                    }}
                  >
                    {trustItems.map((item) => (
                      <Stack
                        key={item.title}
                        direction="row"
                        spacing={1.2}
                        alignItems="center"
                        sx={{
                          width: "fit-content",
                          px: 1.5,
                          py: 1,
                          borderRadius: 999,
                          bgcolor: "rgba(255,255,255,0.16)",
                          backdropFilter: "blur(10px)",
                        }}
                      >
                        {item.icon}

                        <Typography fontWeight={700} fontSize={14}>
                          {item.title}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                bgcolor: "background.paper",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: {
                  xs: 3,
                  sm: 4,
                  md: 6,
                },
              }}
            >
              <Box sx={{ width: "100%", maxWidth: 470 }}>
                <Typography
                  sx={{
                    fontSize: {
                      xs: 32,
                      md: 42,
                    },
                    fontWeight: 900,
                    lineHeight: 1.1,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {isRegister ? "Create account" : "Welcome back"}
                </Typography>

                <Typography
                  color="text.secondary"
                  sx={{
                    mt: 1,
                    lineHeight: 1.7,
                  }}
                >
                  {isRegister
                    ? "Create your Xenji account using email or Google."
                    : "Login to continue to your Xenji dashboard."}
                </Typography>

                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  startIcon={<GoogleIcon />}
                  onClick={startGoogleLogin}
                  sx={{
                    mt: 4,
                    py: 1.25,
                    borderRadius: 2.5,
                    fontWeight: 800,
                  }}
                >
                  Continue with Google
                </Button>

                <Divider sx={{ my: 3 }}>or use email</Divider>

                <Tabs
                  value={tab}
                  onChange={(_, value) => {
                    setTab(value);
                    setError("");
                  }}
                  variant="fullWidth"
                  sx={{
                    mb: 3,
                    minHeight: 46,
                    bgcolor: "background.default",
                    borderRadius: 2.5,
                    p: 0.5,
                    ".MuiTab-root": {
                      minHeight: 38,
                      borderRadius: 2,
                      fontWeight: 800,
                    },
                  }}
                >
                  <Tab label="Login" />
                  <Tab label="Register" />
                </Tabs>

                {error && (
                  <Alert
                    severity="error"
                    sx={{
                      mb: 2,
                      borderRadius: 2.5,
                    }}
                  >
                    {error}
                  </Alert>
                )}

                <Stack spacing={2}>
                  {isRegister && (
                    <TextField
                      label="Full name"
                      fullWidth
                      value={form.name}
                      onChange={(event) =>
                        updateField("name", event.target.value)
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}

                  <TextField
                    label="Email address"
                    type="email"
                    fullWidth
                    value={form.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    value={form.password}
                    onChange={(event) =>
                      updateField("password", event.target.value)
                    }
                    helperText={isRegister ? "Use at least 8 characters." : ""}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon />
                        </InputAdornment>
                      ),
                    }}
                  />

                  {isRegister && (
                    <TextField
                      label="Confirm password"
                      type="password"
                      fullWidth
                      value={form.confirmPassword}
                      onChange={(event) =>
                        updateField("confirmPassword", event.target.value)
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}

                  {!isRegister && (
                    <Stack
                      direction={{
                        xs: "column",
                        sm: "row",
                      }}
                      justifyContent="space-between"
                      alignItems={{
                        xs: "flex-start",
                        sm: "center",
                      }}
                      spacing={1}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={remember}
                            onChange={(event) =>
                              setRemember(event.target.checked)
                            }
                            size="small"
                          />
                        }
                        label="Remember me"
                      />

                      <Button component={Link} to="/forgot-password">
                        Forgot password?
                      </Button>
                    </Stack>
                  )}

                  <Button
                    variant="contained"
                    size="large"
                    disabled={loading}
                    onClick={submit}
                    sx={{
                      py: 1.35,
                      borderRadius: 2.5,
                      fontWeight: 850,
                    }}
                  >
                    {loading
                      ? "Please wait..."
                      : isRegister
                      ? "Create account"
                      : "Login"}
                  </Button>

                  <Box sx={{ textAlign: "center", pt: 1 }}>
                    <Typography color="text.secondary" component="span">
                      {isRegister
                        ? "Already have an account?"
                        : "Don't have an account?"}
                    </Typography>

                    <Button
                      onClick={() => {
                        setTab(isRegister ? 0 : 1);
                        setError("");
                      }}
                      sx={{ ml: 0.5 }}
                    >
                      {isRegister ? "Login" : "Create account"}
                    </Button>
                  </Box>
                </Stack>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}