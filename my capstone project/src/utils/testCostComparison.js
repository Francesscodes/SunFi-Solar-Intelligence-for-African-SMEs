const { generateCostComparison, formatNaira } = require('./solarLogic.js');

console.log('========================================');
console.log('   COST COMPARISON TEST');
console.log('========================================\n');

// Test with Chioma's bakery example
const monthlyBill = 225000;
const systemSizeKw = 3.0; // This will be auto-calculated from monthlyBill

console.log(`Testing for Monthly Bill: ${formatNaira(monthlyBill)}\n`);

const comparisonData = generateCostComparison(monthlyBill, systemSizeKw);

console.log('10-YEAR COST COMPARISON:\n');
console.log('Year | Solar Cumulative | Diesel Cumulative | Savings');
console.log('-----|------------------|-------------------|----------');

comparisonData.forEach(data => {
  const savings = data.dieselCumulative - data.solarCumulative;
  console.log(
    `  ${data.year}  | ${formatNaira(data.solarCumulative).padEnd(16)} | ${formatNaira(data.dieselCumulative).padEnd(17)} | ${formatNaira(savings)}`
  );
});

const finalYear = comparisonData[comparisonData.length - 1];
const totalSavings = finalYear.dieselCumulative - finalYear.solarCumulative;

console.log('\n' + '='.repeat(70));
console.log(`\nTOTAL 10-YEAR SAVINGS: ${formatNaira(totalSavings)}`);
console.log(`\nBreakeven Point: ${comparisonData.findIndex(d => d.solarCumulative < d.dieselCumulative) + 1} years\n`);