import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";

import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

import api from "../../api/axios";

export default function Notifications() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api
      .get("/notifications")
      .then((response) => setItems(response.data.notifications || []))
      .catch(() => setItems([]));
  }, []);

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 5 }}>
      <Container maxWidth="md">
        <Typography variant="h2" sx={{ fontSize: { xs: 36, md: 48 } }}>
          Notifications
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
          Latest Xenji updates and service information.
        </Typography>

        <Paper sx={{ p: 2 }}>
          <List>
            {items.map((item) => (
              <ListItem key={item._id} divider>
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    <NotificationsNoneIcon />
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={item.title?.en}
                  secondary={item.message?.en}
                />
              </ListItem>
            ))}

            {!items.length && (
              <Typography textAlign="center" color="text.secondary" sx={{ py: 4 }}>
                No notifications yet.
              </Typography>
            )}
          </List>
        </Paper>
      </Container>
    </Box>
  );
}
