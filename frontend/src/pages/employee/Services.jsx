import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import AddCompanyServiceModal from "../../components/Modals/AddCompanyServiceModal";
import ButtonPrimary from "../../components/UI/ButtonPrimary";
import TitleText from "../../components/UI/TitleText";
import useCompanyServices from "../../hooks/useCompanyServices";
import useEmployee from "../../hooks/useEmployee";
import useServices from "../../hooks/useServices";

const Services = () => {
  const [openAddServiceModal, setOpenAddServiceModal] = useState(false);
  const [employee, setEmployee] = useEmployee();
  const [services, setServices] = useCompanyServices(employee.companyId, [
    employee,
  ]);
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },

    {
      field: "length",
      headerName: "Length",
      headerAlign: "center",
      flex: 1,
      align: "center",
    },
    {
      field: "price",
      headerName: "Price",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "description",
      headerName: "Desciption",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
  ];

  return (
    <Box m="20px">
      <TitleText>Services</TitleText>
      <div className="absolute top-24">
        <ButtonPrimary onClick={() => setOpenAddServiceModal(true)}>
          <div className="p-2"> New Service</div>
        </ButtonPrimary>
      </div>
      <Box
        m="40px 0 0 0"
        p="10px"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
            color: "white",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: "#94e2cd",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "rgb(249, 115, 22)",
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: "#1F2A40",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: "rgb(249, 115 ,22)",
          },
          "& .MuiCheckbox-root": {
            color: `#b7ebde !important`,
          },
        }}
      >
        {services.length > 0 ? (
          <DataGrid checkboxSelection rows={services} columns={columns} />
        ) : (
          <div>No Services to show yet</div>
        )}
      </Box>
      <AddCompanyServiceModal
        open={openAddServiceModal}
        setOpen={setOpenAddServiceModal}
        employee={employee}
        companyServices={services}
      />
    </Box>
  );
};

export default Services;
