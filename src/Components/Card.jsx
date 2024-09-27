import { Button, Card, Col, Form, Row } from "react-bootstrap";

import { useDispatch } from "react-redux";
import { addToCart } from "../slices/cartSlice";

export const Cards = ({ data }) => {
  const dispatch = useDispatch();
  return (
    <Card>
      <Row className="g-0">
        <Col md={4}></Col>
        <Col md={8}>
          <Card.Body>
            <Card.Title>{data?.name}</Card.Title>
            <Card.Text>
              <small className="text-muted">More Info</small>
            </Card.Text>
            <Row className="mb-2">
              <Col>
                <Form.Select aria-label="Default select example">
                  <option value="0">Room(s)</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                </Form.Select>
              </Col>
              <Col>
                <Button
                  variant="danger"
                  onClick={() => {
                    dispatch(addToCart(data));
                  }}
                >
                  Add to Cart
                </Button>
                <Button variant="primary">Book</Button>
              </Col>
            </Row>
            <Card.Text>
              <small className="text-muted">NPR {data?.price}</small>
            </Card.Text>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};