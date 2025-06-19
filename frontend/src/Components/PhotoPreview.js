// KycImagePreview.js
import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const PhotoPreview = ({ item }) => {
  const [show, setShow] = useState(false);

  const handleOpen = () => setShow(true);
  const handleClose = () => setShow(false);

  return (
    <>
      <td className="text-center">
        <img
          src={item}
          alt="KYC"
          className="rounded shadow-sm"
          width="50"
          height="50"
          style={{ objectFit: 'cover', cursor: 'pointer' }}
          onClick={handleOpen}
        />
      </td>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img
            src={item}
            alt="Full KYC"
            className="img-fluid rounded shadow"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PhotoPreview;
