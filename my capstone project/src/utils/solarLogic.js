function calculateSolarSizing(monthlyBill) {
  const TARIFF_PER_KWH = 120;
  const PEAK_SUN_HOURS = 5;
  const PANEL_WATTAGE = 400;
  const STANDARD_INVERTER_SIZES = [2.5, 5, 10, 20, 30, 50];
  const SYSTEM_VOLTAGE = 48;
  const BACKUP_HOURS = 12;
  const DEPTH_OF_DISCHARGE = 0.8;
  const BATTERY_EFFICIENCY = 0.9;
  const STANDARD_BATTERY_AH = 200;
  const COST_PER_PANEL = 150000;
  const COST_PER_KVA_INVERTER = 500000;
  const COST_PER_BATTERY = 300000;
  const INSTALLATION_COST_PERCENTAGE = 0.20;

  const monthlyConsumption = monthlyBill / TARIFF_PER_KWH;
  const dailyConsumptionKWh = monthlyConsumption / 30;
  
  const systemCapacityKW = dailyConsumptionKWh / PEAK_SUN_HOURS;
  
  const systemCapacityWatts = systemCapacityKW * 1000;
  const numberOfPanels = Math.ceil(systemCapacityWatts / PANEL_WATTAGE);
  const actualSystemCapacityKW = (numberOfPanels * PANEL_WATTAGE) / 1000;
  
  const requiredInverterCapacity = systemCapacityKW * 1.25;
  const inverterSizeKVA = STANDARD_INVERTER_SIZES.find(
    size => size >= requiredInverterCapacity
  ) || STANDARD_INVERTER_SIZES[STANDARD_INVERTER_SIZES.length - 1];
  
  const energyStorageNeeded = dailyConsumptionKWh * 1000 * (BACKUP_HOURS / 24);
  const batteryCapacityAh = Math.ceil(
    energyStorageNeeded / SYSTEM_VOLTAGE / DEPTH_OF_DISCHARGE / BATTERY_EFFICIENCY
  );
  const numberOfBatteries = Math.ceil(batteryCapacityAh / STANDARD_BATTERY_AH);
  
  const panelsCost = numberOfPanels * COST_PER_PANEL;
  const inverterCost = inverterSizeKVA * COST_PER_KVA_INVERTER;
  const batteriesCost = numberOfBatteries * COST_PER_BATTERY;
  const equipmentCost = panelsCost + inverterCost + batteriesCost;
  const installationCost = equipmentCost * INSTALLATION_COST_PERCENTAGE;
  const totalSystemCost = equipmentCost + installationCost;
  
  const monthlySavings = monthlyBill * 0.9;
  const paybackPeriodMonths = Math.ceil(totalSystemCost / monthlySavings);
  const systemLifespanYears = 25;
  const lifetimeSavings = (monthlySavings * 12 * systemLifespanYears) - totalSystemCost;
  const roi = ((lifetimeSavings / totalSystemCost) * 100).toFixed(1);
  
  const explanation = `Based on your monthly electricity bill of ₦${monthlyBill.toLocaleString()}, your business consumes approximately ${dailyConsumptionKWh.toFixed(1)} kWh per day. To meet this demand reliably using solar energy in Nigeria's climate (5 peak sun hours), you need a ${actualSystemCapacityKW.toFixed(1)}kW solar system. This will be powered by ${numberOfPanels} solar panels (400W each), a ${inverterSizeKVA}kVA inverter, and ${numberOfBatteries} batteries providing ${BACKUP_HOURS} hours of backup power. This system will reduce your electricity costs by approximately 90%, saving you ₦${monthlySavings.toLocaleString()} per month. The system will pay for itself in ${paybackPeriodMonths} months (${(paybackPeriodMonths / 12).toFixed(1)} years).`;
  
  return {
    input: {
      monthlyBill,
      tariffPerKWh: TARIFF_PER_KWH
    },
    consumption: {
      monthlyKWh: parseFloat(monthlyConsumption.toFixed(2)),
      dailyKWh: parseFloat(dailyConsumptionKWh.toFixed(2))
    },
    systemSize: {
      recommendedCapacityKW: parseFloat(systemCapacityKW.toFixed(2)),
      actualCapacityKW: parseFloat(actualSystemCapacityKW.toFixed(2))
    },
    components: {
      panels: {
        quantity: numberOfPanels,
        wattagePerPanel: PANEL_WATTAGE,
        totalCapacityKW: actualSystemCapacityKW
      },
      inverter: {
        sizeKVA: inverterSizeKVA,
        type: '48V Hybrid Inverter'
      },
      batteries: {
        quantity: numberOfBatteries,
        capacityPerBattery: STANDARD_BATTERY_AH,
        totalCapacityAh: batteryCapacityAh,
        backupHours: BACKUP_HOURS,
        systemVoltage: SYSTEM_VOLTAGE
      }
    },
    costs: {
      panels: panelsCost,
      inverter: inverterCost,
      batteries: batteriesCost,
      equipment: equipmentCost,
      installation: installationCost,
      total: totalSystemCost
    },
    financials: {
      monthlySavings,
      paybackPeriodMonths,
      paybackPeriodYears: parseFloat((paybackPeriodMonths / 12).toFixed(1)),
      lifetimeSavings,
      roi: parseFloat(roi)
    },
    explanation: explanation.trim()
  };
}

function validateInput(monthlyBill) {
  // Critical validation: Check for null, undefined, or non-numeric values
  if (monthlyBill === null || monthlyBill === undefined || typeof monthlyBill !== 'number') {
    return {
      isValid: false,
      type: 'error',
      message: 'Monthly bill must be a valid number'
    };
  }
  
  // Critical validation: Check for zero or negative values
  if (monthlyBill <= 0) {
    return {
      isValid: false,
      type: 'error',
      message: 'Monthly bill must be greater than zero'
    };
  }
  
  // Range validation: Very low usage (< ₦15,000)
  if (monthlyBill < 15000) {
    return {
      isValid: true,
      type: 'warning',
      message: 'This usage is quite low; solar might take longer to pay for itself. Consider if solar is right for your business at this consumption level.'
    };
  }
  
  // Range validation: Industrial scale (> ₦10,000,000)
  if (monthlyBill > 10000000) {
    return {
      isValid: false,
      type: 'error',
      message: 'For industrial loads this large, please contact our engineering team for a custom audit. Standard calculations may not be accurate for your needs.'
    };
  }
  
  // Range validation: High usage warning (₦5,000,000 - ₦10,000,000)
  if (monthlyBill > 5000000) {
    return {
      isValid: true,
      type: 'warning',
      message: 'This is a very high energy consumption. We recommend consulting with our engineering team for optimal system design.'
    };
  }
  
  // All validations passed
  return {
    isValid: true,
    type: 'success',
    message: 'Monthly bill is within normal SME range'
  };
}

function formatNaira(amount) {
  return `₦${amount.toLocaleString('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })}`;
}

function generateCostComparison(monthlyBill, systemSizeKw) {
  // Diesel/Generator Constants
  const INITIAL_GENERATOR_COST = 800000;
  const FUEL_PRICE_PER_LITER = 1200;
  const FUEL_CONSUMPTION_LITERS_PER_HOUR = 1;
  const DAILY_GENERATOR_HOURS = 8;
  const FUEL_INFLATION_RATE = 0.10; // 10% per year
  
  // Solar Constants
  const ANNUAL_MAINTENANCE_COST = 50000;
  
  // Calculate initial solar investment using the existing logic
  const solarSizing = calculateSolarSizing(monthlyBill);
  const INITIAL_SOLAR_COST = solarSizing.costs.total;
  
  // Calculate monthly diesel fuel cost (year 1)
  const monthlyFuelLiters = FUEL_CONSUMPTION_LITERS_PER_HOUR * DAILY_GENERATOR_HOURS * 30;
  const initialMonthlyFuelCost = monthlyFuelLiters * FUEL_PRICE_PER_LITER;
  
  // Generate 10-year comparison data
  const comparisonData = [];
  let solarCumulative = INITIAL_SOLAR_COST;
  let dieselCumulative = INITIAL_GENERATOR_COST;
  
  for (let year = 1; year <= 10; year++) {
    // Calculate diesel costs for this year with inflation
    const yearFuelInflationMultiplier = Math.pow(1 + FUEL_INFLATION_RATE, year - 1);
    const yearlyFuelCost = initialMonthlyFuelCost * 12 * yearFuelInflationMultiplier;
    dieselCumulative += yearlyFuelCost;
    
    // Calculate solar costs for this year (only maintenance after initial investment)
    if (year > 1) {
      solarCumulative += ANNUAL_MAINTENANCE_COST;
    }
    
    comparisonData.push({
      year: year,
      solarCumulative: Math.round(solarCumulative),
      dieselCumulative: Math.round(dieselCumulative)
    });
  }
  
  return comparisonData;
}

function getMatchingVendors(requiredKw, userLocation) {
  // Import vendor data (for Node.js environment)
  const vendorsData = require('./vendors_enhanced.json');
  
  // Normalize user location for flexible matching (e.g., "Lagos" matches "Lagos, Nigeria")
  const normalizedLocation = userLocation.toLowerCase().trim();
  
  // Location Guard: Check if any vendor services this location
  const hasVendorsInRegion = vendorsData.some(vendor => {
    const servicesLocation = vendor.service_areas && vendor.service_areas.some(area => 
      area.toLowerCase().includes(normalizedLocation) || 
      normalizedLocation.includes(area.toLowerCase())
    );
    const headquartersMatch = vendor.headquarters.toLowerCase().includes(normalizedLocation);
    return servicesLocation || headquartersMatch;
  });
  
  if (!hasVendorsInRegion) {
    return {
      success: false,
      message: `We currently don't have verified vendors in ${userLocation}. Our network covers Lagos, Abuja, Kano, Port Harcourt, Kigali, and Ouagadougou. Please contact us to request vendor coverage in your region.`,
      vendors: [],
      availableLocations: getAvailableLocations(vendorsData)
    };
  }
  
  // Filter vendors based on criteria
  const matchingVendors = vendorsData.filter(vendor => {
    // Check 1: Vendor must be verified
    if (!vendor.verification_status) {
      return false;
    }
    
    // Check 2: System size must be within vendor's capability range
    const canHandleSize = requiredKw >= vendor.system_size_min_kw && 
                          requiredKw <= vendor.system_size_max_kw;
    if (!canHandleSize) {
      return false;
    }
    
    // Check 3: Vendor must service the user's location
    const servicesLocation = vendor.service_areas && vendor.service_areas.some(area => 
      area.toLowerCase().includes(normalizedLocation) || 
      normalizedLocation.includes(area.toLowerCase())
    ) || vendor.headquarters.toLowerCase().includes(normalizedLocation);
    
    if (!servicesLocation) {
      return false;
    }
    
    return true;
  });
  
  // Sort by rating (highest first), then by years in business
  matchingVendors.sort((a, b) => {
    if (b.rating !== a.rating) {
      return b.rating - a.rating;
    }
    return b.years_in_business - a.years_in_business;
  });
  
  // Check if we found any matching vendors after filtering
  if (matchingVendors.length === 0) {
    return {
      success: false,
      message: `No verified vendors found that can handle ${requiredKw}kW systems in ${userLocation}. Try adjusting your system requirements or contact us for assistance.`,
      vendors: [],
      availableLocations: getAvailableLocations(vendorsData)
    };
  }
  
  // Return enriched vendor data with match score
  return {
    success: true,
    message: `Found ${matchingVendors.length} verified vendor${matchingVendors.length > 1 ? 's' : ''} in ${userLocation}`,
    vendors: matchingVendors.map(vendor => ({
      id: vendor.id,
      company_name: vendor.company_name,
      rating: vendor.rating,
      years_in_business: vendor.years_in_business,
      headquarters: vendor.headquarters,
      service_areas: vendor.service_areas,
      system_capacity_range: `${vendor.system_size_min_kw}-${vendor.system_size_max_kw}kW`,
      specialties: vendor.specialties,
      phone: vendor.phone,
      email: vendor.email,
      avg_response_time: vendor.avg_response_time,
      installations_completed: vendor.installations_completed,
      recommended_for: determineRecommendationReason(vendor, requiredKw)
    }))
  };
}

// Helper function to extract available locations from vendor data
function getAvailableLocations(vendorsData) {
  const locations = new Set();
  
  vendorsData.forEach(vendor => {
    // Add headquarters city
    const hqCity = vendor.headquarters.split(',')[0].trim();
    locations.add(hqCity);
    
    // Add service areas
    if (vendor.service_areas) {
      vendor.service_areas.forEach(area => {
        locations.add(area);
      });
    }
  });
  
  return Array.from(locations).sort();
}

// Helper function to explain why vendor is recommended
function determineRecommendationReason(vendor, requiredKw) {
  const reasons = [];
  
  if (vendor.rating >= 4.5) {
    reasons.push("Highly rated");
  }
  
  if (vendor.years_in_business >= 8) {
    reasons.push("Experienced");
  }
  
  if (vendor.installations_completed >= 150) {
    reasons.push("Proven track record");
  }
  
  // Check if system size is in their sweet spot (middle 60% of their range)
  const range = vendor.system_size_max_kw - vendor.system_size_min_kw;
  const lowerBound = vendor.system_size_min_kw + (range * 0.2);
  const upperBound = vendor.system_size_max_kw - (range * 0.2);
  
  if (requiredKw >= lowerBound && requiredKw <= upperBound) {
    reasons.push("Perfect size match");
  }
  
  const responseHours = parseInt(vendor.avg_response_time);
  if (responseHours <= 3) {
    reasons.push("Fast response time");
  }
  
  return reasons.length > 0 ? reasons.join(", ") : "Qualified installer";
}

function saveQuoteRequest(userData, vendorId, sizingResult) {
  const fs = require('fs');
  const path = require('path');
  
  // Validate inputs
  if (!userData || !userData.name || !userData.email) {
    throw new Error('User data must include name and email');
  }
  
  if (!vendorId) {
    throw new Error('Vendor ID is required');
  }
  
  if (!sizingResult) {
    throw new Error('Sizing result is required');
  }
  
  // Load vendor data to get vendor details
  const vendorsData = require('./vendors_enhanced.json');
  const selectedVendor = vendorsData.find(v => v.id === vendorId);
  
  if (!selectedVendor) {
    throw new Error(`Vendor with ID ${vendorId} not found`);
  }
  
  // Generate unique quote ID (using timestamp + random number)
  const quoteId = `QR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  // Create quote request object
  const quoteRequest = {
    quoteId: quoteId,
    status: 'pending',
    timestamp: new Date().toISOString(),
    userData: {
      name: userData.name,
      email: userData.email,
      phone: userData.phone || null,
      businessName: userData.businessName || null,
      location: userData.location || null
    },
    vendor: {
      id: selectedVendor.id,
      company_name: selectedVendor.company_name,
      email: selectedVendor.email,
      phone: selectedVendor.phone
    },
    systemDetails: {
      recommendedCapacityKW: sizingResult.systemSize.actualCapacityKW,
      totalCost: sizingResult.costs.total,
      monthlySavings: sizingResult.financials.monthlySavings,
      paybackPeriodYears: sizingResult.financials.paybackPeriodYears,
      components: {
        panels: sizingResult.components.panels.quantity,
        inverterKVA: sizingResult.components.inverter.sizeKVA,
        batteries: sizingResult.components.batteries.quantity
      }
    }
  };
  
  // Define the path to the quote requests file
  const filePath = path.join(__dirname, 'quote_requests.json');
  
  // Read existing quotes or initialize empty array
  let quotes = [];
  try {
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      quotes = JSON.parse(fileContent);
    }
  } catch (error) {
    console.warn('Creating new quote_requests.json file');
    quotes = [];
  }
  
  // Append new quote request
  quotes.push(quoteRequest);
  
  // Write back to file with pretty formatting
  fs.writeFileSync(filePath, JSON.stringify(quotes, null, 2), 'utf8');
  
  console.log(`✅ Quote request ${quoteId} saved successfully!`);
  
  return {
    success: true,
    quoteId: quoteId,
    message: `Quote request sent to ${selectedVendor.company_name}. They typically respond within ${selectedVendor.avg_response_time}.`,
    quoteRequest: quoteRequest
  };
}

module.exports = {
  calculateSolarSizing,
  validateInput,
  formatNaira,
  generateCostComparison,
  getMatchingVendors,
  saveQuoteRequest,
  getAvailableLocations
};