import { useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import SecurityIcon from "@mui/icons-material/Security";
import VerifiedIcon from "@mui/icons-material/Verified";
import WarningIcon from "@mui/icons-material/Warning";

import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useSnackbar } from "../../context/SnackbarContext";

const getAvatarUrl = (avatar, name = "User") => {
  if (avatar?.startsWith("http")) {
    return avatar;
  }

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=6366F1&color=fff`;
};

export default function Profile() {
  const { user, refresh, logout } = useAuth();
  const { show } = useSnackbar();

  const [name, setName] = useState(user?.name || "");
  const [preview, setPreview] = useState(getAvatarUrl(user?.avatar, user?.name));
  const [uploading, setUploading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const completion = user?.isEmailVerified && user?.avatar ? 100 : user?.isEmailVerified ? 85 : 60;

  useEffect(() => {
    setName(user?.name || "");
    setPreview(getAvatarUrl(user?.avatar, user?.name));
  }, [user]);

  const saveProfile = async () => {
    try {
      await api.put("/users/profile", { name });
      await refresh();
      show("Profile updated");
    } catch (error) {
      show(error.response?.data?.message || "Profile update failed", "error");
    }
  };

  const uploadAvatar = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      show("Only jpg, jpeg, png, webp images are allowed", "error");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      show("Image size must be less than 2MB", "error");
      return;
    }

    setPreview(URL.createObjectURL(file));

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("avatar", file);

      await api.put("/users/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await refresh();
      show("Avatar updated");
    } catch (error) {
      show(error.response?.data?.message || "Avatar upload failed", "error");
      setPreview(getAvatarUrl(user?.avatar, user?.name));
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const deleteAccount = async () => {
    try {
      await api.delete("/users/delete-account");
      show("Account deleted");
      await logout();
    } catch (error) {
      show(error.response?.data?.message || "Delete account failed", "error");
    }
  };

  if (!user) return null;

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "100vh",
        py: {
          xs: 3,
          md: 5,
        },
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={{
            p: {
              xs: 2.5,
              md: 4,
            },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            mb: 3,
          }}
        >
          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            spacing={3}
            alignItems={{
              xs: "flex-start",
              md: "center",
            }}
            justifyContent="space-between"
          >
            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={2.5}
              alignItems={{
                xs: "flex-start",
                sm: "center",
              }}
            >
              <Box sx={{ position: "relative" }}>
                <Avatar
                  src={preview}
                  sx={{
                    width: 104,
                    height: 104,
                    border: "4px solid",
                    borderColor: "background.paper",
                  }}
                />

                <Button
                  component="label"
                  size="small"
                  variant="contained"
                  disabled={uploading}
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    mt: 1.2,
                    width: "100%",
                    borderRadius: 999,
                  }}
                >
                  {uploading ? "Uploading" : "Avatar"}
                  <input
                    hidden
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={uploadAvatar}
                  />
                </Button>
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontSize: {
                      xs: 32,
                      md: 42,
                    },
                    fontWeight: 850,
                    lineHeight: 1.1,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {user.name}
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                  <EmailIcon fontSize="small" color="action" />
                  <Typography color="text.secondary">{user.email}</Typography>
                </Stack>

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1.5 }}>
                  <Chip
                    icon={user.isEmailVerified ? <VerifiedIcon /> : <WarningIcon />}
                    color={user.isEmailVerified ? "success" : "warning"}
                    label={user.isEmailVerified ? "Verified" : "Not verified"}
                  />
                  <Chip label={user.role || "user"} variant="outlined" />
                </Stack>
              </Box>
            </Stack>

            <Box
              sx={{
                minWidth: {
                  xs: "100%",
                  md: 250,
                },
              }}
            >
              <Typography fontWeight={850}>Profile completion</Typography>

              <LinearProgress
                variant="determinate"
                value={completion}
                sx={{
                  mt: 1.2,
                  height: 9,
                  borderRadius: 999,
                }}
              />

              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {completion}% complete
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {!user.isEmailVerified && (
          <Alert severity="warning" sx={{ mb: 3, borderRadius: 3 }}>
            Your email is not verified. Please verify your account.
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Paper
              elevation={0}
              sx={{
                p: {
                  xs: 2.5,
                  md: 3,
                },
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  <PersonIcon />
                </Avatar>

                <Box>
                  <Typography variant="h5" fontWeight={850}>
                    Personal information
                  </Typography>
                  <Typography color="text.secondary">
                    Update your basic account details.
                  </Typography>
                </Box>
              </Stack>

              <Stack spacing={2}>
                <TextField
                  label="Full name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  fullWidth
                />

                <TextField label="Email" value={user.email || ""} disabled fullWidth />

                <TextField label="Role" value={user.role || ""} disabled fullWidth />

                <TextField
                  label="Joined"
                  value={new Date(user.createdAt || Date.now()).toLocaleDateString()}
                  disabled
                  fullWidth
                />

                <Button
                  variant="contained"
                  onClick={saveProfile}
                  sx={{
                    alignSelf: {
                      xs: "stretch",
                      sm: "flex-start",
                    },
                  }}
                >
                  Save changes
                </Button>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={5}>
            <Paper
              elevation={0}
              sx={{
                p: {
                  xs: 2.5,
                  md: 3,
                },
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  <SecurityIcon />
                </Avatar>

                <Box>
                  <Typography variant="h5" fontWeight={850}>
                    Account security
                  </Typography>
                  <Typography color="text.secondary">
                    Account status and safety.
                  </Typography>
                </Box>
              </Stack>

              <Stack spacing={1.4}>
                <SecurityRow
                  icon={user.isEmailVerified ? <VerifiedIcon /> : <WarningIcon />}
                  title={user.isEmailVerified ? "Email verified" : "Email pending"}
                  text={
                    user.isEmailVerified
                      ? "Your email address is confirmed."
                      : "Please verify your email address."
                  }
                  color={user.isEmailVerified ? "success.main" : "warning.main"}
                />

                <SecurityRow
                  icon={<SecurityIcon />}
                  title="Protected session"
                  text="Your account uses secure JWT authentication."
                  color="primary.main"
                />

                <SecurityRow
                  icon={<CloudUploadIcon />}
                  title={user.avatar?.startsWith("http") ? "Cloud avatar enabled" : "Default avatar"}
                  text="You can update your profile picture anytime."
                  color="primary.main"
                />

                <SecurityRow
                  icon={<CalendarMonthIcon />}
                  title="Joined"
                  text={new Date(user.createdAt || Date.now()).toLocaleDateString()}
                  color="primary.main"
                />
              </Stack>

              <Divider sx={{ my: 3 }} />

              <Button
                fullWidth
                color="error"
                variant="outlined"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteOpen(true)}
              >
                Delete account
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle fontWeight={900}>Delete account?</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            This action cannot be undone. Your account will be permanently removed.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={deleteAccount}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function SecurityRow({ icon, title, text, color }) {
  return (
    <Stack direction="row" spacing={1.4} alignItems="flex-start">
      <Avatar
        sx={{
          bgcolor: color,
          width: 38,
          height: 38,
        }}
      >
        {icon}
      </Avatar>

      <Box>
        <Typography fontWeight={850}>{title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
          {text}
        </Typography>
      </Box>
    </Stack>
  );
}