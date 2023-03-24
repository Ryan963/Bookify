import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import InputField from "../UI/InputField";
import ButtonSecondary from "../UI/ButtonSecondary";
import axios from "axios";
import { toast } from "react-toastify";
import useServices from "../../hooks/useServices";
import { InputLabel, MenuItem, Select } from "@material-ui/core";
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
    width: "30%",
    minWidth: "500px",
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

const AddCompanyServiceModal = ({
  open,
  setOpen,
  employee,
  companyServices,
}) => {
  const classes = useStyles();

  const [services, setServices] = useServices();
  const [addNew, setAddNew] = useState(false);
  const [serviceInfo, setServiceInfo] = useState({
    name: "",
    description: "",
  });
  const [companyServiceInfo, setCompanyServiceInfo] = useState({
    serviceId: null,
    hourslength: "",
    minuteslength: "",
    price: null,
    companyId: null,
  });
  const [disabled, setDisabled] = useState(false);
  const currentServicesIds = companyServices.map((service) => service.id);

  useEffect(() => {
    setCompanyServiceInfo({
      ...companyServiceInfo,
      companyId: employee.companyId,
    });
  }, [employee]);

  const handleChange = (e) => {
    setCompanyServiceInfo({
      ...companyServiceInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleAddingCompanyService = async (e) => {
    e.preventDefault();

    console.log(companyServiceInfo);
    setDisabled(true);
    console.log(companyServiceInfo);
    for (let info in companyServiceInfo) {
      if (
        companyServiceInfo[info] === null ||
        (typeof companyServiceInfo[info] == String &&
          companyServiceInfo[info].length === 0)
      ) {
        toast.error("Please fill all required Fields");
        setDisabled(false);
        return;
      }
    }
    const hoursLength =
      companyServiceInfo.hourslength.length === 1
        ? "0" + companyServiceInfo.hourslength
        : companyServiceInfo.hourslength;
    const minuteslength =
      companyServiceInfo.minuteslength.length === 1
        ? "0" + companyServiceInfo.minuteslength
        : companyServiceInfo.minuteslength;
    const length = `${hoursLength}:${minuteslength}`;

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/companyService/`,
        {
          companyId: companyServiceInfo.companyId,
          serviceId: companyServiceInfo.serviceId,
          length: length,
          price: companyServiceInfo.price,
        }
      );
      if (res.data.success) {
        console.log(res.data);
        setOpen(false);

        toast.success("The new Service has been added successfully!");
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

  const handleServiceInfoChange = (e) => {
    setServiceInfo({ ...serviceInfo, [e.target.name]: e.target.value });
  };

  const handleAddingService = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/service`,
        {
          service: serviceInfo,
        }
      );
      if (res.data.success) {
        setServices([...services, { id: res.data.insertId, serviceInfo }]);
        setAddNew(false);
      }
    } catch (error) {
      toast.error("Could not add a new Service");
      console.log(error);
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
          <div className="flex justify-center items-center font-bold text-2xl mb-8 ">
            <span>Add a New Service</span>
          </div>
          <form className={classes.form} noValidate>
            {addNew ? (
              <div>
                <InputField
                  name="name"
                  placeholder="Name"
                  type="text"
                  value={serviceInfo.name}
                  onChange={handleServiceInfoChange}
                />
                <textarea
                  className="w-full mt-6 border-skyblue border text-black"
                  name="description"
                  placeholder="Description"
                  value={serviceInfo.description}
                  onChange={handleServiceInfoChange}
                />
                <div className="w-full flex justify-end mt-8">
                  <ButtonSecondary onClick={handleAddingService}>
                    Add Service
                  </ButtonSecondary>
                </div>
              </div>
            ) : (
              <>
                <label id="employee-select-label" className="text-white  ">
                  Select a Service
                </label>
                <Select
                  style={{
                    width: "100%",
                  }}
                  labelId="service-select-label"
                  value={companyServiceInfo.serviceId}
                  onChange={(e) =>
                    setCompanyServiceInfo({
                      ...companyServiceInfo,
                      serviceId: Number(e.target.value),
                    })
                  }
                >
                  {services
                    .filter(
                      (service) => !currentServicesIds.includes(service.id)
                    )
                    .map((service) => (
                      <MenuItem key={service.id} value={service.id}>
                        {service.name}
                      </MenuItem>
                    ))}
                </Select>

                <InputField
                  name="price"
                  placeholder="Price"
                  type="number"
                  value={companyServiceInfo.price}
                  onChange={handleChange}
                />
                <InputField
                  name="hourslength"
                  placeholder="Hours Length"
                  type="number"
                  value={companyServiceInfo.hourslength}
                  onChange={handleChange}
                />
                <InputField
                  name="minuteslength"
                  placeholder="Minutes Length"
                  type="number"
                  value={companyServiceInfo.minuteslength}
                  onChange={handleChange}
                />
                <div className="mt-4">
                  Your Service Doesn't exist here?{" "}
                  <span
                    onClick={() => setAddNew(true)}
                    className="underline cursor-pointer text-skyblue"
                  >
                    add new!
                  </span>
                </div>

                <div className="w-full flex justify-end mt-8">
                  <ButtonSecondary
                    disabled={disabled}
                    onClick={handleAddingCompanyService}
                  >
                    Add Service
                  </ButtonSecondary>
                </div>
              </>
            )}
          </form>
        </div>
      </Fade>
    </Modal>
  );
};

export default AddCompanyServiceModal;
