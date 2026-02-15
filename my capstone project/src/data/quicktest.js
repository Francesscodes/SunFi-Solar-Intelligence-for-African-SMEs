// QUICK START TEST - Copy this to test immediately
const { calculateSolarSizing, getMatchingVendors } = require('./solarLogic.js');

// Test with your own values
const MONTHLY_BILL = 225000;  // ₦225,000 (Chioma's bakery)
const LOCATION = "Lagos";     // Change to your location

console.log(' Testing Vendor Matching System...\n');

// Step 1: Calculate what system size is needed
const sizing = calculateSolarSizing(MONTHLY_BILL);
const requiredKw = sizing.systemSize.actualCapacityKW;

console.log(` For a ₦${MONTHLY_BILL.toLocaleString()} monthly bill:`);
console.log(`   → Recommended System: ${requiredKw} kW`);
console.log(`   → Total Cost: ₦${sizing.costs.total.toLocaleString()}`);
console.log(`   → Payback: ${sizing.financials.paybackPeriodYears} years\n`);

// Step 2: Find vendors who can install this system in your area
const vendors = getMatchingVendors(requiredKw, LOCATION);

console.log(` Found ${vendors.length} verified vendor(s) in ${LOCATION}:\n`);

if (vendors.length === 0) {
  console.log('    No vendors found. Try:');
  console.log('      - Change LOCATION to "Abuja" or "Kano"');
  console.log('      - Check vendors_enhanced.json exists');
} else {
  vendors.forEach((v, i) => {
    console.log(`${i + 1}. ${v.company_name}`);
    console.log(`   Rating: ${v.rating}/5 ⭐`);
    console.log(`   Can handle: ${v.system_capacity_range}`);
    console.log(`   Contact: ${v.phone}\n`);
  });
}

console.log(' Test complete!\n');