import React, { useEffect, useState } from "react";
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
    height: "fit-content",
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

const AddBranchModal = ({ open, setOpen, employee, setBranches }) => {
  const classes = useStyles();
  const [branchInfo, setBranchInfo] = useState({
    city: "",
    province: "",
    number: "",
    country: "",
    current: true,
    address: "",
    longitude: "",
    latitude: "",
    postalCode: "",
    companyId: null,
  });
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    setBranchInfo({ ...branchInfo, companyId: employee.companyId });
  }, [employee]);

  const handleChange = (e) => {
    setBranchInfo({ ...branchInfo, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleAddingBranch = async () => {
    setDisabled(true);
    for (let info in branchInfo) {
      if (
        branchInfo[info] === null ||
        (typeof branchInfo[info] == String && branchInfo[info].length === 0)
      ) {
        toast.error("Please fill all required Fields");
        setDisabled(false);
        return;
      }
    }
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/branch/`,
        {
          branch: { ...branchInfo },
        }
      );
      if (res.data.success) {
        console.log(res.data);
        // setBranches((prevBranches) => {
        //   return [...prevBranches, { ...branchInfo, id: res.data.id }];
        // });
        setOpen(false);

        toast.success("Branch Registered");
        handleClose();
      } else {
        console.log(res.data.message);
        toast.error("Please check the Branch Info");
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
            <span>Add a New Branch</span>
          </div>
          <form className={classes.form} noValidate>
            <PlacesAutocompleteInput
              address={branchInfo.address}
              setAddress={(address) =>
                setBranchInfo({ ...branchInfo, address: address })
              }
              setInfo={setBranchInfo}
            />
            <InputField
              name="country"
              placeholder="Country"
              type="text"
              value={branchInfo.country}
              onChange={handleChange}
              className={classes.textField}
            />
            <InputField
              name="province"
              placeholder="Province"
              type="text"
              value={branchInfo.province}
              onChange={handleChange}
              className={classes.textField}
            />
            <InputField
              name="city"
              placeholder="City"
              type="text"
              value={branchInfo.city}
              onChange={handleChange}
              className={classes.textField}
            />

            <InputField
              name="number"
              placeholder="Number"
              type="text"
              value={branchInfo.number}
              onChange={handleChange}
              className={classes.textField}
            />

            <div className="w-full flex justify-end mt-8">
              <ButtonSecondary disabled={disabled} onClick={handleAddingBranch}>
                Add Branch
              </ButtonSecondary>
            </div>
          </form>
        </div>
      </Fade>
    </Modal>
  );
};

export default AddBranchModal;
