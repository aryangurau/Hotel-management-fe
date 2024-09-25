import { Col, Row } from "react-bootstrap";
import { useFetch } from "../hooks/useFetch";
import { URLS } from "../Constants";

import { CardPlaceholder } from "../Components/Placeholders";
import { Notify } from "../components/Notify";
import { Cards } from "../components/Card";

const Booking = () => {
  const { data, loading, error } = useFetch({ url: URLS.ROOMS + "/public" });
  if (loading) {
    return (
      <div className="container m-3">
        <Row className="g-2">
          <Col>
            <CardPlaceholder />
          </Col>
          <Col>
            <CardPlaceholder />
          </Col>
          <Col>
            <CardPlaceholder />
          </Col>
          <Col>
            <CardPlaceholder />
          </Col>
        </Row>
      </div>
    );
  }
  if (error) {
    return <Notify />;
  }
  return (
    <div>
      {data.length > 0 ? (
        data.map((room) => <Cards key={room?._id} data={room} />)
      ) : (
        <Notify msg="No data found" variant="warning" />
      )}
    </div>
  );
};

export default Booking;