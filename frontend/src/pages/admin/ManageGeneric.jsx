import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import api from "../../api/axios";
import {
  formatPostalCode,
  lookupJapaneseAddress,
  normalizePostalCode,
} from "../../utils/addressLookup";

const emptyService = {
  title: { en: "", ja: "" },
  category: "Housing",
  shortDescription: { en: "", ja: "" },
  fullDescription: { en: "", ja: "" },
  companyName: "",
  websiteUrl: "",
  contactEmail: "",
  phoneNumber: "",
  postalCode: "",
  prefecture: "",
  city: "",
  address: "",
  googleMapsLink: "",
  languagesSupported: ["English"],
  priceInfo: "",
  workingHours: "",
  thumbnailImage: "",
  status: "draft",
};

const emptyInfo = {
  title: { en: "", ja: "" },
  category: "Visa",
  summary: { en: "", ja: "" },
  content: { en: "", ja: "" },
  officialSourceLink: "",
  thumbnailImage: "",
  status: "draft",
  isImportant: false,
  isFeatured: false,
};

const serviceCategories = [
  "Housing",
  "Jobs",
  "Visa Support",
  "Moving Support",
  "Japanese Schools",
  "SIM / Internet",
  "Hospital / Medical",
  "Translation",
  "Insurance",
  "Banking",
  "Driving School",
  "Daily Life Support",
];

export default function ManageGeneric({ type }) {
  const isService = type === "services";
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(isService ? emptyService : emptyInfo);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [notice, setNotice] = useState("");

  const load = async () => {
    const url = isService ? "/services?admin=true" : "/information?admin=true";
    const { data } = await api.get(url);
    setItems(data[isService ? "services" : "articles"] || []);
  };

  useEffect(() => {
    setForm(isService ? emptyService : emptyInfo);
    setEditingId(null);
    load();
  }, [type]);

  const resetForm = () => {
    setForm(isService ? emptyService : emptyInfo);
    setEditingId(null);
    setNotice("");
  };

  const createOrUpdate = async () => {
    try {
      setLoading(true);
      setNotice("");

      if (editingId) {
        await api.put(`/${isService ? "services" : "information"}/${editingId}`, form);
      } else {
        await api.post(isService ? "/services" : "/information", form);
      }

      resetForm();
      await load();
      setNotice(`${isService ? "Service" : "Information"} saved successfully.`);
    } catch (error) {
      setNotice(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const edit = (item) => {
    setEditingId(item._id);
    setNotice("");

    if (isService) {
      setForm({
        ...emptyService,
        ...item,
        title: item.title || { en: "", ja: "" },
        shortDescription: item.shortDescription || { en: "", ja: "" },
        fullDescription: item.fullDescription || { en: "", ja: "" },
        languagesSupported: item.languagesSupported?.length
          ? item.languagesSupported
          : ["English"],
        postalCode: item.postalCode || "",
        thumbnailImage: item.thumbnailImage || "",
      });
    } else {
      setForm({
        ...emptyInfo,
        ...item,
        title: item.title || { en: "", ja: "" },
        summary: item.summary || { en: "", ja: "" },
        content: item.content || { en: "", ja: "" },
        thumbnailImage: item.thumbnailImage || "",
      });
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const publish = async (id) => {
    if (!confirm("Publish this item?")) return;
    await api.put(`/${isService ? "services" : "information"}/${id}/publish`);
    await load();
  };

  const feature = async (id) => {
    await api.put(`/${isService ? "services" : "information"}/${id}/feature`);
    await load();
  };

  const del = async (id) => {
    if (!confirm("Delete this item?")) return;
    await api.delete(`/${isService ? "services" : "information"}/${id}`);
    await load();
  };

  const lookupAddress = async () => {
    try {
      setAddressLoading(true);
      setNotice("");

      const address = await lookupJapaneseAddress(form.postalCode);

      setForm({
        ...form,
        postalCode: formatPostalCode(form.postalCode),
        prefecture: address.prefecture,
        city: `${address.city}${address.town}`,
        address: address.fullAddress,
      });

      setNotice("Address found and filled automatically.");
    } catch (error) {
      setNotice(error.message || "Address lookup failed.");
    } finally {
      setAddressLoading(false);
    }
  };

  const uploadThumbnail = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    try {
      setImageUploading(true);
      setNotice("");

      const formData = new FormData();
      formData.append("image", file);

      const { data } = await api.post("/upload/service-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setForm((prev) => ({
        ...prev,
        thumbnailImage: data.imageUrl,
      }));

      setNotice("Image uploaded successfully.");
    } catch (error) {
      setNotice(error.response?.data?.message || "Image upload failed.");
    } finally {
      setImageUploading(false);
    }
  };

  const imageUploadBlock = (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 3,
        bgcolor: "background.default",
      }}
    >
      <Stack spacing={1.5}>
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={1}>
          <Box>
            <Typography fontWeight={900}>
              {isService ? "Service Image" : "Thumbnail Image"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upload jpg, png, or webp image. Recommended size: 900 × 600.
            </Typography>
          </Box>

          <Button
            variant="outlined"
            component="label"
            disabled={imageUploading}
          >
            {imageUploading ? "Uploading..." : "Upload Image"}
            <input
              hidden
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={uploadThumbnail}
            />
          </Button>
        </Stack>

        {imageUploading && (
          <Stack direction="row" alignItems="center" spacing={1}>
            <CircularProgress size={18} />
            <Typography variant="body2" color="text.secondary">
              Uploading to Cloudinary...
            </Typography>
          </Stack>
        )}

        {form.thumbnailImage && (
          <Box
            component="img"
            src={form.thumbnailImage}
            alt="Thumbnail preview"
            sx={{
              width: "100%",
              maxHeight: 280,
              objectFit: "cover",
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          />
        )}

        <TextField
          label="Thumbnail Image URL"
          value={form.thumbnailImage}
          onChange={(event) =>
            setForm({ ...form, thumbnailImage: event.target.value })
          }
        />
      </Stack>
    </Paper>
  );

  return (
    <>
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        spacing={2}
      >
        <Box>
          <Typography variant="h3" fontWeight={900}>
            Manage {isService ? "Services" : "Information"}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Create, edit, publish and manage Xenji content.
          </Typography>
        </Box>

        {editingId && (
          <Button variant="outlined" onClick={resetForm}>
            Cancel edit
          </Button>
        )}
      </Stack>

      {notice && (
        <Alert
          severity={
            notice.includes("success") || notice.includes("found")
              ? "success"
              : notice.includes("failed") || notice.includes("wrong")
              ? "error"
              : "info"
          }
          sx={{ mt: 3 }}
        >
          {notice}
        </Alert>
      )}

      <Paper sx={{ p: { xs: 2, md: 3 }, my: 3, borderRadius: 4 }}>
        <Typography variant="h5" fontWeight={900} sx={{ mb: 2 }}>
          {editingId ? "Edit" : "Add new"} {isService ? "service" : "information"}
        </Typography>

        <Stack spacing={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Title EN"
                value={form.title.en}
                onChange={(event) =>
                  setForm({
                    ...form,
                    title: { ...form.title, en: event.target.value },
                  })
                }
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Title JA"
                value={form.title.ja}
                onChange={(event) =>
                  setForm({
                    ...form,
                    title: { ...form.title, ja: event.target.value },
                  })
                }
              />
            </Grid>
          </Grid>

          <TextField
            select={isService}
            label="Category"
            value={form.category}
            onChange={(event) => setForm({ ...form, category: event.target.value })}
          >
            {isService &&
              serviceCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
          </TextField>

          {isService ? (
            <>
              {imageUploadBlock}

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Short Description EN"
                    multiline
                    rows={3}
                    value={form.shortDescription.en}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        shortDescription: {
                          ...form.shortDescription,
                          en: event.target.value,
                        },
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Short Description JA"
                    multiline
                    rows={3}
                    value={form.shortDescription.ja}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        shortDescription: {
                          ...form.shortDescription,
                          ja: event.target.value,
                        },
                      })
                    }
                  />
                </Grid>
              </Grid>

              <TextField
                label="Full Description EN"
                multiline
                rows={5}
                value={form.fullDescription.en}
                onChange={(event) =>
                  setForm({
                    ...form,
                    fullDescription: {
                      ...form.fullDescription,
                      en: event.target.value,
                    },
                  })
                }
              />

              <TextField
                label="Company Name"
                value={form.companyName}
                onChange={(event) =>
                  setForm({ ...form, companyName: event.target.value })
                }
              />

              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Postal Code"
                    placeholder="500-0000"
                    value={form.postalCode || ""}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        postalCode: normalizePostalCode(event.target.value),
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    disabled={addressLoading}
                    onClick={lookupAddress}
                    sx={{ height: "100%" }}
                  >
                    {addressLoading ? "Searching..." : "Find address"}
                  </Button>
                </Grid>
                <Grid item xs={12} md={5}>
                  <TextField
                    label="Prefecture"
                    value={form.prefecture}
                    onChange={(event) =>
                      setForm({ ...form, prefecture: event.target.value })
                    }
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="City / Town"
                    value={form.city}
                    onChange={(event) => setForm({ ...form, city: event.target.value })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Address"
                    value={form.address}
                    onChange={(event) =>
                      setForm({ ...form, address: event.target.value })
                    }
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Website URL"
                    value={form.websiteUrl}
                    onChange={(event) =>
                      setForm({ ...form, websiteUrl: event.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Contact Email"
                    value={form.contactEmail}
                    onChange={(event) =>
                      setForm({ ...form, contactEmail: event.target.value })
                    }
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Phone Number"
                    value={form.phoneNumber}
                    onChange={(event) =>
                      setForm({ ...form, phoneNumber: event.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Google Maps Link"
                    value={form.googleMapsLink}
                    onChange={(event) =>
                      setForm({ ...form, googleMapsLink: event.target.value })
                    }
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Price Info"
                    value={form.priceInfo}
                    onChange={(event) =>
                      setForm({ ...form, priceInfo: event.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Working Hours"
                    value={form.workingHours}
                    onChange={(event) =>
                      setForm({ ...form, workingHours: event.target.value })
                    }
                  />
                </Grid>
              </Grid>
            </>
          ) : (
            <>
              {imageUploadBlock}

              <TextField
                label="Summary EN"
                multiline
                rows={3}
                value={form.summary.en}
                onChange={(event) =>
                  setForm({
                    ...form,
                    summary: { ...form.summary, en: event.target.value },
                  })
                }
              />

              <TextField
                label="Content EN"
                multiline
                rows={7}
                value={form.content.en}
                onChange={(event) =>
                  setForm({
                    ...form,
                    content: { ...form.content, en: event.target.value },
                  })
                }
              />

              <TextField
                label="Official Source Link"
                value={form.officialSourceLink}
                onChange={(event) =>
                  setForm({ ...form, officialSourceLink: event.target.value })
                }
              />
            </>
          )}

          <Stack direction="row" spacing={1.5}>
            <Button
              variant="contained"
              disabled={loading || imageUploading}
              onClick={createOrUpdate}
            >
              {loading ? "Saving..." : editingId ? "Update" : "Create"}
            </Button>
            <Button variant="outlined" onClick={resetForm} disabled={loading}>
              Reset
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Paper sx={{ overflow: "hidden", borderRadius: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Featured</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item._id}>
                <TableCell>
                  {item.thumbnailImage ? (
                    <Box
                      component="img"
                      src={item.thumbnailImage}
                      alt={item.title?.en || "thumbnail"}
                      sx={{
                        width: 76,
                        height: 52,
                        objectFit: "cover",
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: 76,
                        height: 52,
                        borderRadius: 2,
                        bgcolor: "action.hover",
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        No image
                      </Typography>
                    </Box>
                  )}
                </TableCell>

                <TableCell>
                  <Typography fontWeight={800}>{item.title?.en}</Typography>
                  {item.title?.ja && (
                    <Typography variant="caption" color="text.secondary">
                      {item.title.ja}
                    </Typography>
                  )}
                </TableCell>

                <TableCell>{item.category}</TableCell>

                <TableCell>
                  <Chip
                    label={item.status}
                    color={item.status === "published" ? "success" : "default"}
                    size="small"
                  />
                </TableCell>

                <TableCell>{item.isFeatured ? "Yes" : "No"}</TableCell>

                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button size="small" onClick={() => edit(item)}>
                      Edit
                    </Button>
                    <Button size="small" onClick={() => publish(item._id)}>
                      Publish
                    </Button>
                    <Button size="small" onClick={() => feature(item._id)}>
                      Feature
                    </Button>
                    <Button size="small" color="error" onClick={() => del(item._id)}>
                      Delete
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}

            {!items.length && (
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography textAlign="center" color="text.secondary" sx={{ py: 4 }}>
                    No items yet.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
}