import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import ApartmentIcon from "@mui/icons-material/Apartment";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import LanguageIcon from "@mui/icons-material/Language";
import MovingIcon from "@mui/icons-material/Moving";
import SearchIcon from "@mui/icons-material/Search";
import SchoolIcon from "@mui/icons-material/School";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import WorkIcon from "@mui/icons-material/Work";

import { useLang } from "../../context/LanguageContext";

const categories = [
  { label: "Housing", icon: <ApartmentIcon />, path: "/services?category=Housing" },
  { label: "Jobs", icon: <WorkIcon />, path: "/services?category=Jobs" },
  { label: "Moving", icon: <MovingIcon />, path: "/services?category=Moving Support" },
  { label: "Medical", icon: <HealthAndSafetyIcon />, path: "/services?category=Hospital / Medical" },
  { label: "Driving", icon: <DirectionsCarIcon />, path: "/services?category=Driving School" },
  { label: "Education", icon: <SchoolIcon />, path: "/services?category=Japanese Schools" },
];

const features = [
  {
    title: "Trusted services",
    description: "Find practical services for housing, jobs, moving and daily life.",
    icon: <VerifiedUserIcon />,
  },
  {
    title: "Useful information",
    description: "Read simple guides about visa, city office, insurance and tax.",
    icon: <LanguageIcon />,
  },
  {
    title: "Simple support",
    description: "Use Xeno AI to quickly find useful services and information.",
    icon: <SupportAgentIcon />,
  },
];

const slides = [
  {
    title: "Housing Support",
    subtitle: "Find room, apartment and moving support for life in Japan.",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Jobs & Career Help",
    subtitle: "Search support services for part-time jobs, career and interviews.",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Daily Life in Japan",
    subtitle: "Get help with city office, medical, translation and daily support.",
    image:
      "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1400&q=80",
  },
];

function HeroSlider() {
  const [index, setIndex] = useState(0);

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 4200);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 620,
        mx: "auto",
        borderRadius: 4,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        position: "relative",
        height: { xs: 290, sm: 360, md: 430 },
        boxShadow: "0 24px 70px rgba(0,0,0,0.12)",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{
            position: "absolute",
            inset: 0,
          }}
        >
          <Box
            component="img"
            src={slides[index].image}
            alt={slides[index].title}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </motion.div>
      </AnimatePresence>

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.80) 100%)",
        }}
      />

      <Box sx={{ position: "absolute", top: 20, left: 20 }}>
        <Chip
  label="Xenji Support"
  sx={{
    bgcolor: "rgba(15, 23, 42, 0.78)",
    color: "#fff",
    fontWeight: 900,
    border: "1px solid rgba(255,255,255,0.25)",
    backdropFilter: "blur(10px)",
  }}
/>
      </Box>

      <Box
        sx={{
          position: "absolute",
          left: { xs: 20, md: 28 },
          right: { xs: 20, md: 28 },
          bottom: { xs: 48, md: 58 },
          color: "#fff",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={slides[index].title}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45 }}
          >
            <Typography
              variant="h3"
              sx={{
                fontSize: { xs: 30, md: 42 },
                fontWeight: 900,
                letterSpacing: "-0.04em",
                textShadow: "0 6px 24px rgba(0,0,0,0.35)",
              }}
            >
              {slides[index].title}
            </Typography>

            <Typography
              sx={{
                mt: 1,
                maxWidth: 470,
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.88)",
                fontWeight: 500,
              }}
            >
              {slides[index].subtitle}
            </Typography>
          </motion.div>
        </AnimatePresence>
      </Box>

      <IconButton
        onClick={prevSlide}
        sx={{
          position: "absolute",
          left: 14,
          top: "50%",
          transform: "translateY(-50%)",
          bgcolor: "rgba(255,255,255,0.88)",
          color: "text.primary",
          "&:hover": {
            bgcolor: "rgba(255,255,255,1)",  
      },bgcolor: "rgba(15, 23, 42, 0.72)",
color: "#fff",
border: "1px solid rgba(255,255,255,0.22)",
"&:hover": {
  bgcolor: "rgba(99,102,241,0.95)",
},
        }}
      >
        <ChevronLeftIcon />
      </IconButton>

      <IconButton
        onClick={nextSlide}
        sx={{
          position: "absolute",
          right: 14,
          top: "50%",
          transform: "translateY(-50%)",
          bgcolor: "rgba(255,255,255,0.88)",
          color: "text.primary",
          "&:hover": {
            bgcolor: "rgba(255,255,255,1)",
          },bgcolor: "rgba(15, 23, 42, 0.72)",
color: "#fff",
border: "1px solid rgba(255,255,255,0.22)",
"&:hover": {
  bgcolor: "rgba(99,102,241,0.95)",
},
        }}
      >
        <ChevronRightIcon />
      </IconButton>

      <Stack
        direction="row"
        spacing={1}
        sx={{
          position: "absolute",
          left: { xs: 20, md: 28 },
          bottom: 22,
        }}
      >
        {slides.map((slide, slideIndex) => (
          <Box
            key={slide.title}
            onClick={() => setIndex(slideIndex)}
            sx={{
              width: slideIndex === index ? 28 : 9,
              height: 9,
              borderRadius: 99,
              bgcolor:
                slideIndex === index ? "#fff" : "rgba(255,255,255,0.45)",
              cursor: "pointer",
              transition: "all .25s ease",
            }}
          />
        ))}
      </Stack>
    </Box>
  );
}

export default function Home() {
  const { t } = useLang();
  const navigate = useNavigate();

  const handleSearch = (event) => {
    if (event.key !== "Enter") return;

    const value = event.target.value.trim();

    if (value) {
      navigate(`/services?search=${encodeURIComponent(value)}`);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          bgcolor: "background.default",
          borderBottom: "1px solid",
          borderColor: "divider",
          py: { xs: 5, md: 8 },
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: { xs: 4, md: 7 },
              alignItems: "center",
            }}
          >
            <Box>
              <Chip
                label="Support for foreigners in Japan"
                color="primary"
                variant="outlined"
                sx={{ mb: 2, fontWeight: 700 }}
              />

              <Typography
                variant="h1"
                sx={{
                  maxWidth: 650,
                  fontSize: { xs: 40, sm: 50, md: 64 },
                  lineHeight: 1.06,
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                }}
              >
                {t("heroTitle")}
              </Typography>

              <Typography
                variant="h6"
                color="text.secondary"
                sx={{
                  mt: 2.4,
                  maxWidth: 570,
                  lineHeight: 1.7,
                  fontWeight: 500,
                }}
              >
                {t("tagline")}
              </Typography>

              <Paper
                sx={{
                  mt: 4,
                  p: 0.8,
                  display: "flex",
                  maxWidth: 580,
                  gap: 1,
                  alignItems: "center",
                  borderRadius: 3,
                  boxShadow: "none !important",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <TextField
                  fullWidth
                  placeholder={t("searchPlaceholder")}
                  onKeyDown={handleSearch}
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ px: 1.5 }}
                />

                <Button
                  variant="contained"
                  component={Link}
                  to="/services"
                  sx={{
                    minWidth: 105,
                    display: { xs: "none", sm: "inline-flex" },
                  }}
                >
                  Search
                </Button>
              </Paper>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  size="large"
                  component={Link}
                  to="/services"
                  endIcon={<ArrowForwardIcon />}
                >
                  {t("exploreServices")}
                </Button>
              </Stack>
            </Box>

            <Box>
              <HeroSlider />
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 2.5,
          }}
        >
          {features.map((item) => (
            <Card
              key={item.title}
              sx={{
                height: "100%",
                boxShadow: "none !important",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Avatar
                  sx={{
                    bgcolor: "primary.main",
                    mb: 2,
                    width: 44,
                    height: 44,
                  }}
                >
                  {item.icon}
                </Avatar>

                <Typography variant="h6" fontWeight={800}>
                  {item.title}
                </Typography>

                <Typography color="text.secondary" sx={{ mt: 1, lineHeight: 1.7 }}>
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      <Box
        sx={{
          bgcolor: "background.paper",
          py: {
            xs: 5,
            md: 7,
          },
          borderTop: "1px solid",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Container maxWidth="lg">
          <Stack
            textAlign="center"
            alignItems="center"
            sx={{
              mb: {
                xs: 4,
                md: 5,
              },
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontSize: {
                  xs: 34,
                  md: 44,
                },
                fontWeight: 800,
              }}
            >
              {t("popularCategories")}
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Start from the support you need today.
            </Typography>

            <Button
              component={Link}
              to="/services"
              endIcon={<ArrowForwardIcon />}
              sx={{
                mt: 1,
                fontWeight: 800,
              }}
            >
              View all services
            </Button>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(3, 1fr)",
                md: "repeat(6, 1fr)",
              },
              gap: 3,
              justifyContent: "center",
            }}
          >
            {categories.map((category) => (
              <Box
                key={category.label}
                component={Link}
                to={category.path}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  py: 1,
                  textDecoration: "none",
                  color: "text.primary",
                  transition: "all .2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: {
                      xs: 54,
                      md: 58,
                    },
                    height: {
                      xs: 54,
                      md: 58,
                    },
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    mb: 1.3,
                  }}
                >
                  {category.icon}
                </Avatar>

                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: {
                      xs: "0.9rem",
                      md: "1rem",
                    },
                  }}
                >
                  {category.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>
    </Box>
  );
}