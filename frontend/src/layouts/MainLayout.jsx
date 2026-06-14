import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Select,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";

import XenoChatbot from "../components/chatbot/XenoChatbot";
import LanguageModal from "../components/common/LanguageModal";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LanguageContext";
import { useThemeMode } from "../context/ThemeContext";

const getAvatarUrl = (avatar, name = "User") => {
  if (avatar?.startsWith("http")) return avatar;

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&background=2563EB&color=fff`;
};

export default function MainLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const { t, lang, setLang } = useLang();
  const { mode, toggleTheme } = useThemeMode();
  const { user, logout, isAdmin } = useAuth();

  const navigate = useNavigate();
  const theme = useTheme();

  const navLinks = [
    [t("home"), "/"],
    [t("services"), "/services"],
    [t("contact"), "/contact"],
  ];

  const closeMenu = () => setAnchorEl(null);

  const handleLogout = async () => {
    closeMenu();
    if (confirm("Logout?")) await logout();
  };

  const drawer = (
    <Box sx={{ width: 290, p: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={1.2} alignItems="center">
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2.5,
              display: "grid",
              placeItems: "center",
              color: "white",
              bgcolor: "primary.main",
            }}
          >
            <TravelExploreIcon />
          </Box>

          <Box>
            <Typography fontWeight={900}>Xenji</Typography>
            <Typography variant="caption" color="text.secondary">
              Japan life navigator
            </Typography>
          </Box>
        </Stack>

        <IconButton onClick={() => setDrawerOpen(false)}>
          <CloseIcon />
        </IconButton>
      </Stack>

      <Divider sx={{ my: 2 }} />

      <List>
        {navLinks.map(([label, path]) => (
          <ListItemButton
            key={path}
            component={Link}
            to={path}
            onClick={() => setDrawerOpen(false)}
            sx={{ borderRadius: 2, mb: 0.5 }}
          >
            <ListItemText primary={label} />
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />

      {user ? (
        <Stack spacing={1}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              setDrawerOpen(false);
              navigate(isAdmin ? "/admin" : "/dashboard");
            }}
          >
            {isAdmin ? t("admin") : t("dashboard")}
          </Button>

          {!isAdmin && (
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setDrawerOpen(false);
                navigate("/profile");
              }}
            >
              {t("profile")}
            </Button>
          )}

          <Button fullWidth color="error" onClick={handleLogout}>
            {t("logout")}
          </Button>
        </Stack>
      ) : (
        <Button
          fullWidth
          variant="contained"
          component={Link}
          to="/login"
          onClick={() => setDrawerOpen(false)}
        >
          {t("login")}
        </Button>
      )}
    </Box>
  );

  return (
    <Box sx={{ minHeight: "100vh", overflowX: "hidden" }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          color: "text.primary",
          bgcolor:
            mode === "dark" ? "rgba(15,23,42,.96)" : "rgba(255,255,255,.96)",
          backdropFilter: "blur(16px)",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 1.2, sm: 2, md: 3 } }}>
          <Toolbar
            disableGutters
            sx={{
              minHeight: { xs: 58, md: 70 },
              gap: { xs: 0.8, md: 1.4 },
              display: "flex",
              alignItems: "center",
            }}
          >
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{
                display: { xs: "inline-flex", md: "none" },
                width: 38,
                height: 38,
                flexShrink: 0,
              }}
            >
              <MenuIcon />
            </IconButton>

            <Stack
              component={Link}
              to="/"
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{
                mr: { xs: "auto", md: 3 },
                textDecoration: "none",
                color: "inherit",
                minWidth: 0,
                flexShrink: 1,
              }}
            >
              <Box
                sx={{
                  width: { xs: 34, md: 38 },
                  height: { xs: 34, md: 38 },
                  borderRadius: 2,
                  display: "grid",
                  placeItems: "center",
                  color: "white",
                  bgcolor: "primary.main",
                  flexShrink: 0,
                }}
              >
                <TravelExploreIcon fontSize="small" />
              </Box>

              <Box sx={{ display: { xs: "none", sm: "block" }, minWidth: 0 }}>
                <Typography fontWeight={900} lineHeight={1} sx={{ fontSize: "1rem" }}>
                  Xenji
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", whiteSpace: "nowrap" }}
                >
                  Navigate Japan smarter
                </Typography>
              </Box>
            </Stack>

            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 0.4,
                flex: 1,
              }}
            >
              {navLinks.map(([label, path]) => (
                <Button key={path} component={Link} to={path} color="inherit">
                  {label}
                </Button>
              ))}
            </Box>

            <Select
              size="small"
              value={lang}
              onChange={(event) => setLang(event.target.value)}
              sx={{
                minWidth: { xs: 68, sm: 84 },
                maxWidth: { xs: 76, sm: 110 },
                borderRadius: 3,
                flexShrink: 0,
                "& .MuiSelect-select": {
                  py: { xs: 0.8, md: 1 },
                  px: { xs: 1, md: 1.5 },
                  fontSize: { xs: "0.78rem", md: "0.9rem" },
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                },
              }}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="ja">日本語</MenuItem>
            </Select>

            <IconButton
              onClick={toggleTheme}
              aria-label="toggle theme"
              sx={{ width: { xs: 36, md: 40 }, height: { xs: 36, md: 40 }, flexShrink: 0 }}
            >
              {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>

            {user && (
              <IconButton
                component={Link}
                to="/notifications"
                aria-label="notifications"
                sx={{ display: { xs: "none", sm: "inline-flex" } }}
              >
                <NotificationsNoneIcon />
              </IconButton>
            )}

            {user ? (
              <>
                <IconButton
                  onClick={(event) => setAnchorEl(event.currentTarget)}
                  sx={{ flexShrink: 0 }}
                >
                  <Avatar
                    src={getAvatarUrl(user.avatar, user.name)}
                    sx={{ width: { xs: 32, md: 36 }, height: { xs: 32, md: 36 } }}
                  />
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={closeMenu}
                  PaperProps={{ sx: { width: 260, mt: 1 } }}
                >
                  <MenuItem disabled>
                    <Stack>
                      <Typography fontWeight={900}>{user.name}</Typography>
                      <Typography variant="caption">{user.email}</Typography>
                    </Stack>
                  </MenuItem>

                  <Divider />

                  <MenuItem
                    onClick={() => {
                      closeMenu();
                      navigate(isAdmin ? "/admin" : "/dashboard");
                    }}
                  >
                    <DashboardIcon fontSize="small" sx={{ mr: 1 }} />
                    {isAdmin ? t("admin") : t("dashboard")}
                  </MenuItem>

                  {!isAdmin && (
                    <MenuItem
                      onClick={() => {
                        closeMenu();
                        navigate("/profile");
                      }}
                    >
                      <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                      {t("profile")}
                    </MenuItem>
                  )}

                  <Divider />

                  <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
                    <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                    {t("logout")}
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="contained"
                component={Link}
                to="/login"
                sx={{
                  minWidth: { xs: 70, sm: 82, md: 96 },
                  px: { xs: 1.3, md: 2.5 },
                  py: { xs: 0.8, md: 1 },
                  fontSize: { xs: "0.78rem", md: "0.9rem" },
                  borderRadius: 3,
                  flexShrink: 0,
                }}
              >
                {t("login")}
              </Button>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {drawer}
      </Drawer>

      <Outlet />
      <Footer />
      <XenoChatbot />
      <LanguageModal />
    </Box>
  );
}

function Footer() {
  const { t, lang, setLang } = useLang();

  return (
    <Box
      component="footer"
      sx={{
        mt: 0,
        py: { xs: 4, md: 6 },
        bgcolor: "background.paper",
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-evenly"
          alignItems={{ xs: "center", md: "flex-start" }}
          spacing={{ xs: 3.5, md: 6 }}
          textAlign="center"
        >
          <Box sx={{ maxWidth: 360 }}>
            <Stack direction="row" spacing={1.2} alignItems="center" justifyContent="center">
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: 2.4,
                  display: "grid",
                  placeItems: "center",
                  color: "white",
                  bgcolor: "primary.main",
                }}
              >
                <TravelExploreIcon fontSize="small" />
              </Box>

              <Typography variant="h6" fontWeight={900}>
                Xenji
              </Typography>
            </Stack>

            <Typography color="text.secondary" sx={{ mt: 2, lineHeight: 1.7 }}>
              A simple platform that helps foreign residents find services,
              information and support for life in Japan.
            </Typography>
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 3, sm: 6 }}
            alignItems="center"
            justifyContent="center"
            textAlign="center"
          >
            <Stack spacing={1} alignItems="center">
              <Typography fontWeight={900}>Explore</Typography>

              <Button color="inherit" component={Link} to="/services">
                {t("services")}
              </Button>
            </Stack>

            <Stack spacing={1} alignItems="center">
              <Typography fontWeight={900}>Support</Typography>

              <Button color="inherit" component={Link} to="/contact">
                {t("contact")}
              </Button>

              <Button color="inherit" component={Link} to="/privacy">
                Privacy
              </Button>

              <Button color="inherit" component={Link} to="/terms">
                Terms
              </Button>
            </Stack>

            <Stack spacing={1.5} alignItems="center">
              <Typography fontWeight={900}>{t("language")}</Typography>

              <Select
                size="small"
                value={lang}
                onChange={(event) => setLang(event.target.value)}
                sx={{ minWidth: 126, borderRadius: 3 }}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="ja">日本語</MenuItem>
              </Select>
            </Stack>
          </Stack>
        </Stack>

        <Divider sx={{ my: 4 }} />

        <Typography color="text.secondary" variant="body2" textAlign="center">
          © 2026 Xenji. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}