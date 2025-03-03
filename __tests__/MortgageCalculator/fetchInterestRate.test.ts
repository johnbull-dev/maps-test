import { fetchLatestInterestRate, formatDateForBOE } from "../../utils/MortgageCalculator/fetchInterestRate";

global.fetch = jest.fn();

describe("For fetching the latest interest rate it ", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return the latest interest rate when fetch is successful", async () => {
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
    
    expect(result).toBe(5.00);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect((global.fetch as jest.Mock).mock.calls[0][0]).toContain("https://www.bankofengland.co.uk/boeapps/iadb/fromshowcolumns.asp");
    expect((global.fetch as jest.Mock).mock.calls[0][0]).toContain("SeriesCodes=IUMABEDR");
  });

  test("should return the default rate when fetch fails", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    const result = await fetchLatestInterestRate();
    
    expect(result).toBe(5.25);
  });

  test("should return the default rate when response is not ok", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: "Not Found",
    });

    const result = await fetchLatestInterestRate();
    
    expect(result).toBe(5.25);
  });

  test("should return the default rate when CSV parsing fails", async () => {
    const mockResponse = "Invalid CSV data";
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      text: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await fetchLatestInterestRate();
    
    expect(result).toBe(5.25);
  });
});

describe("For formatting the date for the Bank of England API it ", () => {
  test("should format the date correctly for the Bank of England API", () => {
    const date = new Date(2024, 0, 15); 
    const result = formatDateForBOE(date);
    expect(result).toBe("15/Jan/2024");
  });

  test("should handle different months correctly", () => {
    const date = new Date(2024, 6, 22); 
    const result = formatDateForBOE(date);
    expect(result).toBe("22/Jul/2024");
  });
}); 