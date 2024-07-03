import React, { useEffect, useState } from "react";

import { MaterialReactTable } from "material-react-table";

import axios from "axios";

import { MRT_Localization_ES } from "material-react-table/locales/es";

import Dialog from "@mui/material/Dialog";

import FileDownloadIcon from "@mui/icons-material/FileDownload";

import {

  Box,

  Button,

  DialogActions,

  DialogContent,

  // DialogTitle,

  TextField,

} from "@mui/material";

import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";

import IconButtonWithTooltip from "../../../../components/IconButtonWithTooltip";

import EditIcon from "@mui/icons-material/Edit";

import { mkConfig, generateCsv, download } from "export-to-csv";



const csvConfig = mkConfig({

  fieldSeparator: ",",

  decimalSeparator: ".",

  useKeysAsHeaders: true,

  filename: "Productos_Ecommerce",

});



const csvConfigVariants = mkConfig({

  fieldSeparator: ",",

  decimalSeparator: ".",

  useKeysAsHeaders: true,

  filename: "Variantes_Ecommerce",

  useTextDelimiter: true,

  textDelimiter: '"',

  wrapText: true,

});



const ListaProductosEcommerce = () => {

  const [data, setData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [isMobile] = useState(window.innerWidth <= 600);

  // const [openMCP, setOpenMCP] = useState(false);

  const [openVariantDialog, setOpenVariantDialog] = useState(false);

  const [selectedVariants, setSelectedVariants] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [editProductDialogOpen, setEditProductDialogOpen] = useState(false);

  const [editVariantDialogOpen, setEditVariantDialogOpen] = useState(false);

  const [selectedVariant, setSelectedVariant] = useState(null);

  // const [newProduct, setNewProduct] = useState({

  //   nombre: "",

  //   descripcion: "",

  //   caracteristicas: {

  //     capacidad: "",

  //     diametro: "",

  //     altura: "",

  //     diametro_tapa: "",

  //     abastecimiento: "",

  //     color: "",

  //     material: "",

  //   },

  //   nota: "",

  //   referencia: "",

  //   categorias: [],

  //   imagenes: [],

  //   accesorios: [],

  //   documentos_relacionados: [],

  //   proveedor: {

  //     nombre: "",

  //     id: "",

  //   },

  //   precio: {

  //     base: {

  //       cantidad: "",

  //       moneda: "MXN",

  //     },

  //   },

  //   envio: {

  //     tipo: "gratis",

  //     precio: 0.0,

  //     moneda: "MXN",

  //     estimacion_entrega: "",

  //     paisOrigen: "",

  //     regiones_envio: [],

  //   },

  //   cantidad: 0,

  //   disponible: true,

  // });



  // Declarar columnas y sus variables

  const getBackgroundColor = (status, theme) => {

    if (status) return theme.palette.success.main;

    if (!status) return theme.palette.error.main;

  };



  useEffect(() => {

    const fetchData = async () => {

      setIsLoading(true);

      try {

        const response = await axios.get(

          "https://us-central1-tvn-api-store.cloudfunctions.net/app/getAllProducts?completo=true"

        );

        setData(response.data);

      } catch (error) {

        console.error("Error al hacer la petición:", error);

      } finally {

        setIsLoading(false);

      }

    };



    fetchData();

  }, []);



  const handleExportRows = (rows) => {

    const columnsToExport = [

      "id",

      "data.nombre",

      "data.marca",

      "data.caracteristicas.altura",

      "data.caracteristicas.capacidad",

      "data.caracteristicas.diametro",

      "data.caracteristicas.material",

      "data.caracteristicas.peso",

      "data.disponible",

      "data.descripcion",

      "data.beneficios",

    ];

    const rowData = rows.map((row) => {

      const originalData = row.original;

      const filteredRow = {};

      columnsToExport.forEach((key) => {

        const keys = key.split(".");

        let value = originalData;

        keys.forEach((k) => {

          if (value && Object.prototype.hasOwnProperty.call(value, k)) {

            value = value[k];

          } else {

            value = null;

          }

        });

        if (keys[keys.length - 1] === "beneficios" && Array.isArray(value)) {

          // Unir los beneficios en una sola cadena con saltos de línea

          value = value.join("\n");

        }

        filteredRow[keys[keys.length - 1]] = value;

      });

      return filteredRow;

    });



    const csvConfigWithQuotes = {

      ...csvConfig,

      useTextDelimiter: true,

      textDelimiter: '"',

      wrapText: true,

    };



    const csv = generateCsv(csvConfigWithQuotes)(rowData);

    download(csvConfigWithQuotes)(csv);

  };



  const handleExportVariantRows = (rows) => {

    const columnsToExport = [

      "id",

      "data.nombre_completo",

      "data.referencia_id",

      "data.refuerzo",

      "data.precio.cantidad",

      "data.color",

      "data.descripcion",

    ];



    const rowData = rows.map((row) => {

      const originalData = row.original;

      const filteredRow = {};

      columnsToExport.forEach((key) => {

        const keys = key.split(".");

        let value = originalData;

        keys.forEach((k) => {

          if (value && Object.prototype.hasOwnProperty.call(value, k)) {

            value = value[k];

          } else {

            value = null;

          }

        });

        filteredRow[keys[keys.length - 1]] = value;

      });

      return filteredRow;

    });



    const csv = generateCsv(csvConfigVariants)(rowData);

    download(csvConfigVariants)(csv);

  };



  const handleOpenVariantDialog = (variants) => {

    setSelectedVariants(variants);

    setOpenVariantDialog(true);

  };



  const handleCloseVariantDialog = () => {

    setOpenVariantDialog(false);

    setSelectedVariants([]);

  };



  const handleOpenEditProductDialog = (product) => {

    setSelectedProduct(product);

    setEditProductDialogOpen(true);

  };



  const handleCloseEditProductDialog = () => {

    setEditProductDialogOpen(false);

    setSelectedProduct(null);

  };



  const handleOpenEditVariantDialog = (variant) => {

    setSelectedVariant(variant);

    setEditVariantDialogOpen(true);

  };



  const handleCloseEditVariantDialog = () => {

    setEditVariantDialogOpen(false);

    setSelectedVariant(null);

  };



  // const handleInputChange = (e) => {

  //   const { name, value } = e.target;

  //   setNewProduct((prevProduct) => ({

  //     ...prevProduct,

  //     [name]: value,

  //   }));

  // };



  // const handleCaracteristicasChange = (e) => {

  //   const { name, value } = e.target;

  //   setNewProduct((prevProduct) => ({

  //     ...prevProduct,

  //     caracteristicas: {

  //       ...prevProduct.caracteristicas,

  //       [name]: value,

  //     },

  //   }));

  // };



  // const handleProveedorChange = (e) => {

  //   const { name, value } = e.target;

  //   setNewProduct((prevProduct) => ({

  //     ...prevProduct,

  //     proveedor: {

  //       ...prevProduct.proveedor,

  //       [name]: value,

  //     },

  //   }));

  // };



  // const handlePrecioChange = (e) => {

  //   const { name, value } = e.target;

  //   setNewProduct((prevProduct) => ({

  //     ...prevProduct,

  //     precio: {

  //       base: {

  //         ...prevProduct.precio.base,

  //         [name]: value,

  //       },

  //     },

  //   }));

  // };



  // const handleEnvioChange = (e) => {

  //   const { name, value } = e.target;

  //   setNewProduct((prevProduct) => ({

  //     ...prevProduct,

  //     envio: {

  //       ...prevProduct.envio,

  //       [name]: value,

  //     },

  //   }));

  // };



  // const handleCreateProduct = async () => {

  //   try {

  //     await axios.post(

  //       "https://us-central1-tvn-api-store.cloudfunctions.net/app/createProduct",

  //       newProduct

  //     );

  //     setOpenMCP(false);

  //     // Actualizar la lista de productos después de la creación

  //     const response = await axios.get(

  //       "https://us-central1-tvn-api-store.cloudfunctions.net/app/getAllProducts?completo=true"

  //     );

  //     setData(response.data);

  //   } catch (error) {

  //     console.error("Error al crear el producto:", error);

  //   }

  // };



  const handleEditProductChange = (e) => {

    const { name, value } = e.target;

    setSelectedProduct((prevProduct) => ({

      ...prevProduct,

      data: {

        ...prevProduct.data,

        [name]: value,

      },

    }));

  };



  const handleEditCaracteristicasChange = (e) => {

    const { name, value } = e.target;

    setSelectedProduct((prevProduct) => ({

      ...prevProduct,

      data: {

        ...prevProduct.data,

        caracteristicas: {

          ...prevProduct.data.caracteristicas,

          [name]: value,

        },

      },

    }));

  };



  const handleEditVariantChange = (e) => {

    const { name, value } = e.target;

    setSelectedVariant((prevVariant) => ({

      ...prevVariant,

      data: {

        ...prevVariant.data,

        [name]: value,

      },

    }));

  };



  const truncateText = (text, length) => {

    if (text.length <= length) return text;

    return text.slice(0, length) + "...";

  };



  const columns = [

    //ID DE PRODUCTO

    {

      enableEditing: false,

      enableClickToCopy: true,

      accessorKey: "id",

      header: "Producto_ID",

      size: "auto",

      muiTableHeadCellProps: {

        align: "center",

      },

      muiTableBodyCellProps: {

        align: "center",

      },

      enableGrouping: false,

    },

    //DISPONIBILIDAD

    {

      enableClickToCopy: true,

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

              marginLeft: "23%",

              alignItems: "center",

              justifyContent: "center",

              backgroundColor: getBackgroundColor(status, theme),

              borderRadius: "10px",

              color: "#ffffff",

              fontWeight: "bold",

              width: "100%",

              p: "0.2rem",

            })}

          >

            {displayText}

          </Box>

        );

      },

      enableGrouping: false,

    },

    //NOMBRE

    {

      enableClickToCopy: true,

      accessorKey: "data.nombre",

      header: "Nombre",

      size: "auto",

      muiTableHeadCellProps: {

        align: "center",

      },

      muiTableBodyCellProps: {

        align: "center",

      },

      enableGrouping: false,

    },

    //MARCA

    {

      enableEditing: false,

      accessorKey: "data.marca",

      header: "Marca",

      enableClickToCopy: true,

      size: "auto",

      muiTableHeadCellProps: {

        align: "center",

      },

      muiTableBodyCellProps: {

        align: "center",

      },

    },

    //DESCRIPCION

    {

      enableClickToCopy: true,

      accessorKey: "data.descripcion",

      header: "Descripción",

      size: "auto",

      muiTableHeadCellProps: {

        align: "center",

      },

      muiTableBodyCellProps: {

        align: "center",

        sx: {

          whiteSpace: "nowrap",

          overflow: "hidden",

          textOverflow: "ellipsis",

          maxWidth: 200,

        },

      },

      enableGrouping: false,

    },

    //ALTURA

    {

      enableClickToCopy: true,

      accessorKey: "data.caracteristicas.altura",

      header: "Altura",

      size: "auto",

      muiTableHeadCellProps: {

        align: "center",

      },

      muiTableBodyCellProps: {

        align: "center",

      },

    },

    //CAPACIDAD

    {

      enableClickToCopy: true,

      accessorKey: "data.caracteristicas.capacidad",

      header: "Capacidad",

      size: "auto",

      muiTableHeadCellProps: {

        align: "center",

      },

      muiTableBodyCellProps: {

        align: "center",

      },

      enableGrouping: false,

    },

    //DIAMETRO

    {

      enableClickToCopy: true,

      accessorKey: "data.caracteristicas.diametro",

      header: "Diametro",

      size: "auto",

      muiTableHeadCellProps: {

        align: "center",

      },

      muiTableBodyCellProps: {

        align: "center",

      },

      enableGrouping: false,

    },

    //MATERIAL

    {

      enableClickToCopy: true,

      accessorKey: "data.caracteristicas.material",

      header: "Material",

      size: "auto",

      muiTableHeadCellProps: {

        align: "center",

      },

      muiTableBodyCellProps: {

        align: "center",

      },

      enableGrouping: false,

    },

    //PESO

    {

      enableClickToCopy: true,

      accessorKey: "data.caracteristicas.peso",

      header: "Peso",

      size: "auto",

      muiTableHeadCellProps: {

        align: "center",

      },

      muiTableBodyCellProps: {

        align: "center",

      },

      enableGrouping: false,

    },

    //ETIQUETA

    {

      enableClickToCopy: true,

      enableEditing: false,

      accessorKey: "data.etiqueta",

      header: "Etiqueta",

      size: "auto",

      muiTableHeadCellProps: {

        align: "center",

      },

      muiTableBodyCellProps: {

        align: "center",

      },

      enableGrouping: false,

    },

    //BENEFICIOS

    {

      enableClickToCopy: true,

      enableEditing: false,

      accessorKey: "data.beneficios",

      header: "Beneficios",

      size: "auto",

      muiTableHeadCellProps: {

        align: "center",

      },

      muiTableBodyCellProps: {

        align: "center",

        sx: {

          whiteSpace: "nowrap",

          overflow: "hidden",

          textOverflow: "ellipsis",

          maxWidth: 200,

        },

      },

      Cell: ({ cell }) => (

        <span title={cell.getValue()}>{truncateText(cell.getValue(), 50)}</span>

      ),

    },

  ];



  const variantColumns = [

    {

      id: "actions",

      header: "Acciones",

      size: "auto",

      muiTableHeadCellProps: {

        align: "center",

      },

      muiTableBodyCellProps: {

        align: "center",

      },

      Cell: ({ row }) => (

        <IconButtonWithTooltip

          tooltipTitle="Editar Variante"

          iconColor="#FF9800"

          IconComponent={<EditIcon />}

          onIconClick={() => handleOpenEditVariantDialog(row.original)}

        />

      ),

    },

    {

      enableClickToCopy: true,

      enableEditing: false,

      accessorKey: "id",

      header: "ID Variante",

      size: "auto",

      muiTableHeadCellProps: {

        align: "center",

      },

      muiTableBodyCellProps: {

        align: "center",

      },

    },

    {

      enableClickToCopy: true,

      enableEditing: false,

      accessorKey: "data.nombre_completo",

      header: "Nombre Completo",

      size: "auto",

      muiTableHeadCellProps: {

        align: "center",

      },

      muiTableBodyCellProps: {

        align: "center",

      },

    },

    {

      enableClickToCopy: true,

      enableEditing: false,

      accessorKey: "data.referencia_id",

      header: "Referencia Proveedor",

      size: "auto",

      muiTableHeadCellProps: {

        align: "center",

      },

      muiTableBodyCellProps: {

        align: "center",

      },

    },

    {

      enableClickToCopy: true,

      accessorKey: "data.disponible",

      header: "Disponibilidad",

      size: "auto",

      muiTableHeadCellProps: {

        align: "center",

      },

      muiTableBodyCellProps: {

        align: "center",

      },

      Cell: ({ cell }) => (

        <span style={{ color: cell.getValue() ? "green" : "red" }}>

          {cell.getValue() ? "Disponible" : "No disponible"}

        </span>

      ),

    },

    {

      enableClickToCopy: true,

      accessorKey: "data.refuerzo",

      header: "Refuerzo",

      size: "auto",

      muiTableHeadCellProps: {

        align: "center",

      },

      muiTableBodyCellProps: {

        align: "center",

      },

    },

    {

      enableClickToCopy: true,

      enableEditing: false,

      accessorKey: "data.precio.cantidad",

      header: "Precio",

      size: "auto",

      muiTableHeadCellProps: {

        align: "center",

      },

      muiTableBodyCellProps: {

        align: "center",

      },

    },

    {

      enableClickToCopy: true,

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

      enableClickToCopy: true,

      accessorKey: "data.descripcion",

      header: "Descripcion",

      size: "auto",

      muiTableHeadCellProps: {

        align: "center",

      },

      muiTableBodyCellProps: {

        align: "center",

        sx: {

          whiteSpace: "wrap",

          overflow: "hidden",

          textOverflow: "ellipsis",

          maxWidth: 200,

        },

      },

    },

    {

      enableClickToCopy: true,

      accessorKey: "data.imagenes",

      header: "Imagen",

      size: "auto",

      muiTableHeadCellProps: {

        align: "center",

      },

      muiTableBodyCellProps: {

        align: "center",

        sx: {

          whiteSpace: "nowrap",

          overflow: "hidden",

          textOverflow: "ellipsis",

          maxWidth: 200,

        },

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

        muiTableBodyProps={{}}

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

          columnVisibility: { pagarePago: false },

          pagination: { pageIndex: 0, pageSize: 100 },

          density: "compact",

        }}

        columns={columns}

        enableGrouping

        enableColumnOrdering

        data={data}

        enableFullScreenToggle={false}

        state={{ isLoading }}

        enableRowActions

        renderRowActions={({ row }) => (

          <Box sx={{ display: "flex", gap: "0.5rem" }}>

            <IconButtonWithTooltip

              tooltipTitle="Editar Producto"

              iconColor="#FF9800"

              IconComponent={<EditIcon />}

              onIconClick={() => handleOpenEditProductDialog(row.original)}

            />

            <IconButtonWithTooltip

              tooltipTitle="Ver Variantes"

              iconColor="#262E66"

              IconComponent={<PlaylistAddIcon />}

              onIconClick={() =>

                handleOpenVariantDialog(row.original.data.variantes)

              }

            />

          </Box>

        )}

        renderTopToolbarCustomActions={({ table }) => (

          <Box

            sx={{

              display: "flex",

              gap: "1rem",

              width: "auto",

              p: "0.30rem",

            }}

          >

            {/* <Button

              style={{ width: "fit-content", color: "#262E66" }}

              startIcon={<PlaylistAddIcon />}

              onClick={() => {

                setOpenMCP(true);

              }}

            >

              {isMobile ? "" : "Crear Producto"}

            </Button> */}



            <Button

              style={{ width: "fit-content", color: "#2e7d32" }}

              disabled={table.getPrePaginationRowModel().rows.length === 0}

              onClick={() =>

                handleExportRows(table.getPrePaginationRowModel().rows)

              }

              startIcon={<FileDownloadIcon />}

            >

              {isMobile ? "" : "Exportar Datos"}

            </Button>

          </Box>

        )}

      />



      <Dialog

        open={openVariantDialog}

        onClose={handleCloseVariantDialog}

        maxWidth="xl"

        fullWidth

      >

        <DialogContent>

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

            muiTableBodyProps={{}}

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

              columnVisibility: { pagarePago: false },

              pagination: { pageIndex: 0, pageSize: 100 },

              density: "compact",

            }}

            columns={variantColumns}

            data={selectedVariants}

            enableFullScreenToggle={false}

            state={{ isLoading: false }}

            enableGrouping

            renderRowActions={({ row }) => (

              <IconButtonWithTooltip

                tooltipTitle="Editar Variante"

                iconColor="#FF9800"

                IconComponent={<EditIcon />}

                onIconClick={() => handleOpenEditVariantDialog(row.original)}

              />

            )}

          />

        </DialogContent>

        <DialogActions>

          <Button

            onClick={() => handleExportVariantRows(selectedVariants)}

            startIcon={<FileDownloadIcon />}

          >

            Exportar Variantes

          </Button>

          <Button onClick={handleCloseVariantDialog}>Cerrar</Button>

        </DialogActions>

      </Dialog>



      <Dialog

        open={editProductDialogOpen}

        onClose={handleCloseEditProductDialog}

        maxWidth="sm"

        fullWidth

      >

        {/Dialog para editar un producto seleccionado./}

        <DialogContent>

          {selectedProduct && (

            <form>

              <Box display="flex" flexDirection="column" gap="1rem">

                <TextField

                  label="Producto_ID"

                  value={selectedProduct.id}

                  InputProps={{

                    readOnly: true,

                  }}

                  variant="outlined"

                />

                <TextField

                  label="Nombre"

                  name="nombre"

                  value={selectedProduct.data.nombre}

                  onChange={handleEditProductChange}

                  InputProps={{

                    readOnly: true,

                  }}

                  variant="outlined"

                />

                <TextField

                  label="Marca"

                  name="marca"

                  value={selectedProduct.data.marca}

                  onChange={handleEditProductChange}

                  InputProps={{

                    readOnly: true,

                  }}

                  variant="outlined"

                />

                <TextField

                  label="Altura"

                  name="altura"

                  value={selectedProduct.data.caracteristicas.altura}

                  onChange={handleEditCaracteristicasChange}

                  variant="outlined"

                  InputProps={{

                    readOnly: true,

                  }}

                />

                <TextField

                  label="Capacidad"

                  name="capacidad"

                  value={selectedProduct.data.caracteristicas.capacidad}

                  onChange={handleEditCaracteristicasChange}

                  variant="outlined"

                  InputProps={{

                    readOnly: true,

                  }}

                />

                <TextField

                  label="Descripción"

                  name="descripcion"

                  value={selectedProduct.data.descripcion}

                  onChange={handleEditProductChange}

                  variant="outlined"

                />

                <TextField

                  label="Disponible"

                  name="disponible"

                  value={selectedProduct.data.disponible ? "Sí" : "No"}

                  onChange={(e) =>

                    setSelectedProduct((prevProduct) => ({

                      ...prevProduct,

                      data: {

                        ...prevProduct.data,

                        disponible: e.target.value === "Sí",

                      },

                    }))

                  }

                  variant="outlined"

                />

                <TextField

                  label="Diámetro"

                  name="diametro"

                  value={selectedProduct.data.caracteristicas.diametro}

                  onChange={handleEditCaracteristicasChange}

                  variant="outlined"

                  InputProps={{

                    readOnly: true,

                  }}

                />

                <TextField

                  label="Material"

                  name="material"

                  value={selectedProduct.data.caracteristicas.material}

                  onChange={handleEditCaracteristicasChange}

                  variant="outlined"

                  InputProps={{

                    readOnly: true,

                  }}

                />

                <TextField

                  label="Peso"

                  name="peso"

                  value={selectedProduct.data.caracteristicas.peso}

                  onChange={handleEditProductChange}

                  variant="outlined"

                  InputProps={{

                    readOnly: true,

                  }}

                />

                <TextField

                  label="Etiqueta"

                  name="etiqueta"

                  value={selectedProduct.data.etiqueta}

                  onChange={handleEditProductChange}

                  variant="outlined"

                />

                <TextField

                  label="Beneficios"

                  name="beneficios"

                  value={selectedProduct.data.beneficios}

                  onChange={handleEditProductChange}

                  variant="outlined"

                />

              </Box>

            </form>

          )}

        </DialogContent>

        <DialogActions>

          <Button onClick={handleCloseEditProductDialog}>Cancelar</Button>

          <Button

            onClick={() => {

              /* lógica para guardar cambios */

            }}

          >

            Guardar

          </Button>

        </DialogActions>

      </Dialog>



      <Dialog

        open={editVariantDialogOpen}

        onClose={handleCloseEditVariantDialog}

        maxWidth="sm"

        fullWidth

      >

        <DialogContent>

          {selectedVariant && (

            <form>

              <Box display="flex" flexDirection="column" gap="1rem">

                <TextField

                  label="ID Variante"

                  value={selectedVariant.id}

                  InputProps={{

                    readOnly: true,

                  }}

                  variant="outlined"

                />

                <TextField

                  label="Nombre Completo"

                  name="nombre_completo"

                  value={selectedVariant.data.nombre_completo}

                  onChange={handleEditVariantChange}

                  variant="outlined"

                  InputProps={{

                    readOnly: true,

                  }}

                />

                <TextField

                  label="Referencia Proveedor"

                  name="referencia_id"

                  value={selectedVariant.data.referencia_id}

                  onChange={handleEditVariantChange}

                  variant="outlined"

                  InputProps={{

                    readOnly: true,

                  }}

                />

                <TextField

                  label="Disponibilidad"

                  name="disponible"

                  value={selectedVariant.data.disponible ? "Sí" : "No"}

                  onChange={(e) =>

                    setSelectedVariant((prevVariant) => ({

                      ...prevVariant,

                      data: {

                        ...prevVariant.data,

                        disponible: e.target.value === "Sí",

                      },

                    }))

                  }

                  variant="outlined"

                />

                <TextField

                  label="Refuerzo"

                  name="refuerzo"

                  value={selectedVariant.data.refuerzo}

                  onChange={handleEditVariantChange}

                  variant="outlined"

                  InputProps={{

                    readOnly: true,

                  }}

                />

                <TextField

                  label="Precio"

                  name="cantidad"

                  value={selectedVariant.data.precio.cantidad}

                  onChange={handleEditVariantChange}

                  variant="outlined"

                  InputProps={{

                    readOnly: true,

                  }}

                />

                <TextField

                  label="Color"

                  name="color"

                  value={selectedVariant.data.color}

                  onChange={handleEditVariantChange}

                  variant="outlined"

                  InputProps={{

                    readOnly: true,

                  }}

                />

                <TextField

                  label="Descripción"

                  name="descripcion"

                  value={selectedVariant.data.descripcion}

                  onChange={handleEditVariantChange}

                  variant="outlined"

                />

                <TextField

                  label="Imagen"

                  name="imagenes"

                  value={selectedVariant.data.imagenes.join(", ")}

                  onChange={(e) =>

                    handleEditVariantChange({

                      target: {

                        name: "imagenes",

                        value: e.target.value.split(","),

                      },

                    })

                  }

                  variant="outlined"

                />

              </Box>

            </form>

          )}

        </DialogContent>

        <DialogActions>

          <Button onClick={handleCloseEditVariantDialog}>Cancelar</Button>

          <Button

            onClick={() => {

              /* lógica para guardar cambios */

            }}

          >

            Guardar

          </Button>

        </DialogActions>

      </Dialog>



      {/* <Dialog

        open={openMCP}

        onClose={() => setOpenMCP(false)}

        maxWidth="sm"

        fullWidth

      >

        <DialogTitle>Crear Producto</DialogTitle>

        <DialogContent>

          <form>

            <Box display="flex" flexDirection="column" gap="1rem">

              <TextField

                label="Nombre"

                name="nombre"

                value={newProduct.nombre}

                onChange={handleInputChange}

                variant="outlined"

              />

              <TextField

                label="Descripción"

                name="descripcion"

                value={newProduct.descripcion}

                onChange={handleInputChange}

                variant="outlined"

              />

              <TextField

                label="Capacidad"

                name="capacidad"

                value={newProduct.caracteristicas.capacidad}

                onChange={handleCaracteristicasChange}

                variant="outlined"

              />

              <TextField

                label="Diámetro"

                name="diametro"

                value={newProduct.caracteristicas.diametro}

                onChange={handleCaracteristicasChange}

                variant="outlined"

              />

              <TextField

                label="Altura"

                name="altura"

                value={newProduct.caracteristicas.altura}

                onChange={handleCaracteristicasChange}

                variant="outlined"

              />

              <TextField

                label="Diámetro Tapa"

                name="diametro_tapa"

                value={newProduct.caracteristicas.diametro_tapa}

                onChange={handleCaracteristicasChange}

                variant="outlined"

              />

              <TextField

                label="Abastecimiento"

                name="abastecimiento"

                value={newProduct.caracteristicas.abastecimiento}

                onChange={handleCaracteristicasChange}

                variant="outlined"

              />

              <TextField

                label="Color"

                name="color"

                value={newProduct.caracteristicas.color}

                onChange={handleCaracteristicasChange}

                variant="outlined"

              />

              <TextField

                label="Material"

                name="material"

                value={newProduct.caracteristicas.material}

                onChange={handleCaracteristicasChange}

                variant="outlined"

              />

              <TextField

                label="Nota"

                name="nota"

                value={newProduct.nota}

                onChange={handleInputChange}

                variant="outlined"

              />

              <TextField

                label="Referencia"

                name="referencia"

                value={newProduct.referencia}

                onChange={handleInputChange}

                variant="outlined"

              />

              <TextField

                label="Proveedor Nombre"

                name="nombre"

                value={newProduct.proveedor.nombre}

                onChange={handleProveedorChange}

                variant="outlined"

              />

              <TextField

                label="Proveedor ID"

                name="id"

                value={newProduct.proveedor.id}

                onChange={handleProveedorChange}

                variant="outlined"

              />

              <TextField

                label="Precio"

                name="cantidad"

                value={newProduct.precio.base.cantidad}

                onChange={handlePrecioChange}

                variant="outlined"

              />

              <TextField

                label="Moneda"

                name="moneda"

                value={newProduct.precio.base.moneda}

                onChange={handlePrecioChange}

                variant="outlined"

                disabled

              />

              <TextField

                label="Tipo de Envío"

                name="tipo"

                value={newProduct.envio.tipo}

                onChange={handleEnvioChange}

                variant="outlined"

              />

              <TextField

                label="Precio de Envío"

                name="precio"

                value={newProduct.envio.precio}

                onChange={handleEnvioChange}

                variant="outlined"

              />

              <TextField

                label="Moneda de Envío"

                name="moneda"

                value={newProduct.envio.moneda}

                onChange={handleEnvioChange}

                variant="outlined"

                disabled

              />

              <TextField

                label="Estimación de Entrega"

                name="estimacion_entrega"

                value={newProduct.envio.estimacion_entrega}

                onChange={handleEnvioChange}

                variant="outlined"

              />

              <TextField

                label="País de Origen"

                name="paisOrigen"

                value={newProduct.envio.paisOrigen}

                onChange={handleEnvioChange}

                variant="outlined"

              />

              <TextField

                label="Regiones de Envío"

                name="regiones_envio"

                value={newProduct.envio.regiones_envio.join(", ")}

                onChange={(e) =>

                  handleEnvioChange({

                    target: {

                      name: "regiones_envio",

                      value: e.target.value.split(","),

                    },

                  })

                }

                variant="outlined"

              />

              <TextField

                label="Cantidad"

                name="cantidad"

                value={newProduct.cantidad}

                onChange={handleInputChange}

                variant="outlined"

              />

              <TextField

                label="Disponible"

                name="disponible"

                value={newProduct.disponible ? "Sí" : "No"}

                onChange={(e) =>

                  setNewProduct((prevProduct) => ({

                    ...prevProduct,

                    disponible: e.target.value === "Sí",

                  }))

                }

                variant="outlined"

              />

            </Box>

          </form>

        </DialogContent>

        <DialogActions>

          <Button onClick={() => setOpenMCP(false)}>Cancelar</Button>

          <Button onClick={handleCreateProduct}>Crear</Button>

        </DialogActions>

      </Dialog> */}

    </>

  );

};



export default ListaProductosEcommerce;

Lo comentado no lo ocupas checa el como se maneja el de ver variantes xd encontre el codigo previo con el que ya habia hecho eso de ver variantes con la unica consulta que te pase xd