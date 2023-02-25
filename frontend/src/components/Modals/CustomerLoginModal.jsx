import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import InputField from "../UI/InputField";
import ButtonSecondary from "../UI/ButtonSecondary";
import axios from "axios";
import { toast } from "react-toastify";
const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: "#1F2A40",
    border: "2px solid white",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: "30%",
    height: "fit-content",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  button: {
    marginTop: 20,
  },
}));

const LoginModal = ({ open, setOpen, switchToRegister }) => {
  const classes = useStyles();
  const [userInfo, setUserInfo] = useState({ email: "", password: "" });
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
  const handleLogin = async () => {
    setDisabled(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/customer/login`,
        {
          email: userInfo.email,
          password: userInfo.password,
        }
      );
      if (res.data.success) {
        // save in localstorage: make sure to save the user type as otherwise can't access protected routes
        localStorage.setItem("email", res.data.customer.email);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("type", "user");
        setDisabled(false);
        toast.success("Login Successful");
        handleClose();
      } else {
        console.log(res.data.message);
        toast.error("User Unauthorized");
      }
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
            <span>Login</span>
          </div>
          <form className={classes.form} noValidate>
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
            <div className="mt-6">
              Don't Have an Account?{" "}
              <span
                className="underline cursor-pointer text-skyblue"
                onClick={switchToRegister}
              >
                Register Here
              </span>
            </div>
            <div className="w-full flex justify-end mt-16">
              <ButtonSecondary disabled={disabled} onClick={handleLogin}>
                Login
              </ButtonSecondary>
            </div>
          </form>
        </div>
      </Fade>
    </Modal>
  );
};

export default LoginModal;
