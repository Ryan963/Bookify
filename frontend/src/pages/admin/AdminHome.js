import React, { useState, useEffect } from "react";
import { Grid, FormControlLabel, Switch } from "@mui/material";
import ButtonPrimary from "../../components/UI/ButtonPrimary";
import { toast } from "react-toastify";
import axios from "axios";
const AdminHome = () => {
  const [companies, setCompanies] = useState(
    []
  ); /* updates the array . state derives the whole application */
  const [notApprovedFilter, setNotApprovedFilter] = useState(true);

  useEffect(() => {
    getCompanies();
  }, []);
  const getCompanies = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/company/`);
      if (res.data.success) {
        setCompanies(res.data.companies);
      }
    } catch (error) {
      console.log(error);
      toast.error("Server Error");
    }
  };

  const handleFilterChange = () => {
    setNotApprovedFilter(!notApprovedFilter);
  };

  const approveCompany = async (id) => {
    try {
      const res = await axios.put("http://localhost:5000/api/admin/approve", {
        companyId: id,
      });
      if (res.data.success) {
        setCompanies((prevCompanies) => {
          const companiesCopy = prevCompanies.map((company) => {
            if (company.id === id) {
              company.approved = true;
            }
            return company;
          });
          return companiesCopy;
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Could not approve company");
    }
  };

  return (
    <div>
      <div
        className="flex mt-6 mb-12 underline decoration-skyblue
      text-2xl justify-center"
      >
        <h1>Admin HomePage</h1>
      </div>
      <div className="mx-12">
        <Grid
          container
          spacing={2}
          className="mt-8 pb-3 pt-1 mb-12  items-center rounded-3xl border bg-secondary text-grey content-center"
        >
          <Grid item xs={2}>
            <div>Company ID</div>
          </Grid>
          <Grid item xs={2}>
            <div>Name</div>
          </Grid>
          <Grid item xs={2}>
            <div>Number</div>
          </Grid>

          <Grid item xs={2}>
            <div>Email</div>
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={3}>
            <FormControlLabel
              control={
                <Switch
                  checked={notApprovedFilter}
                  onChange={handleFilterChange}
                />
              }
              label="Not Approved"
            />
          </Grid>
        </Grid>
        <div className="mt-6">
          {companies.length ? (
            <div>
              {companies
                .filter((company) => {
                  if (notApprovedFilter) {
                    return !company.approved;
                  } else {
                    return true;
                  }
                })
                .map((company, index) => {
                  return (
                    <Grid
                      key={index}
                      container
                      spacing={2}
                      className="mt-8 pb-3 pt-1 mb-6  items-center rounded-3xl  bg-secondary text-grey content-center"
                    >
                      <Grid item xs={2}>
                        <div>{company.id}</div>
                      </Grid>
                      <Grid item xs={2}>
                        <div>{company.name}</div>
                      </Grid>
                      <Grid item xs={2}>
                        <div>{company.number}</div>
                      </Grid>

                      <Grid item xs={2}>
                        <div>{company.email}</div>
                      </Grid>
                      <Grid item xs={1}></Grid>
                      <Grid item xs={3}>
                        <div className="mx-8">
                          <ButtonPrimary
                            onClick={() => approveCompany(company.id)}
                          >
                            Approve
                          </ButtonPrimary>
                        </div>
                      </Grid>
                    </Grid>
                  );
                })}
            </div>
          ) : (
            <div className="text-2xl flex justify-center">
              No Companies require approval at the moment
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
