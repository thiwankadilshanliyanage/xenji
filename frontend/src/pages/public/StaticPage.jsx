import { Box, Container, Paper, Typography } from "@mui/material";

export default function StaticPage({ title }) {
  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 5 }}>
      <Container maxWidth="md">
        <Paper sx={{ p: { xs: 3, md: 5 } }}>
          <Typography variant="h2" sx={{ fontSize: { xs: 36, md: 48 } }}>
            {title}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 3, lineHeight: 1.8 }}>
            Xenji collects account data, contact form data, chatbot usage data,
            bookmarks, notifications and localStorage preferences to provide a
            better Japan-life support experience. Xeno AI may use Google Gemini API
            with relevant public Xenji content only. Users should check official
            sources for legal, visa, tax, medical and government-related information.
            Contact Xenji support for privacy requests.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
