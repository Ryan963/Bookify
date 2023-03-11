import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import InputField from "../UI/InputField";
import ButtonSecondary from "../UI/ButtonSecondary";
import axios from "axios";
import { toast } from "react-toastify";
import useCompanyServices from "../../hooks/useCompanyServices";
import ServicesSelection from "../UI/ServiceSelection";
const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: "#282c34",
    borderRadius: "5px",
    border: "2px solid white",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: "38%",
    height: "fit-content",
    marginTop: "50px",
    maxHeight: "750px",
    overflowY: "auto",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "6px",
  },
  button: {
    marginTop: 20,
  },
}));

const AddEmployeeModal = ({ open, setOpen, branches, employee }) => {
  const classes = useStyles();
  const [userInfo, setUserInfo] = useState({
    firstname: "",
    lastname: "",
    number: "",
    email: "",
    password: "",
    companyId: null,
    branchId: null,
    role: 3,
    current: true,
  });
  const [employeeServices, setEmployeeServices] = useState([]);
  const [companyServices, setCompanyServices] = useCompanyServices(
    employee.companyId,
    [employee]
  );
  const [disabled, setDisabled] = useState(false);
  console.log(userInfo);
  useEffect(() => {
    setUserInfo({
      ...userInfo,
      companyId: employee.companyId,
    });
  }, [employee]);

  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisabled(true);
    console.log(userInfo);
    for (let info in userInfo) {
      if (
        userInfo[info] === null ||
        (typeof userInfo[info] == String && userInfo[info].length === 0)
      ) {
        toast.error("Please fill all required Fields");
        setDisabled(false);
        return;
      }
    }
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/employee/create`,
        {
          employee: { ...userInfo },
          services: employeeServices,
        }
      );
      if (res.data.success) {
        console.log(res.data);
        setOpen(false);

        toast.success("Employee Added Successfully");
        handleClose();
      } else {
        console.log(res.data.message);
        toast.error("Please check the Employee Info");
      }
      setDisabled(false);
    } catch (error) {
      console.log(error);
      setDisabled(false);
      toast.error("Server Error, Something went wrong!");
    }
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div className={classes.paper}>
          <div className="flex justify-center items-center font-bold text-2xl">
            <span>Add a new Employee</span>
          </div>
          <form className={classes.form} noValidate>
            <InputField
              name="firstname"
              placeholder="First Name"
              type="text"
              value={userInfo.firstname}
              onChange={handleChange}
              className={classes.textField}
            />
            <InputField
              name="lastname"
              placeholder="Last name"
              type="text"
              value={userInfo.lastname}
              onChange={handleChange}
              className={classes.textField}
            />
            <InputField
              name="number"
              placeholder="Number"
              type="text"
              value={userInfo.number}
              onChange={handleChange}
              className={classes.textField}
            />
            <InputField
              name="email"
              placeholder="Email"
              type="email"
              value={userInfo.email}
              onChange={handleChange}
              className={classes.textField}
            />

            <InputField
              name="password"
              placeholder="Password"
              type="password"
              value={userInfo.password}
              onChange={handleChange}
              className={classes.textField}
            />
            <select
              className="w-full mt-8 rounded-lg h-12 text-black hover:border-sky-500 focus:border-skyblue"
              name="role"
              id="role"
              placeholder="Role"
              onSelect={handleChange}
              onChange={handleChange}
              value={userInfo.role}
            >
              <option value={3}>Employee</option>
              <option value={1}>Manager</option>
            </select>
            <select
              className="w-full mt-8 rounded-lg h-12 text-black hover:border-sky-500 focus:border-skyblue"
              name="branchId"
              id="branchId"
              placeholder="Branch"
              onSelect={(e) =>
                setUserInfo({ ...userInfo, branchId: Number(e.target.value) })
              }
              onChange={(e) =>
                setUserInfo({ ...userInfo, branchId: Number(e.target.value) })
              }
              value={userInfo.branchId}
            >
              {branches.map((branch) => (
                <option value={branch.id} key={branch.id}>
                  {branch.address}
                </option>
              ))}
            </select>
            <label className="mt-4">
              Services that this employee can perform
            </label>
            <ServicesSelection
              selectedServices={employeeServices}
              services={companyServices}
              setSelectedServices={setEmployeeServices}
            />
            <div className="w-full flex justify-end mt-8">
              <ButtonSecondary disabled={disabled} onClick={handleSubmit}>
                Add Employee
              </ButtonSecondary>
            </div>
          </form>
        </div>
      </Fade>
    </Modal>
  );
};

export default AddEmployeeModal;
