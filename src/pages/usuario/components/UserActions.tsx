import { Check, Save } from "@mui/icons-material";
import { Box, CircularProgress, Fab } from "@mui/material";
import { green } from "@mui/material/colors";
import React, { useState } from "react";
import { loadingIndicatorCSS } from "react-select/dist/declarations/src/components/indicators";
import { UsuarioService } from "../../../shared/services/api/UsuarioService";

export const UserActions = ({ params, rowId, setRowId }) => {
  const [loading, setLoagind] = useState(true);
  const [success, setsuccess] = useState(true);

  const handleSubmit = () => {
    UsuarioService.updateById(rowId).then((result) => {
      if (result instanceof Error) {
        alert(result.message);
      } else {
        setUserRows((oldRows) => {
          return [...oldRows.filter((oldRow) => oldRow.id !== id)];
        });
        alert("Registro apagado com sucesso!");
      }
    });
  };

  return (
    <Box
      sx={{
        m: 1,
        position: "relative",
      }}
    >
      {success ? (
        <Fab
          color="primary"
          sx={{
            width: 40,
            height: 40,
            bgcolor: green[500],
            "&:hover": { bgcolor: green[700] },
          }}
        >
          <Check />
        </Fab>
      ) : (
        <Fab
          color="primary"
          sx={{
            width: 40,
            height: 40,
          }}
          disabled={params.id !== rowId || loading}
          onClick={handleSubmit}
        >
          <Save />
        </Fab>
      )}
      {loading && (
        <CircularProgress
          size={52}
          sx={{
            color: green[500],
            position: "absolute",
            top: -6,
            left: -6,
            zIndex: 1,
          }}
        />
      )}
    </Box>
  );
};
