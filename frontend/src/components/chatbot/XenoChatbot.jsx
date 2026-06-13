import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Fab,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";

import api from "../../api/axios";

export default function XenoChatbot() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hi, I am Xeno AI. Ask me about jobs, housing, services or life in Japan.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    const question = text.trim();

    if (!question || loading) {
      return;
    }

    setText("");
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: question,
      },
    ]);

    try {
      setLoading(true);

      const { data } = await api.post("/chat", {
        message: question,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: data.answer || "Sorry, I could not answer that.",
          relatedServices: data.relatedServices || [],
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sendSuggestion = (question) => {
    setText(question);
  };

  return (
    <>
      <Fab
        color="primary"
        onClick={() => setOpen((prev) => !prev)}
        sx={{
          position: "fixed",
          right: 24,
          bottom: 24,
          zIndex: 1200,
        }}
      >
        {open ? <CloseIcon /> : <SmartToyIcon />}
      </Fab>

      {open && (
        <Paper
          elevation={8}
          sx={{
            position: "fixed",
            right: {
              xs: 12,
              sm: 24,
            },
            bottom: 92,
            width: {
              xs: "calc(100vw - 24px)",
              sm: 390,
            },
            height: {
              xs: 520,
              sm: 560,
            },
            zIndex: 1200,
            borderRadius: 4,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box
            sx={{
              p: 2,
              bgcolor: "primary.main",
              color: "primary.contrastText",
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "white",
                }}
              >
                <SmartToyIcon />
              </Avatar>

              <Box>
                <Typography fontWeight={900}>Xeno AI</Typography>
                <Typography variant="body2" sx={{ opacity: 0.85 }}>
                  Japan life assistant
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 2,
              bgcolor: "background.default",
            }}
          >
            <Stack spacing={1.5}>
              {messages.map((message, index) => (
                <Box
                  key={`${message.role}-${index}`}
                  sx={{
                    display: "flex",
                    justifyContent:
                      message.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: "86%",
                      p: 1.4,
                      borderRadius: 3,
                      bgcolor:
                        message.role === "user"
                          ? "primary.main"
                          : "background.paper",
                      color:
                        message.role === "user"
                          ? "primary.contrastText"
                          : "text.primary",
                      border:
                        message.role === "user"
                          ? "none"
                          : "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        whiteSpace: "pre-wrap",
                        lineHeight: 1.7,
                      }}
                    >
                      {message.text}
                    </Typography>

                    {!!message.relatedServices?.length && (
                      <Stack spacing={0.8} sx={{ mt: 1.2 }}>
                        {message.relatedServices.slice(0, 3).map((service) => (
                          <Chip
                            key={service._id}
                            label={service.title?.en || "Service"}
                            component="a"
                            href={`/services/${service.slug}`}
                            clickable
                            size="small"
                            sx={{ justifyContent: "flex-start" }}
                          />
                        ))}
                      </Stack>
                    )}
                  </Box>
                </Box>
              ))}

              {loading && (
                <Typography variant="body2" color="text.secondary">
                  Xeno AI is typing...
                </Typography>
              )}
            </Stack>
          </Box>

          <Divider />

          <Box sx={{ p: 1.5 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
              {["I need a job", "Find housing", "City office help"].map(
                (item) => (
                  <Chip
                    key={item}
                    label={item}
                    size="small"
                    onClick={() => sendSuggestion(item)}
                  />
                )
              )}
            </Stack>

            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                size="small"
                placeholder="Ask Xeno AI..."
                value={text}
                onChange={(event) => setText(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    sendMessage();
                  }
                }}
              />

              <IconButton
                color="primary"
                onClick={sendMessage}
                disabled={loading}
              >
                <SendIcon />
              </IconButton>
            </Stack>
          </Box>
        </Paper>
      )}
    </>
  );
}