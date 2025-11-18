const pdfParse = require('pdf-parse');

console.log('Type of pdfParse:', typeof pdfParse);
console.log('Keys:', Object.keys(pdfParse));
console.log('Constructor:', pdfParse.constructor.name);
console.log('pdfParse:', pdfParse);

// Try to see if it has a default export
if (pdfParse.default) {
  console.log('Has default export:', typeof pdfParse.default);
}
