import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import api from "../../api/axios";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setNotice("");

      const { data } = await api.get("/admin/users");

      setUsers(data.users || []);
    } catch (error) {
      setNotice(
        error.response?.data?.message ||
          error.message ||
          "Failed to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const act = async (user, action) => {
    try {
      await api.put(`/admin/users/${user._id}/${action}`);
      await load();
    } catch (error) {
      setNotice(error.response?.data?.message || "Action failed.");
    }
  };

  const remove = async (user) => {
    if (!confirm(`Delete ${user.email}?`)) return;

    try {
      await api.delete(`/admin/users/${user._id}`);
      await load();
    } catch (error) {
      setNotice(error.response?.data?.message || "Delete failed.");
    }
  };

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
            Users
          </Typography>
          <Typography color="text.secondary">
            Manage registered Xenji users and admin access.
          </Typography>
        </Box>

        <Button variant="outlined" onClick={load}>
          Refresh
        </Button>
      </Stack>

      {notice && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {notice}
        </Alert>
      )}

      {loading ? (
        <Stack alignItems="center" sx={{ py: 8 }}>
          <CircularProgress />
          <Typography color="text.secondary" sx={{ mt: 2 }}>
            Loading users...
          </Typography>
        </Stack>
      ) : (
        <Paper sx={{ overflow: "hidden", borderRadius: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <Typography fontWeight={800}>
                      {user.name || "No name"}
                    </Typography>
                  </TableCell>

                  <TableCell>{user.email}</TableCell>

                  <TableCell>
                    <Chip
                      label={user.role || "user"}
                      size="small"
                      color={user.role === "admin" ? "primary" : "default"}
                    />
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={user.isBlocked ? "Blocked" : "Active"}
                      size="small"
                      color={user.isBlocked ? "error" : "success"}
                    />
                  </TableCell>

                  <TableCell>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "-"}
                  </TableCell>

                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() =>
                          act(user, user.isBlocked ? "unblock" : "block")
                        }
                      >
                        {user.isBlocked ? "Unblock" : "Block"}
                      </Button>

                      <Button
                        size="small"
                        color="error"
                        onClick={() => remove(user)}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}

              {!users.length && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Typography
                      textAlign="center"
                      color="text.secondary"
                      sx={{ py: 5 }}
                    >
                      No users found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      )}
    </>
  );
}