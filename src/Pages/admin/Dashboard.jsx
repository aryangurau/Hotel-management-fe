import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Row, Col, Table, Spinner, Badge } from "react-bootstrap";
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
    // Fetch all rooms without pagination to get accurate stats
    dispatch(listRooms({ page: 1, limit: 1000 }));
    dispatch(listUsers({ page: 1, limit: 5 }));
  }, [dispatch]);

  // Memoize derived data
  const roomStats = useMemo(() => {
    console.log('Calculating room stats from:', rooms);
    
    // Count rooms by status
    const stats = rooms.reduce((acc, room) => {
      // Convert status to lowercase and handle empty/null values
      const status = (room.status || 'unknown').toLowerCase();
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    
    console.log('Room status counts:', stats);
    
    // Map backend status values to display values
    const available = stats.available || stats.empty || stats.vacant || 0;
    const booked = stats.booked || stats.reserved || 0;
    const occupied = stats.occupied || stats.inuse || 0;
    const maintenance = stats.maintenance || stats.repair || 0;
    
    return {
      total: totalRooms || rooms.length,
      available,
      booked,
      occupied,
      maintenance
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
      
      {/* Room Statistics Cards */}
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
            <Card.Body className="text-danger">
              <h6 className="text-muted">Occupied Rooms</h6>
              <h3>{roomStats.occupied}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Detailed Room Statistics */}
      <Row className="g-4 mb-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <h5 className="mb-4">Room Statistics</h5>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Count</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <Badge bg="success">Available</Badge>
                    </td>
                    <td>{roomStats.available}</td>
                    <td>{((roomStats.available / roomStats.total) * 100).toFixed(1)}%</td>
                  </tr>
                  <tr>
                    <td>
                      <Badge bg="warning">Booked</Badge>
                    </td>
                    <td>{roomStats.booked}</td>
                    <td>{((roomStats.booked / roomStats.total) * 100).toFixed(1)}%</td>
                  </tr>
                  <tr>
                    <td>
                      <Badge bg="danger">Occupied</Badge>
                    </td>
                    <td>{roomStats.occupied}</td>
                    <td>{((roomStats.occupied / roomStats.total) * 100).toFixed(1)}%</td>
                  </tr>
                  {roomStats.maintenance > 0 && (
                    <tr>
                      <td>
                        <Badge bg="secondary">Maintenance</Badge>
                      </td>
                      <td>{roomStats.maintenance}</td>
                      <td>{((roomStats.maintenance / roomStats.total) * 100).toFixed(1)}%</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card>
            <Card.Body>
              <h5 className="mb-4">Recent Rooms</h5>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Room</th>
                    <th>Status</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.slice(0, 5).map((room) => (
                    <tr key={room._id}>
                      <td>{room.name}</td>
                      <td>
                        <Badge 
                          bg={
                            room.status?.toLowerCase() === 'available' || 
                            room.status?.toLowerCase() === 'empty' || 
                            room.status?.toLowerCase() === 'vacant' ? 'success' :
                            room.status?.toLowerCase() === 'booked' || 
                            room.status?.toLowerCase() === 'reserved' ? 'warning' :
                            room.status?.toLowerCase() === 'occupied' || 
                            room.status?.toLowerCase() === 'inuse' ? 'danger' :
                            'secondary'
                          }
                        >
                          {room.status || 'Unknown'}
                        </Badge>
                      </td>
                      <td>${room.price?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* User Statistics */}
      <Row className="g-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <h5 className="mb-4">Recent Users</h5>
              <Table responsive hover>
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
                        <Badge bg={user.isActive ? "success" : "danger"}>
                          {user.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card>
            <Card.Body>
              <h5 className="mb-4">User Statistics</h5>
              <div className="d-flex justify-content-around">
                <div className="text-center">
                  <h6 className="text-muted">Total Users</h6>
                  <h3>{userStats.total}</h3>
                </div>
                <div className="text-center">
                  <h6 className="text-muted">Active Users</h6>
                  <h3 className="text-success">{userStats.active}</h3>
                </div>
                <div className="text-center">
                  <h6 className="text-muted">Inactive Users</h6>
                  <h3 className="text-danger">{userStats.inactive}</h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;