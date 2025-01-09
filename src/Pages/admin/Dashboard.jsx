import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Row, Col, Table, Spinner } from "react-bootstrap";
import { listRooms } from "../../slices/roomSlice";
import { listUsers } from "../../slices/userSlice";
import { createSelector } from "@reduxjs/toolkit";

// Memoized selectors
const selectRoomState = createSelector(
  (state) => state.rooms || {},
  (rooms) => ({
    rooms: rooms.rooms || [],
    loading: rooms.loading || false,
    error: rooms.error || null,
    total: rooms.total || 0
  })
);

const selectUserState = createSelector(
  (state) => state.user || {},
  (user) => ({
    users: user.users || [],
    loading: user.loading || false,
    error: user.error || null
  })
);

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { rooms, loading: roomsLoading, error: roomError, total: totalRooms } = useSelector(selectRoomState);
  const { users, loading: usersLoading, error: userError } = useSelector(selectUserState);

  useEffect(() => {
    // Fetch all rooms to get accurate stats
    dispatch(listRooms({ page: 1, limit: 100 }));
    dispatch(listUsers({ page: 1, limit: 5 }));
  }, [dispatch]);

  // Memoize derived data
  const roomStats = useMemo(() => {
    const available = rooms.filter(room => room.status === 'empty').length;
    const booked = rooms.filter(room => room.status === 'booked').length;
    const occupied = rooms.filter(room => room.status === 'occupied').length;
    
    return {
      total: totalRooms || rooms.length,
      available,
      booked,
      occupied
    };
  }, [rooms, totalRooms]);

  const userStats = useMemo(() => ({
    total: users.length,
    active: users.filter(user => user.isActive).length,
    inactive: users.filter(user => !user.isActive).length
  }), [users]);

  if (roomsLoading || usersLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (roomError || userError) {
    return (
      <div className="alert alert-danger">
        {roomError || userError}
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="mb-4">Dashboard</h2>
      
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="h-100">
            <Card.Body>
              <h6 className="text-muted">Total Rooms</h6>
              <h3>{roomStats.total}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100">
            <Card.Body className="text-success">
              <h6 className="text-muted">Available Rooms</h6>
              <h3>{roomStats.available}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100">
            <Card.Body className="text-warning">
              <h6 className="text-muted">Booked Rooms</h6>
              <h3>{roomStats.booked}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100">
            <Card.Body className="text-info">
              <h6 className="text-muted">Occupied Rooms</h6>
              <h3>{roomStats.occupied}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Recent Rooms</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Price</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.slice(0, 5).map((room) => (
                    <tr key={room._id}>
                      <td>{room.name}</td>
                      <td>{room.type}</td>
                      <td>${room.price?.toLocaleString()}</td>
                      <td>
                        <span className={`badge bg-${
                          room.status === 'empty' 
                            ? 'success' 
                            : room.status === 'booked'
                            ? 'warning'
                            : 'info'
                        }`}>
                          {room.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {rooms.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center">No rooms found</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Recent Users</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.slice(0, 5).map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge bg-${user.isActive ? 'success' : 'danger'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan="3" className="text-center">No users found</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;