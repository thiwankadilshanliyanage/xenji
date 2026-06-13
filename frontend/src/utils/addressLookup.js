import api from "../api/axios";

export const normalizePostalCode = (value) => {
  return String(value || "").replace(/[^0-9]/g, "").slice(0, 7);
};

export const formatPostalCode = (value) => {
  const normalized = normalizePostalCode(value);

  if (normalized.length <= 3) {
    return normalized;
  }

  return `${normalized.slice(0, 3)}-${normalized.slice(3)}`;
};

export const lookupJapaneseAddress = async (postalCode) => {
  const normalized = normalizePostalCode(postalCode);

  if (normalized.length !== 7) {
    throw new Error("Please enter a valid 7-digit Japanese postal code.");
  }

  const { data } = await api.get(`/address/postal/${normalized}`);

  if (!data?.success || !data?.address) {
    throw new Error("Address was not found for this postal code.");
  }

  return data.address;
};
