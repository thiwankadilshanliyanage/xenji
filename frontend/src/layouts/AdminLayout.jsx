import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import HomeIcon from "@mui/icons-material/Home";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleIcon from "@mui/icons-material/People";
import ReportIcon from "@mui/icons-material/Report";
import SettingsIcon from "@mui/icons-material/Settings";
import StorefrontIcon from "@mui/icons-material/Storefront";

const drawerWidth = 270;

const items = [
  ["/admin", "Dashboard", <DashboardIcon />],
  ["/admin/services", "Services", <StorefrontIcon />],
  ["/admin/users", "Users", <PeopleIcon />],
  ["/admin/messages", "Messages", <MailIcon />],
  ["/admin/reports", "Reports", <ReportIcon />],
  ["/admin/settings", "Settings", <SettingsIcon />],
];

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const theme = useTheme();

  const drawer = (
    <Box sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}>
      <Toolbar disableGutters sx={{ mb: 1 }}>
        <Avatar sx={{ bgcolor: "primary.main", mr: 1.5, fontWeight: 900 }}>
          X
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight={900}>
            Xenji Admin
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Control center
          </Typography>
        </Box>
      </Toolbar>

      <Button
        component={Link}
        to="/"
        startIcon={<HomeIcon />}
        variant="outlined"
        fullWidth
        sx={{
          mb: 2,
          borderRadius: 3,
          justifyContent: "flex-start",
          fontWeight: 800,
          py: 1.1,
        }}
        onClick={() => setMobileOpen(false)}
      >
        Back to Home
      </Button>

      <List sx={{ mt: 1 }}>
        {items.map(([to, label, icon]) => {
          const selected =
            to === "/admin"
              ? location.pathname === "/admin"
              : location.pathname.startsWith(to);

          return (
            <ListItemButton
              key={to}
              component={Link}
              to={to}
              selected={selected}
              onClick={() => setMobileOpen(false)}
              sx={{
                borderRadius: 3,
                mb: 0.8,
                py: 1.2,
                color: selected ? "primary.contrastText" : "text.primary",
                "&.Mui-selected": {
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 10px 25px rgba(0,0,0,0.35)"
                      : "0 10px 25px rgba(0,0,0,0.12)",
                  "&:hover": { bgcolor: "primary.dark" },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: selected ? "inherit" : "text.secondary",
                }}
              >
                {icon}
              </ListItemIcon>
              <ListItemText
                primary={label}
                primaryTypographyProps={{ fontWeight: selected ? 800 : 600 }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ flex: 1 }} />

      <Box
        sx={{
          p: 2,
          borderRadius: 3,
          bgcolor: "background.default",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography fontWeight={900}>Admin Mode</Typography>
        <Typography variant="caption" color="text.secondary">
          Manage Xenji services, users, reports and settings.
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          display: { xs: "block", md: "none" },
          bgcolor: "background.paper",
          color: "text.primary",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar>
          <IconButton onClick={() => setMobileOpen(true)} color="inherit">
            <MenuIcon />
          </IconButton>

          <Typography fontWeight={900} sx={{ flex: 1 }}>
            Xenji Admin
          </Typography>

          <IconButton component={Link} to="/" color="inherit">
            <HomeIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            borderRight: `1px solid ${theme.palette.divider}`,
            bgcolor: "background.paper",
            color: "text.primary",
          },
        }}
      >
        {drawer}
      </Drawer>

      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{ display: { xs: "block", md: "none" } }}
        PaperProps={{
          sx: {
            width: drawerWidth,
            bgcolor: "background.paper",
            color: "text.primary",
          },
        }}
      >
        {drawer}
      </Drawer>

      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          p: { xs: 2, md: 4 },
          pt: { xs: 10, md: 4 },
          bgcolor: "background.default",
        }}
      >
        <Stack
          direction="row"
          justifyContent="flex-end"
          sx={{ mb: 2, display: { xs: "none", md: "flex" } }}
        >
          <Button component={Link} to="/" startIcon={<HomeIcon />} variant="outlined">
            View Website
          </Button>
        </Stack>

        <Box sx={{ maxWidth: 1320, mx: "auto" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}