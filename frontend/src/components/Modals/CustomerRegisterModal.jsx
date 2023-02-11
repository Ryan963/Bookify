import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import InputField from "../UI/InputField";
import ButtonSecondary from "../UI/ButtonSecondary";
import axios from "axios";
import { toast } from "react-toastify";
import PlacesAutocompleteInput from "../UI/PlacesAutoCompleteInput";
const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: "#2b2d2e",
    border: "2px solid white",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: "30%",
    height: "80%",
    minHeight: "550px",
    marginTop: "50px",
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

const RegisterModal = ({ open, setOpen, switchToLogin }) => {
  const classes = useStyles();
  const [userInfo, setUserInfo] = useState({
    firstname: "",
    lastname: "",
    number: "",
    email: "",
    password: "",
    address: "",
    longitude: "",
    latitude: "",
    postalCode: "",
  });
  const [disabled, setDisabled] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleRegister = async () => {
    setDisabled(true);
    for (let info in userInfo) {
      if (userInfo[info] === null || userInfo[info].length === 0) {
        toast.error("Please fill all required Fields");
        setDisabled(false);
        return;
      }
    }
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/customer/`,
        {
          customer: { ...userInfo },
        }
      );
      if (res.data.success) {
        // save in localstorage: make sure to save the user type as otherwise can't access protected routes
        localStorage.setItem("email", userInfo.email);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("type", "customer");

        toast.success("Login Successful");
        handleClose();
      } else {
        console.log(res.data.message);
        toast.error("User Unauthorized");
      }
      setDisabled(false);
    } catch (error) {
      console.log(error);
      setDisabled(false);
      toast.error("Server Error, Something went wrong!");
    }
  };
  console.log(userInfo);
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
            <span>Register</span>
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
            {/* here goes addess ad postal code */}
            <InputField
              name="password"
              placeholder="Password"
              type="password"
              value={userInfo.password}
              onChange={handleChange}
              className={classes.textField}
            />
            <PlacesAutocompleteInput
              address={userInfo.address}
              setAddress={(address) =>
                setUserInfo({ ...userInfo, address: address })
              }
              setInfo={setUserInfo}
            />
            <div className="mt-4">
              Have an account already?{" "}
              <span
                className="underline cursor-pointer text-lightblue"
                onClick={switchToLogin}
              >
                Login Here
              </span>
            </div>
            <div className="w-full flex justify-end mt-8">
              <ButtonSecondary disabled={disabled} onClick={handleRegister}>
                Register
              </ButtonSecondary>
            </div>
          </form>
        </div>
      </Fade>
    </Modal>
  );
};

export default RegisterModal;
