import { Cancel, Send } from "@mui/icons-material";
import { Box, Button, Container, Stack, Step, StepButton, Stepper } from "@mui/material";
import React, { useEffect, useState } from "react";
import AddLocation from "./add/addLocation/AddLocation";
import AddDetails from "./add/addDetails/AddDetails";
import AddImages from "./add/addImages/AddImages";
import { useValue } from "@/context/ContextProvider";
import {
  clearProjectErrors,
  createNewProject,
  getProjects,
  resetProjectState,
} from "@/redux/actions/projectsActions";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { clearProject, updateRoom } from "@/context/function";
import { useRouter } from "next/router";

const AddRoom = ({ setPage }) => {
  const Router = useRouter();
  const dispatchRedux = useDispatch();
  const { loading, error, isCreated } = useSelector((s) => s.project);
  const {
    state: {
      images,
      details,
      location,
      currentUser,

      updatedRoom,
      deletedImages,
      addedImages,
    },
    dispatch,
  } = useValue();

  const [activeStep, setActiveStep] = useState(0);
  const [steps, setSteps] = useState([
    { label: "Location", completed: false },
    { label: "Details", completed: false },
    { label: "Images", completed: false },
  ]);
  const [showSubmit, setShowSubmit] = useState(false);
  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((activeStep) => activeStep + 1);
    } else {
      const stepIndex = findUnfinished();
      setActiveStep(stepIndex);
    }
  };
  const checkDisabled = () => {
    if (activeStep < steps.length - 1) return false;
    const index = findUnfinished();
    if (index !== -1) return false;
    return true;
  };
  const findUnfinished = () => {
    return steps.findIndex((step) => !step.completed);
  };

  useEffect(() => {
    if (images?.length) {
      if (!steps[2].completed) setComplete(2, true);
    } else {
      if (steps[2].completed) setComplete(2, false);
    }
  }, [images]);
  useEffect(() => {
    if (details?.title?.length > 4 && details?.description?.length > 9) {
      if (!steps[1].completed) setComplete(1, true);
    } else {
      if (steps[1].completed) setComplete(1, false);
    }
  }, [details]);
  useEffect(() => {
    if (location?.lng || location?.lat) {
      if (!steps[0].completed) setComplete(0, true);
    } else {
      if (steps[0].completed) setComplete(0, false);
    }
  }, [location]);
  const setComplete = (index, status) => {
    setSteps((steps) => {
      steps[index].completed = status;
      return [...steps];
    });
  };
  useEffect(() => {
    if (findUnfinished() === -1) {
      if (!showSubmit) setShowSubmit(true);
    } else {
      if (showSubmit) setShowSubmit(false);
    }
  }, [steps]);
  const handleSubmit = () => {
    const room = {
      lng: location.lng,
      lat: location.lat,
      address: location.address,
      price: details.price,
      title: details.title,
      description: details.description,
      images,
      keyFeatures: details.keyFeatures,
      keyProjectNotes: details.keyProjectNotes,
      // homeFeatures: details.underHomeFeatures,
      bed: details.bed,
      bath: details.bath,
      so_ft: details.soft,
      acress: details.acress,
      targetCompletationDate: details.targetCompletation,
      cost: details.cost,
      budget: details.budget,
      propertyListingPrice: details.propertyListingPrice,
      constructionEstimate: details.constructionEstimate,

      homeType: details.homeType,
      builder: details.builder,
      status: details.status,
      zip: details.zip,
      project_size: details.project_size,

      city: details.city,
      state: details.state,

      site_contract: details.site_contract,
      site_phone: details.site_phone,
      customer_contract: details.customer_contract,
      customer_phone: details.customer_phone,
      order_trigger: details.order_trigger,
      order_trigger_stage: details.order_trigger_stage,
      drawings: details.drawings,
      takeOfCompleted: details.takeOfCompleted,
      bucket: details.bucket,
      Count_of_Products_by_project: details.Count_of_Products_by_project,
      Order_Tracker: details.Order_Tracker,
      related_to_order: details.related_to_order,
      b_vs_a: details.b_vs_a,
      spent_to_date: details.spent_to_date,
      actualCoDate: details.actualCoDate,
      spend: details.spend,
      homeType: details.homeType,
      builder: details.builder,
      status: details.status,
      //project stack holder
      generalContractor: details.generalContractor,
      constractionManager: details.constractionManager,
      projectManager: details.projectManager,
      client: details.client,
      documents: details.documents,
    };

    if (updatedRoom) {
      const handleUpdate = async () => {
        if (updatedRoom) {
          try {
            const { data } = await updateRoom(
              room,
              currentUser,
              dispatch,
              updatedRoom,
              deletedImages
            );

            if (data?.success) {
              toast.success("The Project has been updated successfully");
              Router.push(`/house/single/${data?.result?._id}`);
            }
          } catch (error) {
            console.error("Error updating project:", error);
          }
        }
      };

      handleUpdate();

      return;
    }

    dispatchRedux(createNewProject(room));
  };
  //cancel update

  const handleCancel = () => {
    if (updatedRoom) {
      Router.push("/projects");
      clearProject(dispatch, currentUser, addedImages, updatedRoom);
    } else {
      //  dispatch({ type: "UPDATE_SECTION", payload: 0 });
      clearProject(dispatch, currentUser, images);
    }
  };

  useEffect(() => {
    if (isCreated) {
      toast.success("Project added successfully.");
      dispatchRedux(resetProjectState());
      dispatchRedux(getProjects());
      dispatch({ type: "RESET_ROOM" });
      setPage(0);
    }
    if (error) {
      toast.error(error);
      dispatchRedux(clearProjectErrors());
    }
  }, [dispatchRedux, error, isCreated]);

  return (
    <Container sx={{ my: 4 }}>
      <Stepper alternativeLabel nonLinear activeStep={activeStep} sx={{ mb: 3 }}>
        {steps.map((step, index) => (
          <Step key={step.label} completed={step.completed}>
            <StepButton onClick={() => setActiveStep(index)}>{step.label}</StepButton>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ pb: 7 }}>
        {
          {
            0: <AddLocation />,
            1: <AddDetails />,
            2: <AddImages />,
          }[activeStep]
        }

        <Stack direction="row" sx={{ pt: 2, justifyContent: "space-around" }}>
          <Button
            color="inherit"
            disabled={!activeStep}
            onClick={() => setActiveStep((activeStep) => activeStep - 1)}
          >
            Back
          </Button>
          <Button disabled={checkDisabled()} onClick={handleNext}>
            Next
          </Button>
        </Stack>

        <Stack
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          <Button
            disabled={!showSubmit}
            variant="contained"
            endIcon={<Send />}
            onClick={handleSubmit}
          >
            {updatedRoom ? "Update" : "Submit"}
          </Button>
          <Button
            style={{ margin: "10px 0px" }}
            variant="outlined"
            endIcon={<Cancel />}
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default AddRoom;
