import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Filter from '../checkinoutFilter/filter';
import PaymentIcon from '@mui/icons-material/Payment';

import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import RadioGroup, { useRadioGroup } from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import PaypalPayment from '../paypalPayment/paypalPayment';

const StyledFormControlLabel = styled((props) => <FormControlLabel {...props} />)(
  ({ theme }) => ({
    variants: [
      {
        props: { checked: true },
        style: {
          '.MuiFormControlLabel-label': {
            color: theme.palette.primary.main,
          },
        },
      },
    ],
  }),
);

function MyFormControlLabel(props) {
  const radioGroup = useRadioGroup();

  let checked = false;

  if (radioGroup) {
    checked = radioGroup.value === props.value;
  }

  return <StyledFormControlLabel checked={checked} {...props} />;
}

MyFormControlLabel.propTypes = {
  /**
   * The value of the component.
   */
  value: PropTypes.any,
};











///////////////////// STEPPER 
const steps = [
    
    'Select your stay with us!', 
    'Select the prefered payment method ', 
    'finalize'];

export default function StepperCustom({id_room}) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const isStepOptional = (step) => {
    return false;
  };
  const isStepSkipped = (step) => {
    return skipped.has(step);
  };
  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };
  const handleReset = () => {
    setActiveStep(0);
  };


  // my vars 
  const [checkIn, setCheckin] = React.useState();
  const [checkOut, setCheckOut] = React.useState();
  const [paymentMethod, setPaymentMethod] = React.useState();

  React.useEffect(()=>{
        console.log(checkIn);
        console.log(checkOut);
        console.log(paymentMethod);
  }, [checkIn, checkOut, paymentMethod]);
  return (
    <Box sx={{ width: '100%', color:"black" }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
          {
            activeStep === 0 && <Filter 
            without={"city"}
            checkIn ={checkIn}
            setCheckin = {setCheckin}
            checkOut={checkOut}
            setCheckOut={setCheckOut}
            id_room={id_room}
            />
          }
          {
            activeStep === 1 && 
            <RadioGroup name="use-radio-group" defaultValue="first">
            <MyFormControlLabel value="paypal" label="Paypal" control={<Radio onChange={(e, value)=>{setPaymentMethod("paypal")}} />} />
            <MyFormControlLabel value="other" label="Other" control={<Radio onChange={(e, value)=>{setPaymentMethod("other")}}/>} />
          </RadioGroup>
          }
          {
            activeStep === 2 && paymentMethod === "paypal" &&
            <PaypalPayment
            roomid={id_room}
            checkIndate={checkIn} 
            checkOutdate={checkOut}
            total={123}
            />
          }
          {
            activeStep === 2 && paymentMethod === "other" &&
            <h1>Not available yet !</h1>
          }
          
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            {
                (activeStep === 0 || activeStep === 1) &&
                <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
                >
                Back
                </Button>
            }
                        {
                (activeStep === 2) &&
                <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={()=>{location.reload()}}
                sx={{ mr: 1 }}
                >
                cancel
                </Button>
            }
            <Box sx={{ flex: '1 1 auto' }} />
            {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Skip
              </Button>
            )}
            {
                activeStep === 0 && (checkIn && checkOut)
                &&
                <Button onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            }
            {
                activeStep === 1 && (paymentMethod)
                &&
                <Button onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            }
            
          </Box>
        </React.Fragment>
      )}
      
    </Box>
  );
}