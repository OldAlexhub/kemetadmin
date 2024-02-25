import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Spinner,
  Form,
  Table,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const SearchFlights = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const parseXMLToJson = (xmlString) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    const json = {}; // Initialize empty object to hold converted JSON
    const responseFields = xmlDoc.getElementsByTagName("FLSResponseFields")[0];
    json["FLSResponseFields"] = {
      FLSOriginCode: responseFields.getAttribute("FLSOriginCode"),
      FLSOriginName: responseFields.getAttribute("FLSOriginName"),
      FLSDestinationCode: responseFields.getAttribute("FLSDestinationCode"),
      FLSDestinationName: responseFields.getAttribute("FLSDestinationName"),
      // Add more fields as needed
    };
    // Parsing FlightDetails
    const flightDetails = xmlDoc.getElementsByTagName("FlightDetails")[0];
    json["FlightDetails"] = {
      TotalFlightTime: flightDetails.getAttribute("TotalFlightTime"),
      TotalMiles: flightDetails.getAttribute("TotalMiles"),
      TotalTripTime: flightDetails.getAttribute("TotalTripTime"),
      FLSDepartureDateTime: flightDetails.getAttribute("FLSDepartureDateTime"),
      FLSArrivalDateTime: flightDetails.getAttribute("FLSArrivalDateTime"),

      // Add more fields as needed
    };

    // Parsing FlightLegDetails - assuming there could be multiple legs
    const flightLegs = xmlDoc.getElementsByTagName("FlightLegDetails");
    json["FlightLegDetails"] = Array.from(flightLegs).map((leg) => ({
      DepartureDateTime: leg.getAttribute("DepartureDateTime"),
      ArrivalDateTime: leg.getAttribute("ArrivalDateTime"),
      FlightNumber: leg.getAttribute("FlightNumber"),
      JourneyDuration: leg.getAttribute("JourneyDuration"),
      // Add more attributes as needed
    }));

    // Continue parsing other elements as necessary...

    return json;
  };
  const fetchData = async () => {
    const formattedDate = date.replace(/-/g, "");
    const url = `https://timetable-lookup.p.rapidapi.com/TimeTable/${from}/${to}/${formattedDate}/?7Day=Y&Date=${date}&From=${from}&To=${to}`;
    const options = {
      headers: {
        "X-RapidAPI-Key": "ddf5c34c66msh014b38b8f761b43p1d5a50jsn2df72894bca3",
        "X-RapidAPI-Host": "timetable-lookup.p.rapidapi.com",
      },
    };

    try {
      setLoading(true);
      const response = await axios.get(url, options);
      const xmlData = response.data; // Assuming the API returns XML data directly
      const jsonData = parseXMLToJson(xmlData);
      setResult(jsonData); // Parsing XML to JSON if necessary should happen here
      setError("");
    } catch (error) {
      console.error(error);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  // Function to render flight details
  const renderFlightDetails = (flightData) => {
    // Assuming flightData is properly formatted as JSON
    // Adjust the keys based on the actual structure of your JSON
    const { FLSResponseFields, FlightDetails } = flightData;

    return (
      <>
        <h5>Summary</h5>
        <Table striped bordered hover size="sm">
          <tbody>
            <tr>
              <td>From</td>
              <td>
                {FLSResponseFields?.FLSOriginName} (
                {FLSResponseFields?.FLSOriginCode})
              </td>
            </tr>
            <tr>
              <td>To</td>
              <td>
                {FLSResponseFields?.FLSDestinationName} (
                {FLSResponseFields?.FLSDestinationCode})
              </td>
            </tr>
            <tr>
              <td>Departure</td>
              <td>
                {new Date(
                  FlightDetails?.FLSDepartureDateTime
                ).toLocaleDateString()}{" "}
                -{" "}
                {new Date(
                  FlightDetails?.FLSDepartureDateTime
                ).toLocaleTimeString()}
              </td>
            </tr>
            <tr>
              <td>Arrival</td>
              <td>
                {new Date(
                  FlightDetails?.FLSArrivalDateTime
                ).toLocaleDateString()}{" "}
                -{" "}
                {new Date(
                  FlightDetails?.FLSArrivalDateTime
                ).toLocaleTimeString()}
              </td>
            </tr>
            <tr>
              <td>Total Flight Time</td>
              <td>{FlightDetails?.TotalFlightTime}</td>
            </tr>
            {/* Additional details can be added here */}
          </tbody>
        </Table>
        {/* Similarly, render FlightLegDetails if available */}
      </>
    );
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Form>
            <Form.Group controlId="formFrom">
              <Form.Label>From</Form.Label>
              <Form.Control
                type="text"
                placeholder="From"
                value={from}
                onChange={(e) => setFrom(e.target.value.toUpperCase())}
              />
            </Form.Group>

            <Form.Group controlId="formTo">
              <Form.Label>To</Form.Label>
              <Form.Control
                type="text"
                placeholder="To"
                value={to}
                onChange={(e) => setTo(e.target.value.toUpperCase())}
              />
            </Form.Group>

            <Form.Group controlId="formDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Form.Group>

            <Button onClick={fetchData} disabled={loading} variant="primary">
              {loading ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                "Search"
              )}
            </Button>
          </Form>

          {error && <Alert variant="danger">{error}</Alert>}
          {result && (
            <Card className="mt-3">
              <Card.Body>
                <Card.Title>Flight Details</Card.Title>
                <div>{renderFlightDetails(result)}</div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default SearchFlights;
