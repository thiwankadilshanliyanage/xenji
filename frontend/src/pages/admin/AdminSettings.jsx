import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

import api from "../../api/axios";

const defaultSettings = {
  siteName: "Xenji",
  supportEmail: "",
  supportPhone: "",
  defaultLanguage: "en",
  maintenanceMode: false,
  heroTitle: "Support platform for foreigners in Japan",
  heroSubtitle: "Find jobs, housing, daily life support and useful services.",
};

export default function AdminSettings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const { data } = await api.get("/admin/settings");
      setSettings({ ...defaultSettings, ...(data.settings || {}) });
    } catch {
      setSettings(defaultSettings);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const update = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const save = async () => {
    try {
      setSaving(true);
      setNotice("");
      await api.put("/admin/settings", settings);
      setNotice("Settings saved successfully.");
    } catch (error) {
      setNotice(error.response?.data?.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 3,
            bgcolor: "primary.main",
            color: "primary.contrastText",
            display: "grid",
            placeItems: "center",
          }}
        >
          <SettingsIcon />
        </Box>
        <Box>
          <Typography variant="h3" fontWeight={900}>
            Settings
          </Typography>
          <Typography color="text.secondary">
            Manage basic Xenji platform settings.
          </Typography>
        </Box>
      </Stack>

      {notice && (
        <Alert severity={notice.includes("success") ? "success" : "info"} sx={{ mb: 3 }}>
          {notice}
        </Alert>
      )}

      <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Site Name"
                value={settings.siteName}
                onChange={(e) => update("siteName", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Default Language"
                value={settings.defaultLanguage}
                onChange={(e) => update("defaultLanguage", e.target.value)}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="ja">Japanese</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Support Email"
                value={settings.supportEmail}
                onChange={(e) => update("supportEmail", e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Support Phone"
                value={settings.supportPhone}
                onChange={(e) => update("supportPhone", e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Homepage Hero Title"
                value={settings.heroTitle}
                onChange={(e) => update("heroTitle", e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Homepage Hero Subtitle"
                multiline
                rows={3}
                value={settings.heroSubtitle}
                onChange={(e) => update("heroSubtitle", e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography fontWeight={900}>Maintenance Mode</Typography>
                  <Typography color="text.secondary" variant="body2">
                    Use this later to show maintenance notice on public pages.
                  </Typography>
                </Box>
                <Switch
                  checked={settings.maintenanceMode}
                  onChange={(e) => update("maintenanceMode", e.target.checked)}
                />
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <Button variant="contained" disabled={saving} onClick={save}>
                {saving ? "Saving..." : "Save Settings"}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
}