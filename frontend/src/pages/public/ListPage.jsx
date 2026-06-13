import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  InputAdornment,
  MenuItem,
  Pagination,
  Paper,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import ApartmentIcon from "@mui/icons-material/Apartment";
import ArticleIcon from "@mui/icons-material/Article";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";
import StarIcon from "@mui/icons-material/Star";

import api from "../../api/axios";
import { useLang } from "../../context/LanguageContext";

const ITEMS_PER_PAGE = 12;

const serviceCategories = [
  "All",
  "Housing",
  "Jobs",
  "Moving Support",
  "Hospital / Medical",
  "Driving School",
  "Daily Life Support",
  "Visa Support",
  "Japanese Schools",
  "SIM / Internet",
  "Translation",
  "Banking",
  "Insurance",
];

const fallbackImages = {
  services:
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80",
  information:
    "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=80",
};

const getImageUrl = (item, type) => {
  const image = item.thumbnailImage || item.image || item.coverImage;

  if (!image) return fallbackImages[type];
  if (image.startsWith("http")) return image;
  if (image.startsWith("/uploads")) return `http://localhost:5000${image}`;

  return fallbackImages[type];
};

export default function ListPage({ type }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [loading, setLoading] = useState(false);

  const { t } = useLang();

  const isService = type === "services";
  const title = isService ? t("services") : t("information");

  const params = useMemo(() => {
    const nextParams = {};

    if (search.trim()) nextParams.search = search.trim();
    if (isService && category !== "All") nextParams.category = category;
    if (page > 1) nextParams.page = page;

    return nextParams;
  }, [category, isService, page, search]);

  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

  const paginatedItems = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return items.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [items, page]);

  useEffect(() => {
    setPage(1);
  }, [search, category, type]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setSearchParams(params, { replace: true });

        const { data } = await api.get(isService ? "/services" : "/information", {
          params: {
            search: search.trim() || undefined,
            category: isService && category !== "All" ? category : undefined,
          },
        });

        setItems(data[isService ? "services" : "articles"] || []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [category, isService, params, search, setSearchParams]);

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "100vh",
        py: { xs: 3, md: 5 },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          maxWidth: "1050px !important",
          px: { xs: 2, sm: 3 },
        }}
      >
        <Stack spacing={1.2} sx={{ mb: { xs: 2.5, md: 3 } }}>
          <Chip
            icon={isService ? <ApartmentIcon /> : <ArticleIcon />}
            label={isService ? "Service directory" : "Life information"}
            color="primary"
            variant="outlined"
            sx={{
              width: "fit-content",
              fontWeight: 800,
              borderRadius: 999,
            }}
          />

          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: 34, sm: 40, md: 48 },
              fontWeight: 900,
              letterSpacing: "-0.05em",
              lineHeight: 1.05,
            }}
          >
            {title}
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              maxWidth: 620,
              lineHeight: 1.7,
              fontSize: { xs: 14, sm: 15 },
            }}
          >
            {isService
              ? "Find trusted services that support your life in Japan."
              : "Read useful information and guides for living in Japan."}
          </Typography>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 1.3, md: 2 },
            mb: 3,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 4,
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 220px" },
              gap: 1.5,
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder={
                isService
                  ? "Search services, housing, jobs..."
                  : "Search information..."
              }
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            {isService && (
              <TextField
                select
                size="small"
                label="Category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {serviceCategories.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </Box>
        </Paper>

        {!loading && (
          <Typography color="text.secondary" sx={{ mb: 2, fontSize: 14 }}>
            Showing {paginatedItems.length} of {items.length} result
            {items.length === 1 ? "" : "s"}
          </Typography>
        )}

        {loading ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: { xs: 1.8, md: 2 },
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Card key={item} sx={{ borderRadius: 4 }}>
                <Skeleton variant="rectangular" height={155} />
                <CardContent>
                  <Skeleton height={28} />
                  <Skeleton height={18} />
                  <Skeleton height={18} width="70%" />
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                  md: "repeat(3, minmax(0, 1fr))",
                },
                gap: { xs: 1.8, md: 2 },
              }}
            >
              {paginatedItems.map((item) => {
                const image = getImageUrl(item, type);
                const description =
                  item.shortDescription?.en ||
                  item.summary?.en ||
                  item.fullDescription?.en ||
                  "";
                const href = `/${isService ? "services" : "information"}/${item.slug}`;

                return (
                  <Card
                    key={item._id}
                    component={Link}
                    to={href}
                    sx={{
                      height: { xs: 330, sm: 350, md: 340 },
                      display: "flex",
                      flexDirection: "column",
                      overflow: "hidden",
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 4,
                      bgcolor: "background.paper",
                      boxShadow: "none !important",
                      textDecoration: "none",
                      color: "text.primary",
                      cursor: "pointer",
                      transition: "all .25s ease",
                      WebkitTapHighlightColor: "transparent",
                      "&:hover": {
                        transform: { xs: "none", md: "translateY(-6px)" },
                        borderColor: "primary.main",
                        boxShadow: {
                          xs: "none",
                          md: "0 16px 36px rgba(99,102,241,.18)",
                        },
                      },
                      "&:hover img": {
                        transform: { xs: "none", md: "scale(1.06)" },
                      },
                    }}
                  >
                    <Box sx={{ position: "relative", overflow: "hidden" }}>
                      <CardMedia
                        component="img"
                        image={image}
                        alt={item.title?.en || "Service image"}
                        onError={(event) => {
                          event.currentTarget.src = fallbackImages[type];
                        }}
                        sx={{
                          width: "100%",
                          height: { xs: 145, sm: 150, md: 145 },
                          objectFit: "cover",
                          display: "block",
                          bgcolor: "background.default",
                          transition: "transform .45s ease",
                        }}
                      />

                      {item.isFeatured && (
                        <Chip
                          label="Featured"
                          color="primary"
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 10,
                            left: 10,
                            fontWeight: 900,
                            height: 22,
                            fontSize: 11,
                          }}
                        />
                      )}
                    </Box>

                    <CardContent
                      sx={{
                        flex: 1,
                        p: { xs: 1.6, md: 1.7 },
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={0.8}
                        alignItems="center"
                        sx={{ mb: 1 }}
                      >
                        <Chip
                          label={item.category || "General"}
                          size="small"
                          variant="outlined"
                          sx={{
                            height: 22,
                            fontSize: 11,
                            maxWidth: 160,
                          }}
                        />

                        {item.isImportant && (
                          <Chip
                            label="Important"
                            color="error"
                            size="small"
                            sx={{ height: 22, fontSize: 11 }}
                          />
                        )}
                      </Stack>

                      <Typography
                        variant="h6"
                        className="line-clamp-2"
                        sx={{
                          fontWeight: 900,
                          lineHeight: 1.25,
                          fontSize: { xs: 17, md: 18 },
                          minHeight: 44,
                        }}
                      >
                        {item.title?.en || "Untitled"}
                      </Typography>

                      <Typography
                        color="text.secondary"
                        className="line-clamp-2"
                        sx={{
                          mt: 0.8,
                          lineHeight: 1.55,
                          fontSize: { xs: 13, md: 13.5 },
                          minHeight: 41,
                        }}
                      >
                        {description || "No description available."}
                      </Typography>

                      {isService && (
                        <Stack spacing={0.6} sx={{ mt: 1.2 }}>
                          <Stack direction="row" spacing={0.7} alignItems="center">
                            <LocationOnIcon fontSize="small" color="action" />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              className="line-clamp-1"
                              sx={{ fontSize: 12.5 }}
                            >
                              {[item.city, item.prefecture]
                                .filter(Boolean)
                                .join(", ") || "Japan"}
                            </Typography>
                          </Stack>

                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <StarIcon fontSize="small" sx={{ color: "warning.main" }} />
                            <Typography variant="body2" fontWeight={850} sx={{ fontSize: 12.5 }}>
                              4.8
                            </Typography>
                          </Stack>
                        </Stack>
                      )}

                      <Box sx={{ flex: 1 }} />

                      <Typography
                        sx={{
                          mt: 1.2,
                          color: "primary.main",
                          fontWeight: 900,
                          fontSize: 12.5,
                        }}
                      >
                        Tap to view details →
                      </Typography>
                    </CardContent>
                  </Card>
                );
              })}

              {!items.length && (
                <Paper
                  elevation={0}
                  sx={{
                    gridColumn: "1 / -1",
                    p: { xs: 4, md: 6 },
                    textAlign: "center",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 4,
                  }}
                >
                  <Avatar
                    sx={{
                      mx: "auto",
                      mb: 2,
                      bgcolor: "primary.main",
                      width: 56,
                      height: 56,
                    }}
                  >
                    <SearchIcon />
                  </Avatar>

                  <Typography variant="h5" fontWeight={850}>
                    No results found
                  </Typography>

                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    Try another keyword or category.
                  </Typography>
                </Paper>
              )}
            </Box>

            {totalPages > 1 && (
              <Stack alignItems="center" sx={{ mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  color="primary"
                  shape="rounded"
                  size="small"
                  onChange={(_, value) => {
                    setPage(value);
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }}
                />
              </Stack>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}