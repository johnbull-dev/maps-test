/**
 * Calculates the monthly mortgage payment.
 *
 * @param propertyPrice - The price of the property.
 * @param deposit - The deposit amount.
 * @param annualInterestRate - The annual interest rate.
 * @param mortgageTermInYears - The mortgage term in years.
 * @returns The monthly mortgage payment.
 */
export function calculateMonthlyPayment(
      propertyPrice: number,
      deposit: number,
      annualInterestRate: number,
      mortgageTermInYears: number
): number {
  const adjustedLoanAmount = propertyPrice - deposit;
  const monthlyInterestRate = annualInterestRate / 100 / 12;
  const numberOfPayments = mortgageTermInYears * 12;

  if (monthlyInterestRate === 0) {
    return adjustedLoanAmount / numberOfPayments;
  }

  const monthlyPayment =
    (adjustedLoanAmount *
      monthlyInterestRate *
      Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
    (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

  return monthlyPayment;
}

/**
 * Calculates the total repayment amount over the entire mortgage term.
 *
 * @param monthlyPayment - The monthly mortgage payment.
 * @param mortgageTermInYears - The mortgage term in years.
 * @returns The total repayment amount.
 */
export function calculateTotalRepayment(
  monthlyPayment: number,
  mortgageTermInYears: number
): number {
  return monthlyPayment * mortgageTermInYears * 12;
}

/**
 * Calculates the capital (loan amount).
 *
 * @param propertyPrice - The price of the property.
 * @param deposit - The deposit amount.
 * @returns The capital (loan amount).
 */
export function calculateCapital(
  propertyPrice: number,
  deposit: number
): number {
  return propertyPrice - deposit;
}

/**
 * Calculates the total interest paid over the mortgage term.
 *
 * @param totalRepayment - The total repayment amount.
 * @param capital - The capital (loan amount).
 * @returns The total interest paid.
 */
export function calculateInterest(
  totalRepayment: number,
  capital: number
): number {
  return totalRepayment - capital;
}

/**
 * Calculates the monthly payment for the affordability check (interest rate + 3%).
 *
 * @param propertyPrice - The price of the property.
 * @param deposit - The deposit amount.
 * @param annualInterestRate - The annual interest rate.
 * @param mortgageTermInYears - The mortgage term in years.
 * @returns The monthly payment for the affordability check.
 */
export function calculateAffordabilityCheck(
  propertyPrice: number,
  deposit: number,
  annualInterestRate: number,
  mortgageTermInYears: number
): number {
  return calculateMonthlyPayment(
    propertyPrice,
    deposit,
    annualInterestRate + 3,
    mortgageTermInYears
  );
}

/**
 * Calculates the remaining mortgage balance at the end of each year.
 *
 * @param propertyPrice - The price of the property.
 * @param deposit - The deposit amount.
 * @param annualInterestRate - The annual interest rate.
 * @param mortgageTermInYears - The mortgage term in years.
 * @returns An array of remaining balances for each year.
 */
export function calculateYearlyBreakdown(
  propertyPrice: number,
  deposit: number,
  annualInterestRate: number,
  mortgageTermInYears: number
): { year: number; remainingDebt: number }[] {
  const capital = calculateCapital(propertyPrice, deposit);
  const monthlyPayment = calculateMonthlyPayment(
    propertyPrice,
    deposit,
    annualInterestRate,
    mortgageTermInYears
  );
  const monthlyInterestRate = annualInterestRate / 100 / 12;
  
  const yearlyBreakdown: { year: number; remainingDebt: number }[] = [];
  let remainingBalance = capital;
  
  for (let year = 1; year <= mortgageTermInYears; year++) {
    // Calculate remaining balance after each year
    for (let month = 1; month <= 12; month++) {
      const interestPayment = remainingBalance * monthlyInterestRate;
      const principalPayment = monthlyPayment - interestPayment;
      remainingBalance -= principalPayment;
      
      // Ensure we don't go below zero due to rounding errors
      if (remainingBalance < 0) {
        remainingBalance = 0;
      }
    }
    
    yearlyBreakdown.push({
      year,
      remainingDebt: remainingBalance
    });
  }
  
  return yearlyBreakdown;
}

/**
 * Interface for mortgage calculation results
 */
export interface MortgageCalculationResults {
  monthlyPayment: number;
  totalRepayment: number;
  capital: number;
  interest: number;
  affordabilityCheck: number;
  yearlyBreakdown: { year: number; remainingDebt: number }[];
}

/**
 * Calculates all mortgage-related values.
 *
 * @param propertyPrice - The price of the property.
 * @param deposit - The deposit amount.
 * @param annualInterestRate - The annual interest rate.
 * @param mortgageTermInYears - The mortgage term in years.
 * @returns All mortgage calculation results.
 */
export function calculateMortgage(
  propertyPrice: number,
  deposit: number,
  annualInterestRate: number,
  mortgageTermInYears: number
): MortgageCalculationResults {
  const monthlyPayment = calculateMonthlyPayment(
    propertyPrice,
    deposit,
    annualInterestRate,
    mortgageTermInYears
  );
  
  const capital = calculateCapital(propertyPrice, deposit);
  const totalRepayment = calculateTotalRepayment(monthlyPayment, mortgageTermInYears);
  const interest = calculateInterest(totalRepayment, capital);
  const affordabilityCheck = calculateAffordabilityCheck(
    propertyPrice,
    deposit,
    annualInterestRate,
    mortgageTermInYears
  );
  const yearlyBreakdown = calculateYearlyBreakdown(
    propertyPrice,
    deposit,
    annualInterestRate,
    mortgageTermInYears
  );
  
  return {
    monthlyPayment,
    totalRepayment,
    capital,
    interest,
    affordabilityCheck,
    yearlyBreakdown
  };
}
