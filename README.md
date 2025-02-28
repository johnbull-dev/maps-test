This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

To run tests:

```bash
npm run test
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

# React Test - Mortgage Calculator App

## Overview

Your task is to develop a simple mortgage calculator application using React and Next.js. This app will calculate and display the monthly mortgage payments, total payments over the full term, and total interest payments based on user inputs. While **UI design is not the primary focus**, functionality, code quality, and your approach are crucial. This application will mirror our live [mortgage calculator](https://tools.moneyhelper.org.uk/en/mortgage-calculator/) tool.

### Example Calculation

Property Price: £100,000  
Deposit: £5,000  
Mortgage Term: 15 years  
Interest rate: 5.25%

| Monthly Payment     | £763.68     |
| ------------------- | ----------- |
| Total Repayment     | £137,463.09 |
| Capital             | £95,000.00  |
| Interest            | £42,463.09  |
| Affordability check | £921.63     |

#### Screenshot example

![Example](example.png?raw=true "Example")

## Terms and Definitions

- **Monthly Payment**: The amount due each month to repay the mortgage, including both principal and interest.

- **Total Repayment**: The cumulative amount paid over the term of the mortgage, encompassing the loan amount and interest.

- **Capital**: The original sum borrowed. This excludes any interest and deposit.

- **Interest**: The cost of borrowing money, calculated as a percentage of the principal loan amount and accumulated over the term of the mortgage.

- **Affordability Check**: A calculation that adjusts the interest rate by an additional 3% to assess the borrower's capability to afford the mortgage under potential future interest rate increases.
- **Yearly breakdown:**  The remaining mortgage balance at the end of each year for a given mortgage term

## Formulas

#### Total Repayment

```
T = M * n
```

Where:

- T is the total repayment amount
- M is the monthly mortgage payment
- n is the total number of payments (mortgage term in years \* 12)

#### **Capital**

```
C = P - D
```

Where:

- C is the capital (loan amount)
- P is the property price
- D is the deposit

#### **Whole term interest**

```
I = T - C
```

Where:

- I is the total interest paid
- T is the total repayment amount
- C is the capital (loan amount)

## Requirements

1. **Functionality**:

   - Integrate the following features into the `pages/index.tsx` file, which contains a basic calculator UI built using the React Bootstrap library:
     - Implement the core feature to calculate monthly mortgage payments.
       - To get started, refer to the existing monthly payment function and its tests in `utils/MortgageCalculator/calculateRepayment.ts`.
     - Display the following information:
       - Total repayment amount over the entire mortgage term.
       - Total interest paid over the mortgage term.
       - Total capital paid over the mortgage term.
       - Yearly breakdown of payments throughout the mortgage term.
       - Monthly repayments if the interest rate were to increase by 3% (for affordability check).
2. **Fetch Dynamic Interest Rate Data**

      **Task:**
      Implement functionality to dynamically fetch the latest interest rate from the Bank of England's website.

      **Requirements:**
      - Ensure the fetched data is always up-to-date, corresponding to the current date.
      - Pass the date as query parameters in the URL to request the latest available data.

      - Data Source: `https://www.bankofengland.co.uk/boeapps/iadb/fromshowcolumns.asp?csv.x=yes&Datefrom=18/Jan/2024&Dateto=18/Feb/2024&SeriesCodes=IUMABEDR&CSVF=TN&UsingCodes=Y&VPD=Y&VFD=N`

2. **TypeScript**: Utilise TypeScript to its full potential for type safety and improved code quality.

3. **Unit Tests**: Develop comprehensive unit tests for both your components and logic.

4. **Code Quality**: Ensure your code is clean, well-commented (where necessary), and adheres to the DRY principle. Organise your code for maintainability and readability.

**Please note, no additional UI work is required beyond the provided basic UI**

## Bonus Challenges (OPTIONAL)

### 1. Optimising for Accessibility: No-JS Functionality

Implement a solution that allows the mortgage calculator to function even when JavaScript is disabled in the user's browser. This will ensure that the website remains accessible and usable for all users.

**We look forward to your solutions and wish you the best of luck!**
