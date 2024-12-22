import React, { useState } from "react";
import Image from "next/image";
import { Form } from "react-bootstrap";
import "./imagebank.css";
const PhotoUploader = ({ photoBank, setPhotoBank , forShowPhotos ,setForShowPhotos}) => {
  // migrate this state to be more global , so it can be used
  const handleFileChange = (event) => {
    const files = event.target.files;
    const newImageSrcs = [...photoBank]; 
    const forSHowSrcs = [...forShowPhotos]
    
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        forSHowSrcs.push(e.target.result); 
        setForShowPhotos([...forSHowSrcs]); 
      };
      reader.readAsDataURL(file);
      
      newImageSrcs.push(file);
      setPhotoBank([...newImageSrcs]); 
    });
  };

  return (
    <Form.Group controlId="formFile" className="mb-3">
      <Form.Label>Add new photos</Form.Label>
      <Form.Control type="file" onChange={handleFileChange} />
      <div className="photobankCOnt mb-2 mt-3">
        {forShowPhotos.map((src, index) => (
          <Image
            key={index}
            src={src}
            alt={`photo ${index}`}
            height={200}
            width={200}
            style={{borderRadius:"10px"}}
          />
        ))}
      </div>
    </Form.Group>
  );
};

export default PhotoUploader;
