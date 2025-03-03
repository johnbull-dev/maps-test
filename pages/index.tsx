import { useState, useEffect, FormEvent } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import Head from "next/head";
import { GetServerSideProps } from "next";

import { formatCurrency } from "../utils/formatCurrency";
import { 
  calculateMortgage, 
  MortgageCalculationResults 
} from "../utils/MortgageCalculator/calculateRepayment";
import { fetchLatestInterestRate } from "../utils/MortgageCalculator/fetchInterestRate";

// Default values for the calculator -- assigned to placeholders in HTML
const DEFAULT_VALUES = {
  propertyPrice: 100000,
  deposit: 5000,
  mortgageTermInYears: 15,
  annualInterestRate: 5.25
};

interface FormInputs {
  propertyPrice: number | "";
  deposit: number | "";
  mortgageTermInYears: number | "";
  annualInterestRate: number | "";
}

interface MortgageCalculatorProps {
  initialValues: FormInputs;
  initialResults: MortgageCalculationResults | null;
  latestInterestRate: number | null;
}

export const getServerSideProps: GetServerSideProps<MortgageCalculatorProps> = async (context) => {
  // Get the latest interest rate from BoE
  let latestInterestRate: number | null = null;
  try {
    latestInterestRate = await fetchLatestInterestRate();
  } catch (error) {
    console.error("Failed to fetch latest interest rate:", error);
  }
  
  // Check if the form was submitted (POST request)
  if (context.req.method === "POST") {
    // If the form was submitted, parse the form data - look for parameters in the URL
    const formData = await new Promise<FormInputs>((resolve) => {
      let data = "";
      context.req.on("data", (chunk) => {
        data += chunk;
      });
      context.req.on("end", () => {
        const parsedData = new URLSearchParams(data);
        const propertyPrice = parsedData.get("price") ? Number(parsedData.get("price")) : "";
        const deposit = parsedData.get("deposit") ? Number(parsedData.get("deposit")) : "";
        const mortgageTermInYears = parsedData.get("term") ? Number(parsedData.get("term")) : "";
        const annualInterestRate = parsedData.get("interest") 
          ? Number(parsedData.get("interest")) 
          : (latestInterestRate !== null ? latestInterestRate : DEFAULT_VALUES.annualInterestRate);
        
        resolve({
          propertyPrice,
          deposit,
          mortgageTermInYears,
          annualInterestRate,
        });
      });
    });
    
    // Only calculate results if all required values are provided
    // Extra - put required error handling here
    let results = null;
    if (
      formData.propertyPrice !== "" && 
      formData.deposit !== "" && 
      formData.mortgageTermInYears !== "" && 
      formData.annualInterestRate !== ""
    ) {
      results = calculateMortgage(
        formData.propertyPrice as number,
        formData.deposit as number,
        formData.annualInterestRate as number,
        formData.mortgageTermInYears as number
      );
    }
    
    return {
      props: {
        initialValues: formData,
        initialResults: results,
        latestInterestRate,
      },
    };
  }
  
  // If not a POST request, return empty form values with the latest interest rate
  return {
    props: {
      initialValues: {
        propertyPrice: "",
        deposit: "",
        mortgageTermInYears: "",
        annualInterestRate: latestInterestRate !== null ? latestInterestRate : "",
      },
      initialResults: null,
      latestInterestRate,
    },
  };
};

export default function MortgageCalculator({ 
  initialValues, 
  initialResults,
  latestInterestRate 
}: MortgageCalculatorProps) {
  // Form input states
  const [propertyPrice, setPropertyPrice] = useState<number | "">(initialValues.propertyPrice);
  const [deposit, setDeposit] = useState<number | "">(initialValues.deposit);
  const [mortgageTermInYears, setMortgageTermInYears] = useState<number | "">(initialValues.mortgageTermInYears);
  const [annualInterestRate, setAnnualInterestRate] = useState<number | "">(initialValues.annualInterestRate);
  
  // Results state
  const [results, setResults] = useState<MortgageCalculationResults | null>(initialResults);
  
  // Loading state for fetching interest rate
  const [isLoadingInterestRate, setIsLoadingInterestRate] = useState<boolean>(false);
  
  // Flag to check if JavaScript is enabled
  const [isJsEnabled, setIsJsEnabled] = useState<boolean>(false);
  
  // Set JavaScript enabled flag on component mount
  useEffect(() => {
    setIsJsEnabled(true);
  }, []);
  
  // Fetch the latest interest rate on component mount if not already provided
  useEffect(() => {
    if (latestInterestRate !== null) {
      return;
    }
    
    const getLatestInterestRate = async () => {
      setIsLoadingInterestRate(true);
      try {
        const rate = await fetchLatestInterestRate();
        // Automatically set the interest rate in the form
        setAnnualInterestRate(rate);
      } catch (error) {
        console.error("Failed to fetch latest interest rate:", error);
        // Set default interest rate if fetching fails
        setAnnualInterestRate(DEFAULT_VALUES.annualInterestRate);
      } finally {
        setIsLoadingInterestRate(false);
      }
    };
    
    getLatestInterestRate();
  }, [latestInterestRate]);
  
  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    // Only prevent default if JavaScript is enabled
    if (isJsEnabled) {
      e.preventDefault();
      calculateResults();
    }
    // Otherwise, let the form submit normally for server-side processing
  };
  
  // Calculate mortgage results
  const calculateResults = () => {
    // Only calculate if all required values are provided
    if (
      propertyPrice !== "" && 
      deposit !== "" && 
      mortgageTermInYears !== "" && 
      annualInterestRate !== ""
    ) {
      const calculationResults = calculateMortgage(
        propertyPrice,
        deposit,
        annualInterestRate,
        mortgageTermInYears
      );
      
      setResults(calculationResults);
    }
  };
  
  return (
    <Container>
      <Head>
        <title>Mortgage Calculator Test</title>
      </Head>
      <Row className="gap-x-10 pt-3">
        <Col className="border-r" md="auto">
          <Form onSubmit={handleSubmit} method="POST" action="/">
            <Form.Label htmlFor="price">Property Price</Form.Label>
            <InputGroup className="mb-3">
              <InputGroup.Text>£</InputGroup.Text>
              <Form.Control
                id="price"
                name="price"
                type="number"
                className="no-spinner"
                step="any"
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(e.target.value ? Number(e.target.value) : "")}
                placeholder={DEFAULT_VALUES.propertyPrice.toString()}
                required
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
                value={deposit}
                onChange={(e) => setDeposit(e.target.value ? Number(e.target.value) : "")}
                placeholder={DEFAULT_VALUES.deposit.toString()}
                required
              />
            </InputGroup>

            <Form.Label htmlFor="term">Mortgage Term</Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                id="term"
                name="term"
                type="number"
                step="any"
                value={mortgageTermInYears}
                onChange={(e) => setMortgageTermInYears(e.target.value ? Number(e.target.value) : "")}
                placeholder={DEFAULT_VALUES.mortgageTermInYears.toString()}
                required
              />
              <InputGroup.Text>years</InputGroup.Text>
            </InputGroup>
            <Form.Label htmlFor="interest">
              Interest rate {isLoadingInterestRate && (
                <Spinner animation="border" size="sm" role="status" className="ms-2">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              )}
            </Form.Label>
            <InputGroup className="mb-3">
              <Form.Control
                id="interest"
                name="interest"
                type="number"
                step="any"
                className="no-spinner"
                value={annualInterestRate}
                onChange={(e) => setAnnualInterestRate(e.target.value ? Number(e.target.value) : "")}
                placeholder={DEFAULT_VALUES.annualInterestRate.toString()}
                disabled={isLoadingInterestRate}
                required
              />
              <InputGroup.Text>%</InputGroup.Text>
            </InputGroup>
            {isLoadingInterestRate && (
              <p className="text-sm text-muted mb-3">Loading latest interest rate from Bank of England...</p>
            )}
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
                <td className="text-right">
                  {results ? formatCurrency(results.monthlyPayment) : formatCurrency(0)}
                </td>
              </tr>
              <tr className="border-b">
                <td>Total Repayment</td>
                <td className="text-right">
                  {results ? formatCurrency(results.totalRepayment) : formatCurrency(0)}
                </td>
              </tr>
              <tr className="border-b">
                <td>Capital</td>
                <td className="text-right">
                  {results ? formatCurrency(results.capital) : formatCurrency(0)}
                </td>
              </tr>
              <tr className="border-b">
                <td>Interest</td>
                <td className="text-right">
                  {results ? formatCurrency(results.interest) : formatCurrency(0)}
                </td>
              </tr>
              <tr className="border-b">
                <td>Affordability check</td>
                <td className="text-right">
                  {results ? formatCurrency(results.affordabilityCheck) : formatCurrency(0)}
                </td>
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
              {results && results.yearlyBreakdown.map((yearData) => (
                <tr key={yearData.year}>
                  <td>{yearData.year}</td>
                  <td>{formatCurrency(yearData.remainingDebt)}</td>
                </tr>
              ))}
              {!results && (
                <tr>
                  <td>-</td>
                  <td>{formatCurrency(0)}</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}
