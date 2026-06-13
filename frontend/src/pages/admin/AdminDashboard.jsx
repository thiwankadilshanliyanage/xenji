import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import StorefrontIcon from "@mui/icons-material/Storefront";
import MailIcon from "@mui/icons-material/Mail";
import ReportIcon from "@mui/icons-material/Report";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import api from "../../api/axios";

const statConfig = [
  {
    key: "totalUsers",
    label: "Total Users",
    icon: <PeopleIcon />,
    help: "Registered users",
  },
  {
    key: "totalServices",
    label: "Services",
    icon: <StorefrontIcon />,
    help: "All service records",
  },
  {
    key: "unreadContactMessages",
    label: "Unread Messages",
    icon: <MailIcon />,
    help: "Need admin attention",
  },
  {
    key: "pendingReports",
    label: "Pending Reports",
    icon: <ReportIcon />,
    help: "Reports to review",
  },
];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/admin/dashboard");
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const stats = data?.stats || {};

  const serviceStatusData = useMemo(() => {
    return data?.charts?.serviceStatus || [];
  }, [data]);

  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ py: 10 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }} color="text.secondary">
          Loading admin dashboard...
        </Typography>
      </Stack>
    );
  }

  return (
    <>
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h3" fontWeight={900}>
            Admin Dashboard
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.7 }}>
            Overview of Xenji users, services, messages and reports.
          </Typography>
        </Box>

        <Chip label="Live admin overview" color="primary" />
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {statConfig.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.key}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
                height: "100%",
              }}
            >
              <CardContent>
                <Stack direction="row" justifyContent="space-between" spacing={2}>
                  <Box>
                    <Typography color="text.secondary" fontWeight={700}>
                      {item.label}
                    </Typography>
                    <Typography variant="h3" fontWeight={900} sx={{ mt: 1 }}>
                      {stats[item.key] ?? 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.help}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: 3,
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    {item.icon}
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={7}>
          <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
            <CardContent>
              <Typography variant="h6" fontWeight={900} sx={{ mb: 2 }}>
                Monthly User Growth
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data?.charts?.monthlyUsers || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="users" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
            <CardContent>
              <Typography variant="h6" fontWeight={900} sx={{ mb: 2 }}>
                Service Status
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={serviceStatusData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={105}
                    label
                  >
                    {serviceStatusData.map((entry, index) => (
                      <Cell key={entry.name} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={7}>
          <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
            <CardContent>
              <Typography variant="h6" fontWeight={900} sx={{ mb: 2 }}>
                Services by Category
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data?.charts?.servicesByCategory || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
            <CardContent>
              <Typography variant="h6" fontWeight={900} sx={{ mb: 2 }}>
                Recent Activity
              </Typography>
              <Stack spacing={1.5}>
                {(data?.recentServices || []).map((service) => (
                  <Box
                    key={service._id}
                    sx={{
                      p: 1.5,
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography fontWeight={800}>
                      {service.title?.en || "Untitled service"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {service.category} · {service.status}
                    </Typography>
                  </Box>
                ))}

                {!data?.recentServices?.length && (
                  <Typography color="text.secondary">No recent services.</Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}