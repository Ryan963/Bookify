import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import AddEmployeeModal from "../../components/Modals/AddEmployeeModal";
import ButtonPrimary from "../../components/UI/ButtonPrimary";
import TitleText from "../../components/UI/TitleText";
import useBranches from "../../hooks/useBranches";
import useEmployee from "../../hooks/useEmployee";
import useEmployees from "../../hooks/useEmployees";

const Employees = () => {
  const [openAddBranchModal, setOpenAddBranchModal] = useState(false);
  const [employee, setEmployee] = useEmployee();
  const [employees, setEmployees] = useEmployees(employee.companyId, [
    employee,
  ]);

  const [branches, setBranches] = useBranches(employee);
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "firstname",
      headerName: "First Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },

    {
      field: "lastname",
      headerName: "Last Name",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "number",
      headerName: "Phone Number",
      type: "number",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "current",
      headerName: "Current",
      headerAlign: "center",
      flex: 1,
      renderCell: ({ row: { current } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={current ? "#3da58a" : "#0c101b"}
            borderRadius="4px"
          >
            <Typography color={"#e0e0e0"} sx={{ ml: "5px" }}>
              {current == true ? "Active" : "Inactive"}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "role",
      headerName: "Role",
      headerAlign: "center",
      flex: 1,
      renderCell: ({ row: { role } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={role === 1 ? "#3da58a" : "#0c101b"}
            borderRadius="4px"
          >
            <Typography color={"#e0e0e0"} sx={{ ml: "5px" }}>
              {role == 1 ? "Manager" : "Employee"}
            </Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <TitleText>Employees</TitleText>
      <div className="absolute top-24">
        <ButtonPrimary onClick={() => setOpenAddBranchModal(true)}>
          <div className="p-2"> New Employee</div>
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
        {employees.length > 0 ? (
          <DataGrid checkboxSelection rows={employees} columns={columns} />
        ) : (
          <div>No Employees to show yet</div>
        )}
      </Box>
      <AddEmployeeModal
        open={openAddBranchModal}
        setOpen={setOpenAddBranchModal}
        employee={employee}
        branches={branches}
      />
    </Box>
  );
};

export default Employees;
