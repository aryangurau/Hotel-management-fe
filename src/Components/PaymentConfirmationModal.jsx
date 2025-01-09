import { Modal, Button, Table } from 'react-bootstrap';
import PropTypes from 'prop-types';

const PaymentConfirmationModal = ({ 
  show, 
  onHide, 
  onConfirm, 
  bookingDetails,
  loading 
}) => {
  const { 
    hotel, 
    booking, 
    totalPrice, 
    paymentMethod,
    cardLastFour 
  } = bookingDetails;

  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header className="bg-primary text-white">
        <Modal.Title>Confirm Payment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h6 className="text-muted mb-3">Please review your booking details:</h6>
        <Table bordered hover>
          <tbody>
            <tr>
              <td><strong>Hotel</strong></td>
              <td>{hotel?.name}</td>
            </tr>
            <tr>
              <td><strong>Check-in</strong></td>
              <td>{booking?.checkIn ? new Date(booking.checkIn).toLocaleDateString() : ''}</td>
            </tr>
            <tr>
              <td><strong>Check-out</strong></td>
              <td>{booking?.checkOut ? new Date(booking.checkOut).toLocaleDateString() : ''}</td>
            </tr>
            <tr>
              <td><strong>Rooms</strong></td>
              <td>{booking?.rooms}</td>
            </tr>
            <tr>
              <td><strong>Guests</strong></td>
              <td>{booking?.guests}</td>
            </tr>
            <tr>
              <td><strong>Payment Method</strong></td>
              <td>
                {paymentMethod === 'credit_card' && 'Credit Card'}
                {paymentMethod === 'debit_card' && 'Debit Card'}
                {paymentMethod === 'esewa' && 'eSewa'}
                {paymentMethod === 'khalti' && 'Khalti'}
                {cardLastFour && ` (**** **** **** ${cardLastFour})`}
              </td>
            </tr>
            <tr className="table-primary">
              <td><strong>Total Amount</strong></td>
              <td><strong>NPR {totalPrice}</strong></td>
            </tr>
          </tbody>
        </Table>
        <div className="alert alert-info">
          <i className="bi bi-info-circle me-2"></i>
          By clicking "Confirm Payment", you agree to our booking terms and conditions.
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirm} disabled={loading}>
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Processing...
            </>
          ) : (
            'Confirm Payment'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

PaymentConfirmationModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  bookingDetails: PropTypes.shape({
    hotel: PropTypes.object.isRequired,
    booking: PropTypes.object.isRequired,
    totalPrice: PropTypes.number.isRequired,
    paymentMethod: PropTypes.string.isRequired,
    cardLastFour: PropTypes.string
  }).isRequired,
  loading: PropTypes.bool
};

export default PaymentConfirmationModal;
