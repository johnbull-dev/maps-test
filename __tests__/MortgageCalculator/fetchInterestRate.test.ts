import { fetchLatestInterestRate, formatDateForBOE } from "../../utils/MortgageCalculator/fetchInterestRate";

// Mock the global fetch function
global.fetch = jest.fn();

describe("For fetching the latest interest rate it ", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test("should return the latest interest rate when fetch is successful", async () => {
    // Mock a successful response
    const mockResponse = `
IUMABEDR
Date,Value
01/Jan/2024,5.25
15/Jan/2024,5.25
01/Feb/2024,5.00
    `;
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      text: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await fetchLatestInterestRate();
    
    // Should return the latest rate (5.00)
    expect(result).toBe(5.00);
    
    // Check that fetch was called with the correct URL pattern
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect((global.fetch as jest.Mock).mock.calls[0][0]).toContain("https://www.bankofengland.co.uk/boeapps/iadb/fromshowcolumns.asp");
    expect((global.fetch as jest.Mock).mock.calls[0][0]).toContain("SeriesCodes=IUMABEDR");
  });

  test("should return the default rate when fetch fails", async () => {
    // Mock a failed response
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    const result = await fetchLatestInterestRate();
    
    // Should return the default rate (5.25)
    expect(result).toBe(5.25);
  });

  test("should return the default rate when response is not ok", async () => {
    // Mock a non-ok response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: "Not Found",
    });

    const result = await fetchLatestInterestRate();
    
    // Should return the default rate (5.25)
    expect(result).toBe(5.25);
  });

  test("should return the default rate when CSV parsing fails", async () => {
    // Mock an invalid CSV response
    const mockResponse = "Invalid CSV data";
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      text: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await fetchLatestInterestRate();
    
    // Should return the default rate (5.25)
    expect(result).toBe(5.25);
  });
});

describe("For formatting the date for the Bank of England API it ", () => {
  test("should format the date correctly for the Bank of England API", () => {
    const date = new Date(2024, 0, 15); // January 15, 2024
    const result = formatDateForBOE(date);
    expect(result).toBe("15/Jan/2024");
  });

  test("should handle different months correctly", () => {
    const date = new Date(2024, 5, 20); // June 20, 2024
    const result = formatDateForBOE(date);
    expect(result).toBe("20/Jun/2024");
  });
}); 