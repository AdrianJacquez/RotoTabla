import { useEffect, useState } from "react";
import MaterialReactTable from "material-react-table";
import axios from "axios";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import {
  Box,
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
  const [clientDialogOpen, setClientDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [shippingDialogOpen, setShippingDialogOpen] = useState(false);
  const [clientData, setClientData] = useState(null);
  const [cartDetails, setCartDetails] = useState(null);
  const [shippingData, setShippingData] = useState(null);

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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value);
  };

  const handleOpenClientDialog = (client) => {
    setClientData(client);
    setClientDialogOpen(true);
  };

  const handleOpenDetailsDialog = (details) => {
    setCartDetails(details);
    setDetailsDialogOpen(true);
  };

  const handleOpenShippingDialog = (shipping) => {
    setShippingData(shipping);
    setShippingDialogOpen(true);
  };

  const handleCloseClientDialog = () => {
    setClientDialogOpen(false);
  };

  const handleCloseDetailsDialog = () => {
    setDetailsDialogOpen(false);
  };

  const handleCloseShippingDialog = () => {
    setShippingDialogOpen(false);
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

  const clientColumns = [
    {
      accessorKey: "invitado",
      header: "Invitado",
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
          <Box
            sx={(theme) => ({
              display: "flex",
              margin: "auto",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: getBackgroundColor(status, theme),
              borderRadius: "4px",
              color: "#ffffff",
              fontWeight: "bold",
              width: "48%",
              p: "0.2rem",
            })}
          >
            {status === true ? "INVITADO" : "CLIENTE"}
          </Box>
        );
      },
    },
    {
      accessorKey: "nombre",
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
      accessorKey: "email",
      header: "Email",
      size: "auto",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      accessorKey: "telefono",
      header: "Teléfono",
      size: "auto",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
  ];

  const detailColumns = [
    {
      accessorKey: "nombreProducto",
      header: "Producto",
      size: "auto",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      accessorKey: "referenciaProductoProveedor",
      header: "Referencia",
      size: "auto",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      accessorKey: "precioUnitario",
      header: "Precio Unitario",
      size: "auto",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      Cell: ({ cell }) => <span>{formatCurrency(cell.getValue())} MXN</span>,
    },
    {
      accessorKey: "cantidad",
      header: "Cantidad",
      size: "auto",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      accessorKey: "precioTotal",
      header: "Precio Total",
      size: "auto",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      Cell: ({ cell }) => <span>{formatCurrency(cell.getValue())} MXN</span>,
    },
  ];

  const shippingColumns = [
    {
      accessorKey: "entregaEstimada",
      header: "Entrega Estimada",
      size: "auto",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      Cell: ({ cell }) => (
        <span>{new Date(cell.getValue()).toLocaleDateString()}</span>
      ),
    },
    {
      accessorKey: "fechaCreacion",
      header: "Fecha de Creación",
      size: "auto",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      Cell: ({ cell }) => (
        <span>{new Date(cell.getValue()).toLocaleDateString()}</span>
      ),
    },
    {
      accessorKey: "fechaModificacion",
      header: "Fecha de Modificación",
      size: "auto",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      Cell: ({ cell }) => (
        <span>{new Date(cell.getValue()).toLocaleDateString()}</span>
      ),
    },
    {
      accessorKey: "total",
      header: "Total",
      size: "auto",
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
      Cell: ({ cell }) => <span>{formatCurrency(cell.getValue())} MXN</span>,
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
        enableRowSelection={false}
        enableColumnFilterModes
        enableStickyHeader
        initialState={{
          pagination: { pageIndex: 0, pageSize: 10 },
          density: "compact",
        }}
        columns={columns}
        enableGrouping
        enableColumnOrdering
        data={carts}
        enableFullScreenToggle={false}
        enableRowActions
        state={{ isLoading }}
        renderRowActions={({ row }) => (
          <Box sx={{ display: "flex", gap: "0.5rem" }}>
            <Button
              onClick={() => handleOpenShippingDialog(row.original.envio)}
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
        open={clientDialogOpen}
        onClose={handleCloseClientDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Datos del Cliente</DialogTitle>
        <DialogContent>
          {clientData && (
            <MaterialReactTable
              columns={clientColumns}
              data={[clientData]}
              enableFullScreenToggle={false}
              localization={MRT_Localization_ES}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseClientDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={detailsDialogOpen}
        onClose={handleCloseDetailsDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Detalles del Carrito</DialogTitle>
        <DialogContent>
          {cartDetails && (
            <MaterialReactTable
              columns={detailColumns}
              data={cartDetails}
              enableFullScreenToggle={false}
              localization={MRT_Localization_ES}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailsDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={shippingDialogOpen}
        onClose={handleCloseShippingDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Datos del Envío</DialogTitle>
        <DialogContent>
          {shippingData && (
            <MaterialReactTable
              columns={shippingColumns}
              data={[shippingData]}
              enableFullScreenToggle={false}
              localization={MRT_Localization_ES}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseShippingDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Carrito;
