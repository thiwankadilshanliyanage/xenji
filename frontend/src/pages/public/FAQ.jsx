import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Container,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";

import api from "../../api/axios";

export default function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .get("/faqs", { params: { search } })
      .then((response) => setFaqs(response.data.faqs || []));
  }, [search]);

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 5 }}>
      <Container maxWidth="md">
        <Typography variant="h2" sx={{ fontSize: { xs: 36, md: 48 } }}>
          Frequently asked questions
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
          Find quick answers about living in Japan and using Xenji.
        </Typography>

        <Paper sx={{ p: 2, mb: 3 }}>
          <TextField
            placeholder="Search FAQ"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Paper>

        {faqs.map((faq) => (
          <Accordion key={faq._id} disableGutters sx={{ mb: 1.2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight={800}>{faq.question?.en}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                {faq.answer?.en}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>
    </Box>
  );
}
