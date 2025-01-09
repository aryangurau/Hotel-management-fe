import { useState, useEffect } from "react";
import { Card, Row, Col, Table } from "react-bootstrap";
import { getCurrentUser } from "../../Utils/session";
import { useSelector, useDispatch } from "react-redux";
import { getMyBookings } from "../../slices/bookingSlice";
import moment from "moment";

const UserProfile = () => {
  const dispatch = useDispatch();
  const { bookings } = useSelector((state) => state.booking);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setUserInfo(JSON.parse(user));
    }
    dispatch(getMyBookings());
  }, [dispatch]);

  return (
    <div className="container py-5">
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body className="text-center">
              <div className="mb-3">
                <i className="fas fa-user-circle fa-5x text-primary"></i>
              </div>
              <h5 className="mb-1">{userInfo?.name}</h5>
              <p className="text-muted mb-1">{userInfo?.email}</p>
              <p className="text-muted mb-4">
                Member since {moment(userInfo?.createdAt).format("MMMM YYYY")}
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Body>
              <h5 className="mb-4">Booking History</h5>
              {bookings && bookings.length > 0 ? (
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>Room</th>
                      <th>Check In</th>
                      <th>Check Out</th>
                      <th>Status</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking._id}>
                        <td>{booking.room?.name || "N/A"}</td>
                        <td>{moment(booking.checkIn).format("MMM DD, YYYY")}</td>
                        <td>{moment(booking.checkOut).format("MMM DD, YYYY")}</td>
                        <td>
                          <span
                            className={`badge ${
                              booking.status === "confirmed"
                                ? "bg-success"
                                : booking.status === "pending"
                                ? "bg-warning"
                                : "bg-danger"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td>${booking.totalAmount}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-center text-muted">No booking history found</p>
              )}
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <h5 className="mb-4">Account Details</h5>
              <Row className="mb-3">
                <Col sm={3}>
                  <p className="mb-0">Full Name</p>
                </Col>
                <Col sm={9}>
                  <p className="text-muted mb-0">{userInfo?.name}</p>
                </Col>
              </Row>
              <hr />
              <Row className="mb-3">
                <Col sm={3}>
                  <p className="mb-0">Email</p>
                </Col>
                <Col sm={9}>
                  <p className="text-muted mb-0">{userInfo?.email}</p>
                </Col>
              </Row>
              <hr />
              <Row className="mb-3">
                <Col sm={3}>
                  <p className="mb-0">Role</p>
                </Col>
                <Col sm={9}>
                  <p className="text-muted mb-0">
                    {userInfo?.roles?.map((role) => role.replace("ROLE_", "")).join(", ")}
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserProfile;
