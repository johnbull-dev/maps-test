import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MortgageCalculator, { getServerSideProps } from './index';
import { calculateMortgage } from '../utils/MortgageCalculator/calculateRepayment';
import { fetchLatestInterestRate } from '../utils/MortgageCalculator/fetchInterestRate';

// Mock the calculateMortgage function
jest.mock('../utils/MortgageCalculator/calculateRepayment', () => ({
  calculateMortgage: jest.fn(),
  calculateMonthlyPayment: jest.fn(),
}));

// Mock the fetchLatestInterestRate function
jest.mock('../utils/MortgageCalculator/fetchInterestRate', () => ({
  fetchLatestInterestRate: jest.fn(),
}));

describe('MortgageCalculator', () => {
  const mockInitialValues = {
    propertyPrice: "" as number | "",
    deposit: "" as number | "",
    mortgageTermInYears: "" as number | "",
    annualInterestRate: 5.25 as number | "",
  };

  const mockResults = {
    monthlyPayment: 763.68,
    totalRepayment: 137462.4,
    capital: 95000,
    interest: 42462.4,
    affordabilityCheck: 921.63,
    yearlyBreakdown: [
      { year: 1, remainingDebt: 90000 },
      { year: 2, remainingDebt: 85000 },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (calculateMortgage as jest.Mock).mockReturnValue(mockResults);
    (fetchLatestInterestRate as jest.Mock).mockResolvedValue(5.25);
  });

  test('renders the mortgage calculator form with empty fields and interest rate', () => {
    render(
      <MortgageCalculator
        initialValues={mockInitialValues}
        initialResults={null}
        latestInterestRate={5.25}
      />
    );

    // Check that all form fields are present in the document
    expect(screen.getByLabelText(/property price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/deposit/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mortgage term/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/interest rate/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /calculate/i })).toBeInTheDocument();
    
    // Check that form fields are empty except for interest rate
    expect(screen.getByLabelText(/property price/i)).toHaveValue(null);
    expect(screen.getByLabelText(/deposit/i)).toHaveValue(null);
    expect(screen.getByLabelText(/mortgage term/i)).toHaveValue(null);
    expect(screen.getByLabelText(/interest rate/i)).toHaveValue(5.25);
  });

  test('displays the results when provided', () => {
    render(<MortgageCalculator
        initialValues={mockInitialValues}
        initialResults={mockResults}
        latestInterestRate={5.25}
      />);

    expect(screen.getByText(/monthly payment/i).nextSibling).toHaveTextContent('£763.68');
    expect(screen.getByText(/total repayment/i).nextSibling).toHaveTextContent('£137,462.40');
    expect(screen.getByText(/capital/i).nextSibling).toHaveTextContent('£95,000.00');
    expect(screen.getByRole('cell', { name: /^interest$/i }).nextElementSibling).toHaveTextContent('£42,462.40');
    expect(screen.getByText(/affordability check/i).nextSibling).toHaveTextContent('£921.63');
  });

  test('displays the yearly breakdown when results are provided', () => {
    render(
      <MortgageCalculator
        initialValues={mockInitialValues}
        initialResults={mockResults}
        latestInterestRate={5.25}
      />
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('£90,000.00')).toBeInTheDocument();
    expect(screen.getByText('£85,000.00')).toBeInTheDocument();
  });

  test('calculates results when form is submitted', async () => {
    render(
      <MortgageCalculator
        initialValues={mockInitialValues}
        initialResults={null}
        latestInterestRate={5.25}
      />
    );

    fireEvent.change(screen.getByLabelText(/property price/i), { target: { value: '200000' } });
    fireEvent.change(screen.getByLabelText(/deposit/i), { target: { value: '40000' } });
    fireEvent.change(screen.getByLabelText(/mortgage term/i), { target: { value: '15' } });
    // Interest rate is already set
    fireEvent.click(screen.getByRole('button', { name: /calculate/i }));

    await waitFor(() => {
      expect(calculateMortgage).toHaveBeenCalledWith(200000, 40000, 5.25, 15);
    });
  });

  test('allows changing the interest rate', async () => {
    render(
      <MortgageCalculator
        initialValues={mockInitialValues}
        initialResults={null}
        latestInterestRate={5.25}
      />
    );

    fireEvent.change(screen.getByLabelText(/property price/i), { target: { value: '200000' } });
    fireEvent.change(screen.getByLabelText(/deposit/i), { target: { value: '40000' } });
    fireEvent.change(screen.getByLabelText(/mortgage term/i), { target: { value: '15' } });
    fireEvent.change(screen.getByLabelText(/interest rate/i), { target: { value: '4.5' } });
    fireEvent.click(screen.getByRole('button', { name: /calculate/i }));

    await waitFor(() => {
      expect(calculateMortgage).toHaveBeenCalledWith(200000, 40000, 4.5, 15);
    });
  });
});

describe('getServerSideProps', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetchLatestInterestRate as jest.Mock).mockResolvedValue(5.25);
  });

  test('returns empty form values with interest rate for GET requests', async () => {
    const context = {
      req: { method: 'GET' },
    };

    const result = await getServerSideProps(context as any);

    expect(result).toEqual({
      props: {
        initialValues: {
          propertyPrice: "",
          deposit: "",
          mortgageTermInYears: "",
          annualInterestRate: 5.25,
        },
        initialResults: null,
        latestInterestRate: 5.25,
      },
    });
  });
}); 