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
  Stack,
  Typography,
} from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";

import api from "../../api/axios";

export default function ManageContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/admin/messages");
      setMessages(data.messages || []);
    } catch (error) {
      setNotice(error.response?.data?.message || "Failed to load messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const markRead = async (id) => {
    await api.put(`/admin/messages/${id}/read`);
    await load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this message?")) return;
    await api.delete(`/admin/messages/${id}`);
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
            bgcolor: "primary.main",
            color: "primary.contrastText",
            display: "grid",
            placeItems: "center",
          }}
        >
          <MailIcon />
        </Box>
        <Box>
          <Typography variant="h3" fontWeight={900}>
            Contact Messages
          </Typography>
          <Typography color="text.secondary">
            Review messages sent from the public contact page.
          </Typography>
        </Box>
      </Stack>

      {notice && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {notice}
        </Alert>
      )}

      <Grid container spacing={2.5}>
        {messages.map((msg) => (
          <Grid item xs={12} md={6} key={msg._id}>
            <Card elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" spacing={2}>
                  <Box>
                    <Typography variant="h6" fontWeight={900}>
                      {msg.subject || "No subject"}
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      {msg.name || "Unknown"} · {msg.email || "No email"}
                    </Typography>
                  </Box>
                  <Chip
                    size="small"
                    label={msg.isRead ? "Read" : "Unread"}
                    color={msg.isRead ? "default" : "primary"}
                  />
                </Stack>

                <Typography sx={{ mt: 2, whiteSpace: "pre-wrap" }}>
                  {msg.message}
                </Typography>

                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
                  {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ""}
                </Typography>

                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  {!msg.isRead && (
                    <Button variant="contained" onClick={() => markRead(msg._id)}>
                      Mark as read
                    </Button>
                  )}
                  <Button color="error" variant="outlined" onClick={() => remove(msg._id)}>
                    Delete
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {!messages.length && (
          <Grid item xs={12}>
            <Card elevation={0} sx={{ borderRadius: 4, p: 4, textAlign: "center" }}>
              <Typography color="text.secondary">No contact messages yet.</Typography>
            </Card>
          </Grid>
        )}
      </Grid>
    </>
  );
}