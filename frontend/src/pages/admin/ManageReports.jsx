import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ReportIcon from "@mui/icons-material/Report";

import api from "../../api/axios";

const statusColors = {
  pending: "warning",
  reviewed: "info",
  resolved: "success",
};

export default function ManageReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/admin/reports");
      setReports(data.reports || []);
    } catch (error) {
      setNotice(error.response?.data?.message || "Failed to load reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/admin/reports/${id}/status`, { status });
    await load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this report?")) return;
    await api.delete(`/admin/reports/${id}`);
    await load();
  };

  if (loading) {
    return (
      <Stack alignItems="center" sx={{ py: 8 }}>
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 3,
            bgcolor: "error.main",
            color: "error.contrastText",
            display: "grid",
            placeItems: "center",
          }}
        >
          <ReportIcon />
        </Box>
        <Box>
          <Typography variant="h3" fontWeight={900}>
            Reports
          </Typography>
          <Typography color="text.secondary">
            Manage user reports and review suspicious content.
          </Typography>
        </Box>
      </Stack>

      {notice && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {notice}
        </Alert>
      )}

      <Grid container spacing={2.5}>
        {reports.map((report) => (
          <Grid item xs={12} md={6} key={report._id}>
            <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" spacing={2}>
                  <Box>
                    <Typography variant="h6" fontWeight={900}>
                      {report.reason || "Report"}
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      {report.itemType} · {report.user?.email || "Unknown user"}
                    </Typography>
                  </Box>
                  <Chip
                    size="small"
                    label={report.status}
                    color={statusColors[report.status] || "default"}
                  />
                </Stack>

                <Typography sx={{ mt: 2, whiteSpace: "pre-wrap" }}>
                  {report.message || "No message provided."}
                </Typography>

                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
                  {report.createdAt ? new Date(report.createdAt).toLocaleString() : ""}
                </Typography>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mt: 2 }}>
                  <TextField
                    select
                    size="small"
                    label="Status"
                    value={report.status}
                    onChange={(e) => updateStatus(report._id, e.target.value)}
                    sx={{ minWidth: 160 }}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="reviewed">Reviewed</MenuItem>
                    <MenuItem value="resolved">Resolved</MenuItem>
                  </TextField>
                  <Button color="error" variant="outlined" onClick={() => remove(report._id)}>
                    Delete
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {!reports.length && (
          <Grid item xs={12}>
            <Card elevation={0} sx={{ borderRadius: 4, p: 4, textAlign: "center" }}>
              <Typography color="text.secondary">No reports yet.</Typography>
            </Card>
          </Grid>
        )}
      </Grid>
    </>
  );
}