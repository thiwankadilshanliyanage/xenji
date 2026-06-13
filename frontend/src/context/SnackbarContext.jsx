import React, { createContext, useContext, useState } from "react";
import { Alert, Snackbar } from "@mui/material";

const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
  const [messageData, setMessageData] = useState(null);

  const show = (message, severity = "success") => {
    setMessageData({
      message,
      severity,
    });
  };

  const close = () => {
    setMessageData(null);
  };

  return (
    <SnackbarContext.Provider value={{ show }}>
      {children}

      <Snackbar
        open={Boolean(messageData)}
        autoHideDuration={3500}
        onClose={close}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={close}
          severity={messageData?.severity || "success"}
          variant="filled"
          sx={{
            width: "100%",
            borderRadius: 2,
          }}
        >
          {messageData?.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => useContext(SnackbarContext);