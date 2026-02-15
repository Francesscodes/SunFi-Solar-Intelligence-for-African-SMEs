const { calculateSolarSizing, formatNaira } = require('./solarLogic.js');

const myMonthlyBill = 225000;

console.log('Testing with my monthly bill:', formatNaira(myMonthlyBill));
console.log('\n');

const result = calculateSolarSizing(myMonthlyBill);

console.log('System Size:', result.systemSize.actualCapacityKW, 'kW');
console.log('Total Cost:', formatNaira(result.costs.total));
console.log('Monthly Savings:', formatNaira(result.financials.monthlySavings));
console.log('Payback:', result.financials.paybackPeriodYears, 'years');