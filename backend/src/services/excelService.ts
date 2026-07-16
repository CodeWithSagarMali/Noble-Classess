import xlsx from 'xlsx';
import logger from '../utils/logger';

export interface AttendanceExcelRecord {
  rollNumber: string;
  date: Date;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  row: number;
}

export interface ExcelParseResult {
  records: AttendanceExcelRecord[];
  errors: string[];
}

/**
 * Parses attendance data from an Excel workbook buffer.
 * Expected columns: RollNumber, Date, Status
 */
export const parseAttendanceExcel = (buffer: Buffer): ExcelParseResult => {
  const records: AttendanceExcelRecord[] = [];
  const errors: string[] = [];

  try {
    const workbook = xlsx.read(buffer, { type: 'buffer', cellDates: true });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data: any[] = xlsx.utils.sheet_to_json(worksheet, { defval: null });

    if (data.length === 0) {
      errors.push('The uploaded Excel sheet is empty.');
      return { records, errors };
    }

    // Verify headers (case-insensitive checks)
    const firstRowKeys = Object.keys(data[0]);
    const rollKey = firstRowKeys.find((k) => k.toLowerCase() === 'rollnumber');
    const dateKey = firstRowKeys.find((k) => k.toLowerCase() === 'date');
    const statusKey = firstRowKeys.find((k) => k.toLowerCase() === 'status');

    if (!rollKey || !dateKey || !statusKey) {
      errors.push(
        `Invalid columns. Expected: "RollNumber", "Date", and "Status". Found keys: ${firstRowKeys.join(', ')}`
      );
      return { records, errors };
    }

    // Process each row
    data.forEach((rowVal, index) => {
      const rowNum = index + 2; // 1-indexed headers is row 1
      const rollNumberStr = rowVal[rollKey]?.toString().trim();
      const dateVal = rowVal[dateKey];
      const statusStr = rowVal[statusKey]?.toString().trim().toUpperCase();

      // Check Roll Number
      if (!rollNumberStr) {
        errors.push(`Row ${rowNum}: RollNumber is missing.`);
        return;
      }

      // Check Status
      if (!statusStr || !['PRESENT', 'ABSENT', 'LATE'].includes(statusStr)) {
        errors.push(`Row ${rowNum}: Status is invalid. Value must be PRESENT, ABSENT, or LATE.`);
        return;
      }

      // Parse Date
      let parsedDate: Date;
      if (dateVal instanceof Date) {
        parsedDate = dateVal;
      } else {
        const dateStr = dateVal?.toString().trim();
        parsedDate = new Date(dateStr);
      }

      if (isNaN(parsedDate.getTime())) {
        errors.push(`Row ${rowNum}: Date is invalid. Use YYYY-MM-DD format.`);
        return;
      }

      records.push({
        rollNumber: rollNumberStr,
        date: parsedDate,
        status: statusStr as 'PRESENT' | 'ABSENT' | 'LATE',
        row: rowNum,
      });
    });
  } catch (error: any) {
    logger.error('Error parsing Excel file', error);
    errors.push(`Failed to parse Excel file: ${error.message || 'Unknown error'}`);
  }

  return { records, errors };
};

/**
 * Helper to generate a dummy Excel template buffer for teachers to download.
 */
export const generateAttendanceTemplate = (): Buffer => {
  const headers = [['RollNumber', 'Date', 'Status']];
  const sampleData = [
    ['STU-001', '2026-07-13', 'PRESENT'],
    ['STU-002', '2026-07-13', 'ABSENT'],
    ['STU-003', '2026-07-13', 'LATE'],
  ];

  const worksheet = xlsx.utils.aoa_to_sheet([...headers, ...sampleData]);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, 'Attendance Template');

  return xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
};
