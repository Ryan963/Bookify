import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import AddBranchModal from "../../components/Modals/AddBranchModal";
import ButtonPrimary from "../../components/UI/ButtonPrimary";
import TitleText from "../../components/UI/TitleText";
import useBranches from "../../hooks/useBranches";
import useEmployee from "../../hooks/useEmployee";

const Branches = () => {
  const [openAddBranchModal, setOpenAddBranchModal] = useState(false);
  const [employee, setEmployee] = useEmployee();
  const [branches, setBranches] = useBranches(employee);
  const mockDataBranches = [
    {
      id: 1,
      name: "Jon Snow",
      email: "jonsnow@gmail.com",
      age: 35,
      phone: "(665)121-5454",
      access: "admin",
    },
    {
      id: 2,
      name: "Cersei Lannister",
      email: "cerseilannister@gmail.com",
      age: 42,
      phone: "(421)314-2288",
      access: "manager",
    },
    {
      id: 3,
      name: "Jaime Lannister",
      email: "jaimelannister@gmail.com",
      age: 45,
      phone: "(422)982-6739",
      access: "user",
    },
    {
      id: 4,
      name: "Anya Stark",
      email: "anyastark@gmail.com",
      age: 16,
      phone: "(921)425-6742",
      access: "admin",
    },
    {
      id: 5,
      name: "Daenerys Targaryen",
      email: "daenerystargaryen@gmail.com",
      age: 31,
      phone: "(421)445-1189",
      access: "user",
    },
    {
      id: 6,
      name: "Ever Melisandre",
      email: "evermelisandre@gmail.com",
      age: 150,
      phone: "(232)545-6483",
      access: "manager",
    },
    {
      id: 7,
      name: "Ferrara Clifford",
      email: "ferraraclifford@gmail.com",
      age: 44,
      phone: "(543)124-0123",
      access: "user",
    },
    {
      id: 8,
      name: "Rossini Frances",
      email: "rossinifrances@gmail.com",
      age: 36,
      phone: "(222)444-5555",
      access: "user",
    },
    {
      id: 9,
      name: "Harvey Roxie",
      email: "harveyroxie@gmail.com",
      age: 65,
      phone: "(444)555-6239",
      access: "admin",
    },
  ];
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "address",
      headerName: "Address",
      flex: 1,
      cellClassName: "name-column--cell",
    },

    {
      field: "province",
      headerName: "Province",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "city",
      headerName: "City",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "number",
      headerName: "Phone Number",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },

    {
      field: "current",
      headerName: "Current",
      headerAlign: "center",
      renderCell: ({ row: { current } }) => {
        return (
          <Box
            width="50%"
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
  ];

  return (
    <Box m="20px">
      <TitleText>Branches</TitleText>
      <div className="absolute top-24">
        <ButtonPrimary onClick={() => setOpenAddBranchModal(true)}>
          New Branch
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
        {branches.length > 0 ? (
          <DataGrid checkboxSelection rows={branches} columns={columns} />
        ) : (
          <div>No Branches to show</div>
        )}
      </Box>
      <AddBranchModal
        open={openAddBranchModal}
        setOpen={setOpenAddBranchModal}
        employee={employee}
        setBranches={setBranches}
      />
    </Box>
  );
};

export default Branches;
