import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import BookmarkIcon from "@mui/icons-material/Bookmark";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";

import api from "../../api/axios";

const fallbackImage =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80";

const getImageUrl = (item) => {
  const image = item?.thumbnailImage || item?.image || item?.coverImage;

  if (!image) return fallbackImage;
  if (image.startsWith("http")) return image;
  if (image.startsWith("/uploads")) return `http://localhost:5000${image}`;

  return fallbackImage;
};

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    api
      .get("/users/bookmarks")
      .then((response) => {
        setBookmarks(response.data.bookmarks || []);
      })
      .catch(() => {
        setBookmarks([]);
      });
  }, []);

  const validBookmarks = bookmarks.filter((bookmark) => bookmark.itemId);

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
      <Container maxWidth="xl">
        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          justifyContent="space-between"
          alignItems={{
            xs: "flex-start",
            md: "flex-end",
          }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Box>
            <Chip
              icon={<BookmarkIcon />}
              label="Saved list"
              color="primary"
              variant="outlined"
              sx={{ mb: 1.5, fontWeight: 700 }}
            />

            <Typography
              variant="h2"
              sx={{
                fontSize: {
                  xs: 38,
                  md: 52,
                },
                fontWeight: 850,
                letterSpacing: "-0.04em",
              }}
            >
              Saved Services
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Services you saved will appear here.
            </Typography>
          </Box>

          <Button component={Link} to="/services" variant="contained" startIcon={<SearchIcon />}>
            Find services
          </Button>
        </Stack>

        {validBookmarks.length > 0 ? (
          <Grid container spacing={2.5}>
            {validBookmarks.map((bookmark) => {
              const service = bookmark.itemId;

              return (
                <Grid item xs={12} sm={6} lg={4} key={bookmark._id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 3,
                      boxShadow: "none !important",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="210"
                      image={getImageUrl(service)}
                      alt={service.title?.en || "Saved service"}
                      sx={{ objectFit: "cover" }}
                    />

                    <CardContent sx={{ flex: 1 }}>
                      <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                        <Chip label={service.category || "General"} size="small" />
                        <Chip label="Saved" color="success" size="small" />
                      </Stack>

                      <Typography variant="h5" fontWeight={850} className="line-clamp-2">
                        {service.title?.en || "Untitled"}
                      </Typography>

                      <Typography color="text.secondary" className="line-clamp-3" sx={{ mt: 1 }}>
                        {service.shortDescription?.en || "No description available."}
                      </Typography>

                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2 }}>
                        <LocationOnIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {[service.city, service.prefecture].filter(Boolean).join(", ") ||
                            "Japan"}
                        </Typography>
                      </Stack>
                    </CardContent>

                    <Box sx={{ p: 2.5, pt: 0 }}>
                      <Button
                        fullWidth
                        component={Link}
                        to={`/services/${service.slug}`}
                        variant="outlined"
                      >
                        View details
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Paper
            elevation={0}
            sx={{
              p: {
                xs: 4,
                md: 6,
              },
              textAlign: "center",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
            }}
          >
            <Avatar
              sx={{
                mx: "auto",
                mb: 2,
                bgcolor: "primary.main",
                width: 58,
                height: 58,
              }}
            >
              <BookmarkIcon />
            </Avatar>

            <Typography variant="h5" fontWeight={850}>
              No saved services yet
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Open a service detail page and click Save to add it here.
            </Typography>

            <Button component={Link} to="/services" variant="contained" sx={{ mt: 3 }}>
              Browse services
            </Button>
          </Paper>
        )}
      </Container>
    </Box>
  );
}