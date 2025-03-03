/**
 * Fetches the latest interest rate from the Bank of England.
 * 
 * @returns A promise that resolves to the latest interest rate from the Bank of England.
 */
export async function fetchLatestInterestRate(): Promise<number> {
  // Default interest rate if the API call fails
  const defaultInterestRate = 5.25;


  try {
    // Format dates for the API request
    const today = new Date();
    const oneMonthAgo = new Date();

    oneMonthAgo.setMonth(today.getMonth() - 1);

    const formatDate = (date: Date): string => {
      const day = date.getDate();
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    };

    const fromDate = formatDate(oneMonthAgo);
    const toDate = formatDate(today);

    // URL for the Bank of England API with the formatted dates
    const url = `https://www.bankofengland.co.uk/boeapps/iadb/fromshowcolumns.asp?csv.x=yes&Datefrom=${fromDate}&Dateto=${toDate}&SeriesCodes=IUMABEDR&CSVF=TN&UsingCodes=Y&VPD=Y&VFD=N`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch interest rate from BoE: ${response.statusText}`);
    }

    const csvText = await response.text();

    // Parse the CSV to extract the latest interest rate
    // The CSV format might vary, so we need to handle different formats
    const lines = csvText.split('\n').filter(line => line.trim() !== '');

    // Set the fallback rate to 5.25% - this is the default rate if the API call fails
    let latestRate = defaultInterestRate;

    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i];
      const columns = line.split(',');

      // This is to check if this line contains a valid rate. The first column is the date, the second is the rate.
      if (columns.length >= 2) {
        const rateString = columns[1].trim();
        const rate = parseFloat(rateString);

        if (!isNaN(rate)) {
          latestRate = rate;
          break;
        }
      }
    }

    return latestRate;

  }
  catch (error) {
    console.error('Error fetching interest rate from BoE:', error);
    // Return a default rate if fetching fails
    return defaultInterestRate;
  }
}

/**
 * Formats a date for the Bank of England API.
 * 
 * @param date - The date to format.
 * @returns The formatted date string.
 */
export function formatDateForBOE(date: Date): string {
  const day = date.getDate();
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
} 