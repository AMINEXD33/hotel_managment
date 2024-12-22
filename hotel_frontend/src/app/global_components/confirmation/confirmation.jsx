import {
    Button,
    Modal,
    Spinner
  } from "react-bootstrap";

import "./confirmation.css";
import { useState } from "react";



function action(callBack, args, setVisibleState, setSpinnerWileCallBack){
  let st = setSpinnerWileCallBack(true);
  callBack(...args);
  setVisibleState(false);
}

export default function Confirmation({
    confirmationTitle,
    confirmationBodyText,
    setVisibleState,
    onYesCallBack,
    onNoCallBack,
    args,
    yesButtonText,
    noButtonText
}){

    const [spinnerWhileCallBack, setSpinnerWileCallBack] = useState(false);
    return (
<div className="confirmationMask">
        <div
          className="modal show"
          style={{ display: "grid", position: "initial" }}
        >
          {
            !spinnerWhileCallBack &&          
            <Modal.Dialog className="dialogg">
            <Modal.Header>
              <Modal.Title>{confirmationTitle}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <p>{confirmationBodyText}</p>
            </Modal.Body>

            <Modal.Footer>
              <Button 
                onClick={()=>{action(onNoCallBack, args, setVisibleState, setSpinnerWileCallBack)}}
              variant="secondary">{noButtonText}</Button>
              <Button 
                onClick={()=>{action(onYesCallBack, args, setVisibleState, setSpinnerWileCallBack)}}
              variant="primary">{yesButtonText}</Button>
            </Modal.Footer>
            </Modal.Dialog>
          }
          {
          spinnerWhileCallBack &&
            <div className="spinnerWait">
              <p>processing...</p>
              <Spinner animation="border" variant="dark"/>
            </div>
          }
          
        </div>
      </div>
    )
}