export const lookupPostalCode = async (req, res, next) => {
  try {
    const postalCode = String(req.params.postalCode || "").replace(/[^0-9]/g, "");

    if (postalCode.length !== 7) {
      return res.status(400).json({
        success: false,
        message: "Postal code must be 7 digits.",
      });
    }

    const response = await fetch(
      `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${postalCode}`
    );
    const data = await response.json();
    const result = data?.results?.[0];

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Address not found.",
      });
    }

    const address = {
      postalCode,
      prefecture: result.address1 || "",
      city: result.address2 || "",
      town: result.address3 || "",
      fullAddress: [result.address1, result.address2, result.address3]
        .filter(Boolean)
        .join(""),
      kana: [result.kana1, result.kana2, result.kana3].filter(Boolean).join(""),
    };

    res.json({
      success: true,
      address,
    });
  } catch (error) {
    next(error);
  }
};
