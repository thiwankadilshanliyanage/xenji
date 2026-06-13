import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import LockIcon from "@mui/icons-material/Lock";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SendIcon from "@mui/icons-material/Send";
import ShieldIcon from "@mui/icons-material/Shield";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

import api from "../../api/axios";
import { useSnackbar } from "../../context/SnackbarContext";

const heroImage =
  "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1400&q=80";

const supportItems = [
  {
    title: "Friendly Support",
    text: "Our team will respond as soon as possible.",
    icon: <SupportAgentIcon />,
  },
  {
    title: "Trusted & Secure",
    text: "Your information is safe with us.",
    icon: <ShieldIcon />,
  },
  {
    title: "Quick Response",
    text: "We usually reply within 24 hours.",
    icon: <AccessTimeIcon />,
  },
];

const contactItems = [
  {
    title: "Email",
    main: "support@xenji.com",
    sub: "We usually reply within 24 hours.",
    icon: <EmailIcon />,
  },
  {
    title: "Phone",
    main: "+81 90-1234-5678",
    sub: "Mon - Fri: 9:00 AM - 6:00 PM",
    icon: <LocalPhoneIcon />,
  },
  {
    title: "Office",
    main: "Gifu, Japan",
    sub: "Supporting foreign residents in Japan.",
    icon: <LocationOnIcon />,
  },
];

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const { show } = useSnackbar();

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const submit = async () => {
    if (!form.name || !form.email || !form.subject || !form.message) {
      show("Please fill all fields", "error");
      return;
    }

    try {
      setLoading(true);

      await api.post("/contact", form);

      show("Message sent successfully");

      setForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      show(error.response?.data?.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "100vh",
        py: {
          xs: 4,
          md: 6,
        },
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          spacing={{
            xs: 4,
            md: 6,
          }}
          alignItems="center"
          sx={{ mb: 4 }}
        >
          <Box sx={{ flex: 1, width: "100%" }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: {
                  xs: 38,
                  md: 52,
                },
                fontWeight: 900,
                letterSpacing: "-0.04em",
              }}
            >
              Contact Us
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 1.5,
                maxWidth: 560,
                lineHeight: 1.8,
              }}
            >
              We are here to help. Send your questions, feedback, suggestions
              or service requests. Xenji supports foreigners living in Japan.
            </Typography>

            <Stack spacing={2} sx={{ mt: 4 }}>
              {supportItems.map((item) => (
                <Stack
                  key={item.title}
                  direction="row"
                  spacing={1.6}
                  alignItems="center"
                >
                  <Avatar
                    sx={{
                      bgcolor: "primary.main",
                      width: 44,
                      height: 44,
                    }}
                  >
                    {item.icon}
                  </Avatar>

                  <Box>
                    <Typography fontWeight={850}>{item.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.text}
                    </Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          </Box>

          <Paper
            elevation={0}
            sx={{
              flex: 1,
              width: "100%",
              overflow: "hidden",
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box
              component="img"
              src={heroImage}
              alt="Japan city contact support"
              sx={{
                width: "100%",
                height: {
                  xs: 240,
                  md: 340,
                },
                objectFit: "cover",
              }}
            />
          </Paper>
        </Stack>

        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          spacing={3}
          alignItems="stretch"
        >
          <Paper
            elevation={0}
            sx={{
              width: {
                xs: "100%",
                md: "38%",
              },
              p: {
                xs: 2.5,
                md: 3,
              },
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="h5" fontWeight={850}>
              Get in touch
            </Typography>

            <Stack spacing={2.4} sx={{ mt: 3 }}>
              {contactItems.map((item, index) => (
                <Box key={item.title}>
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <Avatar
                      sx={{
                        bgcolor: "primary.main",
                        width: 44,
                        height: 44,
                      }}
                    >
                      {item.icon}
                    </Avatar>

                    <Box>
                      <Typography fontWeight={850}>{item.title}</Typography>
                      <Typography>{item.main}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.sub}
                      </Typography>
                    </Box>
                  </Stack>

                  {index !== contactItems.length - 1 && <Divider sx={{ mt: 2.4 }} />}
                </Box>
              ))}
            </Stack>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              flex: 1,
              p: {
                xs: 2.5,
                md: 3,
              },
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="h5" fontWeight={850}>
              Send us a message
            </Typography>

            <Stack spacing={2} sx={{ mt: 3 }}>
              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={2}
              >
                <TextField
                  label="Your name"
                  fullWidth
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                />

                <TextField
                  label="Email address"
                  type="email"
                  fullWidth
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                />
              </Stack>

              <TextField
                label="Subject"
                fullWidth
                value={form.subject}
                onChange={(event) => updateField("subject", event.target.value)}
              />

              <TextField
                label="Your message"
                fullWidth
                multiline
                rows={6}
                value={form.message}
                onChange={(event) => updateField("message", event.target.value)}
              />

              <Button
                variant="contained"
                size="large"
                startIcon={<SendIcon />}
                disabled={loading}
                onClick={submit}
              >
                {loading ? "Sending..." : "Send Message"}
              </Button>

              <Stack direction="row" spacing={1} alignItems="center">
                <LockIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  We respect your privacy. Your information will not be shared.
                </Typography>
              </Stack>
            </Stack>
          </Paper>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            mt: 3,
            p: {
              xs: 3,
              md: 4,
            },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            background:
              "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))",
          }}
        >
          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            spacing={3}
            justifyContent="space-between"
            alignItems={{
              xs: "flex-start",
              md: "center",
            }}
          >
            <Box>
              <Typography variant="h4" fontWeight={900}>
                Need Help?
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mt: 1,
                  maxWidth: 700,
                  lineHeight: 1.8,
                }}
              >
                Send your question, service request, feedback, or problem report.
                Your message will be stored securely in Xenji and reviewed through
                the admin dashboard.
              </Typography>

              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={2}
                sx={{ mt: 2 }}
              >
                <Typography color="text.secondary">✓ Admin review</Typography>
                <Typography color="text.secondary">✓ Service requests</Typography>
                <Typography color="text.secondary">✓ Problem reports</Typography>
                <Typography color="text.secondary">✓ General support</Typography>
              </Stack>
            </Box>

            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: "primary.main",
              }}
            >
              <SupportAgentIcon sx={{ fontSize: 40 }} />
            </Avatar>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}