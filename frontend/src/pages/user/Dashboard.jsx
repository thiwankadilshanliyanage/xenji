import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import StorefrontIcon from "@mui/icons-material/Storefront";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

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

export default function Dashboard() {
  const { user, refresh } = useAuth();
  const { show } = useSnackbar();

  const [notifications, setNotifications] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);

  const completion = user?.isEmailVerified ? 85 : 60;

  useEffect(() => {
    api
      .get("/notifications")
      .then((response) => {
        setNotifications(response.data.notifications || []);
      })
      .catch(() => {});

    api
      .get("/users/bookmarks")
      .then((response) => {
        setBookmarks(response.data.bookmarks || []);
      })
      .catch(() => {
        setBookmarks([]);
      });
  }, []);

  const resendVerification = async () => {
    try {
      await api.post("/auth/resend-verification");
      await refresh();
      show("Verification email sent");
    } catch (error) {
      show(error.response?.data?.message || "Failed to send email", "error");
    }
  };

  const stats = [
    {
      title: "Saved services",
      value: bookmarks.length,
      text: "Services you saved",
      icon: <BookmarkIcon />,
      link: "/bookmarks",
    },
    {
      title: "Notifications",
      value: notifications.length,
      text: "Latest updates",
      icon: <NotificationsNoneIcon />,
      link: "/notifications",
    },
    {
      title: "Services",
      value: "Open",
      text: "Find support services",
      icon: <StorefrontIcon />,
      link: "/services",
    },
  ];

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
        {!user?.isEmailVerified && (
          <Alert
            severity="warning"
            action={
              <Button color="inherit" size="small" onClick={resendVerification}>
                Resend
              </Button>
            }
            sx={{
              mb: 3,
              borderRadius: 3,
            }}
          >
            Your email is not verified. Please verify your email to secure your
            account.
          </Alert>
        )}

        <Paper
          elevation={0}
          sx={{
            p: {
              xs: 2.5,
              md: 4,
            },
            mb: 3,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            justifyContent="space-between"
            alignItems={{
              xs: "flex-start",
              md: "center",
            }}
            spacing={3}
          >
            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={2}
              alignItems={{
                xs: "flex-start",
                sm: "center",
              }}
            >
              <Avatar
                src={getAvatarUrl(user?.avatar, user?.name)}
                sx={{
                  width: 76,
                  height: 76,
                }}
              />

              <Box>
                <Typography
                  sx={{
                    fontSize: {
                      xs: 30,
                      md: 40,
                    },
                    fontWeight: 850,
                    lineHeight: 1.1,
                    letterSpacing: "-0.03em",
                  }}
                >
                  Welcome, {user?.name || "User"}
                </Typography>

                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  Manage your profile, saved services and notifications.
                </Typography>
              </Box>
            </Stack>

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={1.5}
              sx={{
                width: {
                  xs: "100%",
                  md: "auto",
                },
              }}
            >
              <Button
                variant="contained"
                component={Link}
                to="/services"
                startIcon={<SearchIcon />}
              >
                Find services
              </Button>

              <Button
                variant="outlined"
                component={Link}
                to="/profile"
                startIcon={<PersonIcon />}
              >
                Edit profile
              </Button>
            </Stack>
          </Stack>
        </Paper>

        <Grid container spacing={2.4}>
          {stats.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.title}>
              <Card
                component={Link}
                to={item.link}
                elevation={0}
                sx={{
                  display: "block",
                  height: "100%",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 3,
                  transition: "all .2s ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    borderColor: "primary.main",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      sx={{
                        bgcolor: "primary.main",
                        width: 54,
                        height: 54,
                      }}
                    >
                      {item.icon}
                    </Avatar>

                    <Box sx={{ flex: 1 }}>
                      <Typography color="text.secondary">
                        {item.title}
                      </Typography>

                      <Typography variant="h4" fontWeight={900}>
                        {item.value}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        {item.text}
                      </Typography>
                    </Box>

                    <ArrowForwardIcon color="action" />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: {
                  xs: 2.5,
                  md: 3,
                },
                height: "100%",
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <Typography variant="h5" fontWeight={850}>
                  Profile completion
                </Typography>

                <Typography
                  sx={{
                    px: 1.4,
                    py: 0.6,
                    borderRadius: 999,
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    fontWeight: 800,
                    fontSize: 13,
                  }}
                >
                  {completion}% Complete
                </Typography>
              </Stack>

              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Complete your account for a better Xenji experience.
              </Typography>

              <LinearProgress
                variant="determinate"
                value={completion}
                sx={{
                  height: 9,
                  borderRadius: 999,
                  mb: 3,
                }}
              />

              <Stack spacing={1.4}>
                <StatusRow
                  done={Boolean(user?.isEmailVerified)}
                  text={
                    user?.isEmailVerified
                      ? "Email verified"
                      : "Email not verified"
                  }
                />

                <StatusRow done={Boolean(user?.name)} text="Profile name added" />

                <StatusRow
                  done={Boolean(user?.avatar)}
                  text={
                    user?.avatar
                      ? "Profile picture added"
                      : "Profile picture missing"
                  }
                />
              </Stack>

              <Button
                component={Link}
                to="/profile"
                variant="outlined"
                endIcon={<ArrowForwardIcon />}
                sx={{ mt: 3 }}
              >
                Complete profile
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: {
                  xs: 2.5,
                  md: 3,
                },
                height: "100%",
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h5" fontWeight={850}>
                    Recent notifications
                  </Typography>

                  <Typography color="text.secondary">
                    Latest updates from Xenji.
                  </Typography>
                </Box>

                <Button component={Link} to="/notifications">
                  View all
                </Button>
              </Stack>

              <List sx={{ mt: 2 }}>
                {notifications.slice(0, 4).map((notification) => (
                  <ListItem
                    key={notification._id}
                    disableGutters
                    sx={{
                      py: 1.5,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        <NotificationsNoneIcon />
                      </Avatar>
                    </ListItemIcon>

                    <ListItemText
                      primary={notification.title?.en || "Notification"}
                      secondary={notification.message?.en || "New update"}
                    />
                  </ListItem>
                ))}

                {!notifications.length && (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      mt: 2,
                      textAlign: "center",
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 3,
                    }}
                  >
                    <Avatar
                      sx={{
                        mx: "auto",
                        mb: 1.5,
                        bgcolor: "primary.main",
                      }}
                    >
                      <NotificationsNoneIcon />
                    </Avatar>

                    <Typography fontWeight={900}>
                      No notifications yet
                    </Typography>

                    <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                      New service updates will appear here.
                    </Typography>
                  </Paper>
                )}
              </List>
            </Paper>
          </Grid>
        </Grid>

        <Paper
          elevation={0}
          sx={{
            mt: 3,
            p: {
              xs: 2.5,
              md: 3,
            },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={2}
            alignItems={{
              xs: "flex-start",
              sm: "center",
            }}
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: "primary.main" }}>
                <ContactSupportIcon />
              </Avatar>

              <Box>
                <Typography variant="h6" fontWeight={850}>
                  Need help?
                </Typography>
                <Typography color="text.secondary">
                  Contact Xenji support if you need help using the platform.
                </Typography>
              </Box>
            </Stack>

            <Button component={Link} to="/contact" variant="outlined">
              Contact us
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}

function StatusRow({ done, text }) {
  return (
    <Stack direction="row" spacing={1.2} alignItems="center">
      {done ? (
        <CheckCircleIcon color="success" />
      ) : (
        <WarningAmberIcon color="warning" />
      )}

      <Typography>{text}</Typography>
    </Stack>
  );
}