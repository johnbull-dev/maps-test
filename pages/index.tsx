import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Table from "react-bootstrap/Table";

import { formatCurrency } from "../utils/formatCurrency";

export default function MortgageCalculator() {
  return (
    <Container>
      <title>Mortgage Calculator Test</title>
      <Row className="gap-x-10 pt-3">
        <Col className="border-r" md="auto">
          <Form>
            <Form.Label htmlFor="price">Property Price</Form.Label>
            <InputGroup className="mb-3">
              <InputGroup.Text>£</InputGroup.Text>
              <Form.Control
                id="price"
                name="price"
                type="number"
                className="no-spinner"
                step="any"
              />
            </InputGroup>
            <Form.Label htmlFor="deposit">Deposit</Form.Label>
            <InputGroup className="mb-3">
              <InputGroup.Text>£</InputGroup.Text>
              <Form.Control
                id="deposit"
                name="deposit"
                type="number"
                className="no-spinner"
                step="any"
              />
            </InputGroup>

            <Form.Label htmlFor="term">Mortgage Term</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                id="term"
                name="term"
                type="number"
                step="any"
                defaultValue={15}
              />
              <InputGroup.Text>years</InputGroup.Text>
            </InputGroup>
            <Form.Label htmlFor="interest">Interest rate</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                id="interest"
                name="interest"
                type="number"
                step="any"
                className="no-spinner"
                defaultValue={5.25}
              />
              <InputGroup.Text>%</InputGroup.Text>
            </InputGroup>
            <Button className="w-full" variant="primary" type="submit">
              Calculate
            </Button>
          </Form>
        </Col>
        <Col md="auto">
          <h2 className="pb-3">Results</h2>
          <Table striped="columns">
            <tbody>
              <tr className="border-b border-t">
                <td>Monthly Payment</td>
                <td className="text-right">{formatCurrency(763.68)}</td>
              </tr>
              <tr className="border-b">
                <td>Total Repayment</td>
                <td className="text-right">{formatCurrency(137463.09)}</td>
              </tr>
              <tr className="border-b">
                <td>Capital</td>
                <td className="text-right">{formatCurrency(95000)}</td>
              </tr>
              <tr className="border-b">
                <td>Interest</td>
                <td className="text-right">{formatCurrency(42463.09)}</td>
              </tr>
              <tr className="border-b">
                <td>Affordability check</td>
                <td className="text-right">{formatCurrency(921.63)}</td>
              </tr>
            </tbody>
          </Table>
        </Col>

        <Col md="auto">
          <h2 className="pb-3">Yearly Breakdown</h2>
          <Table className="max-w-52" bordered hover size="sm">
            <thead>
              <tr>
                <th>Year</th>
                <th>Remaining Debt</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>{formatCurrency(10000)}</td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}
