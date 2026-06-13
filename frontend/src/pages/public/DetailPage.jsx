import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EmailIcon from "@mui/icons-material/Email";
import LanguageIcon from "@mui/icons-material/Language";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MapIcon from "@mui/icons-material/Map";
import PhoneIcon from "@mui/icons-material/Phone";
import PublicIcon from "@mui/icons-material/Public";
import ScheduleIcon from "@mui/icons-material/Schedule";
import ShareIcon from "@mui/icons-material/Share";
import StarIcon from "@mui/icons-material/Star";

import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useSnackbar } from "../../context/SnackbarContext";

const fallbackImages = {
  services:
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1400&q=80",
  information:
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1400&q=80",
};

const getImageUrl = (item, type) => {
  const image = item?.thumbnailImage || item?.image || item?.coverImage;

  if (!image) return fallbackImages[type];
  if (image.startsWith("http")) return image;
  if (image.startsWith("/uploads")) return `http://localhost:5000${image}`;

  return fallbackImages[type];
};

const getLocationText = (item) => {
  return (
    [item?.address, item?.city, item?.prefecture].filter(Boolean).join(", ") ||
    [item?.city, item?.prefecture].filter(Boolean).join(", ") ||
    "Japan"
  );
};

const getShortLocationText = (item) => {
  return [item?.city, item?.prefecture].filter(Boolean).join(", ") || "Japan";
};

export default function DetailPage({ type }) {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();
  const { show } = useSnackbar();

  const [item, setItem] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const isService = type === "services";

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const response = await api.get(
          `/${isService ? "services" : "information"}/${slug}`
        );

        const currentItem = response.data[isService ? "service" : "article"];

        setItem(currentItem);
        setRelated(response.data.related || []);

        if (isService && user && currentItem?._id) {
          const bookmarkResponse = await api.get("/users/bookmarks");

          const exists = (bookmarkResponse.data.bookmarks || []).some(
            (bookmark) =>
              bookmark.itemType === "Service" &&
              bookmark.itemId?._id === currentItem._id
          );

          setSaved(exists);
        }
      } catch {
        setItem(null);
        setRelated([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [isService, slug, user]);

  const image = useMemo(() => getImageUrl(item, type), [item, type]);

  const handleBookmark = async () => {
    if (!isService) return;

    if (!user) {
      show("Please login to save services", "error");
      navigate("/login");
      return;
    }

    try {
      setSaving(true);

      const response = await api.post(`/services/${item._id}/bookmark`);

      setSaved(Boolean(response.data.bookmarked));
      show(response.data.message || "Bookmark updated");
    } catch (error) {
      show(error.response?.data?.message || "Failed to save service", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      show("Link copied");
    } catch {
      show("Could not copy link", "error");
    }
  };

  if (loading) {
    return (
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 5 }}>
        <Container maxWidth="lg" sx={{ maxWidth: "1040px !important" }}>
          <Skeleton height={36} width={220} sx={{ mb: 3 }} />
          <Skeleton variant="rectangular" height={360} sx={{ borderRadius: 4, mb: 3 }} />
          <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 4 }} />
        </Container>
      </Box>
    );
  }

  if (!item) {
    return (
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 8 }}>
        <Container>
          <Typography variant="h4" fontWeight={850}>
            Not found
          </Typography>
          <Button component={Link} to={isService ? "/services" : "/"} sx={{ mt: 2 }}>
            Go back
          </Button>
        </Container>
      </Box>
    );
  }

  const title = item.title?.en || "Untitled";
  const shortDescription = item.shortDescription?.en || item.summary?.en || "";
  const fullDescription = item.fullDescription?.en || item.content?.en || "";
  const fullLocation = getLocationText(item);
  const shortLocation = getShortLocationText(item);

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "100vh",
        py: { xs: 3, md: 5 },
      }}
    >
      <Container maxWidth="lg" sx={{ maxWidth: "1040px !important" }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
          <Button
            component={Link}
            to={isService ? "/services" : "/"}
            startIcon={<ArrowBackIcon />}
          >
            Back
          </Button>
          <Typography color="text.secondary">/</Typography>
          <Typography color="text.secondary" className="line-clamp-1">
            {title}
          </Typography>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            overflow: "hidden",
            mb: 3,
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 0.75fr" },
            }}
          >
            <Box
              sx={{
                height: { xs: 240, sm: 300, md: 360 },
                overflow: "hidden",
                bgcolor: "background.default",
              }}
            >
              <Box
                component="img"
                src={image}
                alt={title}
                onError={(event) => {
                  event.currentTarget.src = fallbackImages[type];
                }}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </Box>

            <Box
              sx={{
                p: { xs: 2.5, md: 3.2 },
                minHeight: { md: 360 },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                <Chip label={item.category || "General"} size="small" />
                {item.isFeatured && <Chip label="Featured" color="primary" size="small" />}
                {item.status === "published" && (
                  <Chip
                    icon={<CheckCircleIcon />}
                    label="Verified"
                    color="success"
                    size="small"
                  />
                )}
              </Stack>

              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: 32, md: 40 },
                  fontWeight: 900,
                  letterSpacing: "-0.05em",
                  lineHeight: 1.05,
                }}
              >
                {title}
              </Typography>

              <Typography color="text.secondary" sx={{ mt: 1.5, lineHeight: 1.75 }}>
                {shortDescription || "Service information is available below."}
              </Typography>

              {isService && (
                <Stack spacing={1.1} sx={{ mt: 2.2 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <StarIcon sx={{ color: "warning.main" }} />
                    <Typography fontWeight={850}>4.8</Typography>
                    <Typography color="text.secondary">recommended rating</Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <LocationOnIcon color="action" />
                    <Typography color="text.secondary">{shortLocation}</Typography>
                  </Stack>
                </Stack>
              )}

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} sx={{ mt: 2.6 }}>
                {isService && (
                  <Button
                    variant="contained"
                    startIcon={<PhoneIcon />}
                    href={item.phoneNumber ? `tel:${item.phoneNumber}` : undefined}
                  >
                    Contact
                  </Button>
                )}

                {isService && (
                  <Button
                    variant={saved ? "contained" : "outlined"}
                    color={saved ? "success" : "primary"}
                    startIcon={saved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                    disabled={saving}
                    onClick={handleBookmark}
                  >
                    {saved ? "Saved" : "Save"}
                  </Button>
                )}

                <Button variant="outlined" startIcon={<ShareIcon />} onClick={handleShare}>
                  Share
                </Button>
              </Stack>
            </Box>
          </Box>
        </Paper>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) 320px" },
            gap: 3,
            alignItems: "start",
          }}
        >
          <Stack spacing={3}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, md: 3.2 },
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="h5" fontWeight={900}>
                About this {isService ? "service" : "information"}
              </Typography>

              <Typography
                sx={{
                  mt: 2,
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.85,
                  color: "text.secondary",
                }}
              >
                {fullDescription || shortDescription || "No detailed description available."}
              </Typography>

              {isService && (
                <>
                  <Divider sx={{ my: 3 }} />

                  <Typography variant="h6" fontWeight={900}>
                    What you get
                  </Typography>

                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
                    {[
                      "Professional support",
                      "Foreigner friendly",
                      "Reliable service",
                      "Fast response",
                      item.languagesSupported?.[0]
                        ? `${item.languagesSupported[0]} available`
                        : "English available",
                    ].map((label) => (
                      <Chip
                        key={label}
                        label={label}
                        variant="outlined"
                        icon={<CheckCircleIcon />}
                        sx={{ fontWeight: 700 }}
                      />
                    ))}
                  </Stack>
                </>
              )}
            </Paper>

            {related.length > 0 && (
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, md: 3.2 },
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography variant="h5" fontWeight={900}>
                  Related services
                </Typography>

                <Stack spacing={1.5} sx={{ mt: 2 }}>
                  {related.map((service) => (
                    <Paper
                      key={service._id}
                      component={Link}
                      to={`/services/${service.slug}`}
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: "divider",
                        textDecoration: "none",
                        color: "text.primary",
                        "&:hover": {
                          borderColor: "primary.main",
                        },
                      }}
                    >
                      <Typography fontWeight={850}>
                        {service.title?.en || "Untitled service"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {service.shortDescription?.en || service.category}
                      </Typography>
                    </Paper>
                  ))}
                </Stack>
              </Paper>
            )}
          </Stack>

          <Stack spacing={3} sx={{ position: { lg: "sticky" }, top: 94 }}>
            {isService && (
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography variant="h5" fontWeight={900}>
                  Contact this service
                </Typography>

                <Stack spacing={1.2} sx={{ mt: 2.2 }}>
                  {item.websiteUrl && (
                    <Button
                      fullWidth
                      variant="contained"
                      href={item.websiteUrl}
                      target="_blank"
                      startIcon={<PublicIcon />}
                    >
                      Visit website
                    </Button>
                  )}

                  {item.phoneNumber && (
                    <Button
                      fullWidth
                      variant="outlined"
                      href={`tel:${item.phoneNumber}`}
                      startIcon={<PhoneIcon />}
                    >
                      Call
                    </Button>
                  )}

                  {item.contactEmail && (
                    <Button
                      fullWidth
                      variant="outlined"
                      href={`mailto:${item.contactEmail}`}
                      startIcon={<EmailIcon />}
                    >
                      Email
                    </Button>
                  )}

                  {!item.websiteUrl && !item.phoneNumber && !item.contactEmail && (
                    <Typography color="text.secondary">
                      Contact details are not available yet.
                    </Typography>
                  )}
                </Stack>

                <Divider sx={{ my: 2.5 }} />

                <Stack spacing={1.8}>
                  <InfoRow
                    icon={<CheckCircleIcon color="success" />}
                    title="Verified service"
                    text="This service is reviewed by Xenji admin."
                  />
                  <InfoRow
                    icon={<ScheduleIcon color="action" />}
                    title="Working hours"
                    text={item.workingHours || "Please contact provider"}
                  />
                  <InfoRow
                    icon={<LanguageIcon color="action" />}
                    title="Languages"
                    text={item.languagesSupported?.join(", ") || "English, Japanese"}
                  />
                </Stack>
              </Paper>
            )}

            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="h5" fontWeight={900}>
                Location
              </Typography>

              <Box
                sx={{
                  mt: 2,
                  p: 2.2,
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "background.default",
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <Avatar sx={{ bgcolor: "primary.main", width: 42, height: 42 }}>
                    <LocationOnIcon />
                  </Avatar>

                  <Box sx={{ minWidth: 0 }}>
                    <Typography fontWeight={850}>{shortLocation}</Typography>
                    <Typography color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.6 }}>
                      {fullLocation}
                    </Typography>
                  </Box>
                </Stack>

                {item.googleMapsLink && (
                  <Button
                    fullWidth
                    variant="outlined"
                    href={item.googleMapsLink}
                    target="_blank"
                    startIcon={<MapIcon />}
                    sx={{ mt: 2.5 }}
                  >
                    Open in Google Maps
                  </Button>
                )}
              </Box>
            </Paper>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

function InfoRow({ icon, title, text }) {
  return (
    <Stack direction="row" spacing={1.2} alignItems="flex-start">
      {icon}
      <Box>
        <Typography fontWeight={850}>{title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
          {text}
        </Typography>
      </Box>
    </Stack>
  );
}