#This code should be added in the google sheets appscripts in the extentions.

function doPost(e) {
  try {
    // Parse the incoming JSON payload
    var data = JSON.parse(e.postData.contents);

    // Open the active sheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Define the headers (from Column A)
    var headers = sheet.getRange(1, 1, sheet.getLastRow(), 1).getValues().flat();

    // List of rows to skip in each column because they contain formulas
    var formulaRows = [7, 8, 13, 14, 22, 23, 25, 26, 28, 31, 33, 34, 35];

    // Check if the date exists in the sheet
    var dateColumn = findDateColumn(sheet, headers, data.Date);

    if (dateColumn !== -1) {
      // Update data in the existing column
      headers.forEach(function (header, index) {
        var row = index + 1; // 1-based indexing
        if (!formulaRows.includes(row) && data.hasOwnProperty(header)) {
          sheet.getRange(row, dateColumn).setValue(data[header]);
        }
      });
    } else {
      // Add data to the next available column
      var nextColumn = findNextAvailableColumn(sheet, formulaRows);

      headers.forEach(function (header, index) {
        var row = index + 1; // 1-based indexing
        if (!formulaRows.includes(row) && data.hasOwnProperty(header)) {
          sheet.getRange(row, nextColumn).setValue(data[header]);
        }
      });
    }

    // Return a success response
    return ContentService.createTextOutput(
      JSON.stringify({ message: "Data processed successfully!" })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    // Return an error response
    return ContentService.createTextOutput(
      JSON.stringify({ error: error.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Finds the column for a given date if it exists.
 * 
 * @param {Sheet} sheet - The active Google Sheet
 * @param {Array} headers - List of headers in Column A
 * @param {String} date - The date to search for
 * @returns {Number} - The column index of the date, or -1 if not found
 */
function findDateColumn(sheet, headers, date) {
  var lastColumn = sheet.getLastColumn();
  var dateRow = headers.indexOf("Date") + 1; // Find the "Date" header's row

  if (dateRow > 0) {
    for (var col = 2; col <= lastColumn; col++) {
      var cellValue = sheet.getRange(dateRow, col).getValue();
      if (cellValue === date) {
        return col; // Return the column index where the date matches
      }
    }
  }
  return -1; // Date not found
}

/**
 * Finds the first column where dependent cells (ignoring formula rows) are empty.
 * 
 * @param {Sheet} sheet - The active Google Sheet
 * @param {Array} formulaRows - The rows to skip because they contain formulas
 * @returns {Number} - The next available column
 */
function findNextAvailableColumn(sheet, formulaRows) {
  var lastColumn = sheet.getLastColumn();
  var lastRow = sheet.getLastRow();

  // Check columns starting from the second column
  for (var col = 2; col <= lastColumn; col++) {
    var isAvailable = true;

    // Check non-formula rows for empty cells
    for (var row = 1; row <= lastRow; row++) {
      if (!formulaRows.includes(row)) {
        var cellValue = sheet.getRange(row, col).getValue();
        if (cellValue !== "") {
          isAvailable = false;
          break;
        }
      }
    }

    // If all non-formula cells are empty, return this column
    if (isAvailable) {
      return col;
    }
  }

  // If no available column is found, return the next new column
  return lastColumn + 1;
}
