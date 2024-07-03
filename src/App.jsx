import { useEffect, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import axios from "axios";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import {
  Box,
  Collapse,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const Carrito = () => {
  const [carts, setCarts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile] = useState(window.innerWidth <= 600);
  const [variantesDialogOpen, setVarianteDialogOpen] = useState(false);
  const [varianteData, setVarianteData] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          "https://us-central1-tvn-api-store.cloudfunctions.net/app/getAllProducts?completo=true"
        );
        setCarts(response.data);
      } catch (error) {
        console.error("Error fetching the carts data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getBackgroundColor = (status, theme) => {
    if (status === true) return theme.palette.success.main;
    if (status === false) return theme.palette.info.main;
    return theme.palette.grey[500];
  };

  const handleOpenVarianteDialog = (variante) => {
    setVarianteData(variante);
    setVarianteDialogOpen(true);
    console.log(carts);
  };

  const handleCloseVarianteDialog = () => {
    setVarianteDialogOpen(false);
  };

  const columns = [
    {
      accessorKey: "id",
      header: "Identificador",
      size: "auto",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      accessorKey: "data.marca",
      header: "Creación",
      size: "auto",
      subRows: [
        {
          id: 2,
          name: "Jane Doe",
        },
      ],
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      accessorKey: "data.fecha_registro",
      header: "Ultima modificación",
      size: "auto",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      accessorKey: "data.nombre",
      header: "Nombre",
      size: "auto",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      accessorKey: "data.descripcion_corta",
      header: "Descripcion",
      size: "auto",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      accessorKey: "data.etiqueta",
      header: "Etiqueta",
      size: "auto",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      accessorKey: "data.disponible",
      header: "Disponibilidad",
      size: "auto",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      Cell: ({ cell }) => {
        const status = cell.getValue();
        const displayText = status ? "Disponible" : "Sin disponibilidad";

        return (
          <Box
            sx={(theme) => ({
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: getBackgroundColor(status, theme),
              borderRadius: "10px",
              color: "#ffffff",
              fontWeight: "bold",
              width: "150px",
              p: "0.2rem",
            })}
          >
            {displayText}
          </Box>
        );
      },
    },
  ];
  // const masInfo = [
  //   {
  //     accessorKey: "data.tool_tip",
  //     header: "Descripcion",
  //     size: "auto",
  //     muiTableHeadCellProps: {
  //       align: "center",
  //     },
  //     muiTableBodyCellProps: {
  //       align: "center",
  //     },
  //   },
  // ];

  const variantesColumns = [
    {
      accessorKey: "data.nombre_completo",
      header: "Nombre",
      size: "auto",
      subRows: [
        {
          id: 2,
          name: "Jane Doe",
        },
      ],
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      accessorKey: "data.tool_tip",
      header: "Descripcion",
      size: "auto",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      accessorKey: "data.refuerzo",
      header: "Refuerzo Del",
      size: "auto",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      accessorKey: "data.color",
      header: "Color",
      size: "auto",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },

    {
      accessorKey: "data.precio.cantidad",
      header: "Precio",
      size: "auto",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      Cell: ({ cell }) => {
        const status = cell.getValue();

        return (
          <>
            <span>${status}MXN</span>
          </>
        );
      },
    },
  ];

  return (
    <>
      <MaterialReactTable
        muiTableContainerProps={{
          sx: {
            maxHeight: isMobile
              ? "62vh"
              : {
                  maxHeight: "75vh",
                  "@media (max-height: 800px)": {
                    maxHeight: "50vh",
                  },
                  "@media (max-height: 700px)": {
                    maxHeight: "65vh",
                  },
                  "@media (max-height: 600px)": {
                    maxHeight: "60vh",
                  },
                  "@media (max-height: 500px)": {
                    maxHeight: "55vh",
                  },
                  height: "auto",
                },
            height: "auto",
          },
        }}
        muiTableHeadCellProps={{
          sx: () => ({
            fontSize: "16px",
          }),
        }}
        muiTablePaperProps={{
          elevation: isMobile ? 0 : 10,
          sx: {
            borderRadius: isMobile ? "" : "4px",
          },
        }}
        localization={MRT_Localization_ES}
        enableColumnFilterModes={true}
        enableStickyHeader
        initialState={{
          pagination: { pageIndex: 0, pageSize: 100 },
          density: "compact",
        }}
        columns={columns}
        enableGrouping
        enableColumnOrdering
        data={carts}
        enableFullScreenToggle={false}
        enableRowActions={true}
        state={{ isLoading }}
        renderRowActions={({ row }) => (
          <Box sx={{ display: "flex", gap: "0.5rem" }}>
            <Button
              onClick={() =>
                handleOpenVarianteDialog(row.original.data.variantes)
              }
              variant="contained"
              color="success"
              size="small"
            >
              Ver Variantes
            </Button>
          </Box>
        )}
      />

      <Dialog
        open={variantesDialogOpen}
        onClose={handleCloseVarianteDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Datos del Envío</DialogTitle>
        <DialogContent>
          {varianteData && (
            <MaterialReactTable
              columns={variantesColumns}
              data={varianteData}
              enableFullScreenToggle={false}
              enableExpanding={true}
              enableRowSelection={true}
              localization={MRT_Localization_ES}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseVarianteDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Carrito;
