import { 
  calculateMonthlyPayment, 
  calculateTotalRepayment,
  calculateCapital, 
  calculateInterest,
  calculateAffordabilityCheck,
  calculateYearlyBreakdown,
  calculateMortgage
} from "../../utils/MortgageCalculator/calculateRepayment";

describe("For calculating the monthly payment it ", () => {
  test("should calculate the correct monthly payment with interest", () => {
    const actual = calculateMonthlyPayment(300000, 60000, 3.5, 30);
    expect(actual).toBeCloseTo(1077.71, 2);
  });

  test("should calculate the correct monthly payment without interest", () => {
    const actual = calculateMonthlyPayment(300000, 60000, 0, 30);
    expect(actual).toBeCloseTo(666.67, 2);
  });

  test("should calculate the correct monthly payment with a different term", () => {
    const actual = calculateMonthlyPayment(300000, 60000, 3.5, 15);
    expect(actual).toBeCloseTo(1715.72, 2);
  });
});

describe("For calculating the total repayment amount it ", () => {
  test("should calculate the correct total repayment amount", () => {
    const monthlyPayment = 763.68;
    const mortgageTermInYears = 15;
    const actual = calculateTotalRepayment(monthlyPayment, mortgageTermInYears);
    expect(actual).toBeCloseTo(137462.40, 2);
  });
});

describe("For calculating the capital amount it ", () => {
  test("should calculate the correct capital amount", () => {
    const propertyPrice = 100000;
    const deposit = 5000;
    const actual = calculateCapital(propertyPrice, deposit);
    expect(actual).toBe(95000);
  });
});

describe("For calculating the interest amount it ", () => {
  test("should calculate the correct interest amount", () => {
    const totalRepayment = 137462.40;
    const capital = 95000;
    const actual = calculateInterest(totalRepayment, capital);
    expect(actual).toBeCloseTo(42462.40, 2);
  });
});

describe("For calculating the affordability check it ", () => {
  test("should calculate the correct affordability check amount", () => {
    const propertyPrice = 100000;
    const deposit = 5000;
    const annualInterestRate = 5.25;
    const mortgageTermInYears = 15;
    const actual = calculateAffordabilityCheck(
      propertyPrice,
      deposit,
      annualInterestRate,
      mortgageTermInYears
    );
    
    const expectedMonthlyPayment = calculateMonthlyPayment(
      propertyPrice,
      deposit,
      annualInterestRate + 3,
      mortgageTermInYears
    );
    expect(actual).toBeCloseTo(expectedMonthlyPayment, 2);
  });
});

describe("For calculating the yearly breakdown it ", () => {
  test("should calculate the correct yearly breakdown", () => {
    const propertyPrice = 100000;
    const deposit = 5000;
    const annualInterestRate = 5.25;
    const mortgageTermInYears = 15;
    const actual = calculateYearlyBreakdown(
      propertyPrice,
      deposit,
      annualInterestRate,
      mortgageTermInYears
    );
    
    expect(actual.length).toBe(mortgageTermInYears);
    
    expect(actual[0].year).toBe(1);
    expect(actual[0].remainingDebt).toBeLessThan(95000);
    
    expect(actual[mortgageTermInYears - 1].year).toBe(mortgageTermInYears);
    expect(actual[mortgageTermInYears - 1].remainingDebt).toBeCloseTo(0, 0);
    
    for (let i = 1; i < actual.length; i++) {
      expect(actual[i].remainingDebt).toBeLessThan(actual[i - 1].remainingDebt);
    }
  });
});

describe("For calculating a mortgage it ", () => {
  test("should calculate all mortgage values correctly", () => {
    const propertyPrice = 100000;
    const deposit = 5000;
    const annualInterestRate = 5.25;
    const mortgageTermInYears = 15;
    
    const actual = calculateMortgage(
      propertyPrice,
      deposit,
      annualInterestRate,
      mortgageTermInYears
    );
    
    expect(actual.monthlyPayment).toBeCloseTo(763.68, 2);
    expect(actual.totalRepayment).toBeCloseTo(137463.09, 2);
    expect(actual.capital).toBe(95000);
    expect(actual.interest).toBeCloseTo(42463.09, 2);
    expect(actual.affordabilityCheck).toBeCloseTo(921.63, 2);
    expect(actual.yearlyBreakdown.length).toBe(mortgageTermInYears);
  });
});
