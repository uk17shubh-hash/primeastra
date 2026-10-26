/**
 * Convert numbers to Indian Rupees in words (Lakhs, Crores) and International.
 */

const ones = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'
];

const tens = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

function convertBelowThousand(n: number): string {
  let str = '';
  if (n >= 100) {
    str += ones[Math.floor(n / 100)] + ' Hundred ';
    n %= 100;
  }
  if (n >= 20) {
    str += tens[Math.floor(n / 10)] + ' ';
    n %= 10;
  }
  if (n > 0) {
    str += ones[n] + ' ';
  }
  return str.trim();
}

export function numberToWordsIndian(amount: number, currencyPrefix = 'INR'): string {
  if (isNaN(amount) || amount === 0) return `${currencyPrefix} Zero Only`;

  const integerPart = Math.floor(Math.abs(amount));
  const decimalPart = Math.round((Math.abs(amount) - integerPart) * 100);

  let num = integerPart;
  const parts: string[] = [];

  // Crores
  if (num >= 10000000) {
    const cr = Math.floor(num / 10000000);
    parts.push(numberToWordsIndian(cr, '').replace('Only', '').trim() + ' Crore');
    num %= 10000000;
  }

  // Lakhs
  if (num >= 100000) {
    const lk = Math.floor(num / 100000);
    parts.push(convertBelowThousand(lk) + ' Lakh');
    num %= 100000;
  }

  // Thousands
  if (num >= 1000) {
    const th = Math.floor(num / 1000);
    parts.push(convertBelowThousand(th) + ' Thousand');
    num %= 1000;
  }

  // Remaining 0-999
  if (num > 0) {
    parts.push(convertBelowThousand(num));
  }

  let words = parts.join(' ').replace(/\s+/g, ' ').trim();
  if (!words) words = 'Zero';

  let result = `${currencyPrefix ? currencyPrefix + ' ' : ''}${words}`;

  if (decimalPart > 0) {
    const decimalWords = convertBelowThousand(decimalPart);
    result += ` and ${decimalWords} Paise`;
  }

  return `${result} Only`;
}
