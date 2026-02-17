 SUNFi Solar Engine — Backend Documentation

File: `solarLogic.js`  
Version: 1.0  
Project: SUNFi — AI-Powered Solar Advisory Platform  
Author: Backend Developer  
Last Updated: February 2026

---

 Overview

`solarLogic.js` is the core backend engine for the SUNFi platform. It handles all business logic for the solar advisory workflow — from validating a user's monthly energy bill, to sizing the appropriate solar system, matching verified vendors, saving quote requests to disk, and generating admin analytics.

This module is written in plain Node.js and exports seven functions. It has two external dependencies at runtime:

- `vendors_enhanced.json` — the local vendor database (loaded via `require()` inside `getMatchingVendors` and `saveQuoteRequest`)
- `quote_requests.json` — a file-based store for submitted quote requests (read/written by `saveQuoteRequest` and `getSystemAnalytics`)

All sizing calculations run entirely client-side using deterministic formulas — no ML model or external API is needed for the core recommendation engine.



 Function Reference

| Function | Arguments | Returns |
|---|---|---|
| `validateInput(monthlyBill)` | `monthlyBill` *(number)* — the SME's combined monthly electricity + diesel cost in Naira | `{ isValid, type, message }` — a validation result object (see Error Handling section) |
| `calculateSolarSizing(monthlyBill)` | `monthlyBill` *(number)* — validated monthly bill in Naira | `sizingResult` — a deeply nested object with consumption, system size, components, costs, financials, and a plain-language explanation (see Data Models section) |
| `formatNaira(amount)` | `amount` *(number)* — a numeric Naira value | `string` — formatted Naira string, e.g. `"₦1,750,000"` |
| `generateCostComparison(monthlyBill, systemSizeKw)` | `monthlyBill` *(number)*, `systemSizeKw` *(number)* | `Array` of 10 yearly objects `{ year, solarCumulative, dieselCumulative }` for the cost-crossover chart |
| `getMatchingVendors(requiredKw, userLocation)` | `requiredKw` *(number)* — system size in kW; `userLocation` *(string)* — city name e.g. `"Lagos"` | `{ success, message, vendors[], availableLocations? }` — matched and sorted vendor list, or a failure object with available locations |
| `saveQuoteRequest(userData, vendorId, sizingResult)` | `userData` *(object)* — must include `name` and `email`; `vendorId` *(string)*; `sizingResult` *(object)* — the full output of `calculateSolarSizing` | `{ success, quoteId, message, quoteRequest }` — confirmation object with a unique quote ID |
| `getSystemAnalytics()` | *(none)* | `{ success, message, data }` — platform metrics derived from `quote_requests.json`, or a graceful failure object if no data exists yet |



 Data Models

 `sizingResult` — returned by `calculateSolarSizing(monthlyBill)`

This is the main object passed around the application. Below is a fully annotated example for a bakery with a ₦225,000/month bill.

```json
{
  "input": {
    "monthlyBill": 225000,
    "tariffPerKWh": 120
  },

  "consumption": {
    "monthlyKWh": 1875.00,
    "dailyKWh": 62.50
  },

  "systemSize": {
    "recommendedCapacityKW": 12.50,
    "actualCapacityKW": 13.20
  },

  "components": {
    "panels": {
      "quantity": 33,
      "wattagePerPanel": 400,
      "totalCapacityKW": 13.2
    },
    "inverter": {
      "sizeKVA": 20,
      "type": "48V Hybrid Inverter"
    },
    "batteries": {
      "quantity": 9,
      "capacityPerBattery": 200,
      "totalCapacityAh": 1736,
      "backupHours": 12,
      "systemVoltage": 48
    }
  },

  "costs": {
    "panels": 4950000,
    "inverter": 10000000,
    "batteries": 2700000,
    "equipment": 17650000,
    "installation": 3530000,
    "total": 21180000
  },

  "financials": {
    "monthlySavings": 202500,
    "paybackPeriodMonths": 105,
    "paybackPeriodYears": 8.8,
    "lifetimeSavings": 39547500,
    "roi": 186.7
  },

  "explanation": "Based on your monthly electricity bill of ₦225,000, your business consumes approximately 62.5 kWh per day..."
}
```

 Key Paths for the Frontend Team

| What to display | Key path |
|---|---|
| System size headline | `result.systemSize.actualCapacityKW` + `" kW"` |
| Total installation cost | `result.costs.total` |
| Monthly savings | `result.financials.monthlySavings` |
| Payback period | `result.financials.paybackPeriodYears` + `" years"` |
| 25-year ROI | `result.financials.roi` + `"%"` |
| Number of panels | `result.components.panels.quantity` |
| Panel wattage | `result.components.panels.wattagePerPanel` |
| Inverter size | `result.components.inverter.sizeKVA` + `" kVA"` |
| Number of batteries | `result.components.batteries.quantity` |
| Battery capacity | `result.components.batteries.capacityPerBattery` + `" Ah"` |
| Backup hours | `result.components.batteries.backupHours` |
| Plain-language explanation | `result.explanation` |
| Equipment subtotal | `result.costs.equipment` |
| Installation fee | `result.costs.installation` |

> **Tip:** Use `formatNaira(result.costs.total)` to display any cost value with the ₦ symbol and correct thousand separators before rendering.

---

 Vendor Object — returned inside `getMatchingVendors().vendors[]`

Each item in the returned `vendors` array has this shape:

```json
{
  "id": "vendor_001",
  "company_name": "SunPower Solutions Nigeria Ltd",
  "rating": 4.8,
  "years_in_business": 7,
  "headquarters": "Abuja, FCT",
  "service_areas": ["Abuja", "Kano", "Kaduna", "Jos"],
  "system_capacity_range": "5-50kW",
  "specialties": ["Commercial", "SME", "Industrial"],
  "phone": "+234 801 234 5678",
  "email": "info@sunpowernigeria.com",
  "avg_response_time": "3 hours",
  "installations_completed": 212,
  "recommended_for": "Highly rated, Experienced, Perfect size match"
}
```

---

 Quote Request Object — written by `saveQuoteRequest()` and stored in `quote_requests.json`

```json
{
  "quoteId": "QR-1707912345678-742",
  "status": "pending",
  "timestamp": "2026-02-14T10:30:00.000Z",
  "userData": {
    "name": "Chioma Okafor",
    "email": "chioma.bakery@gmail.com",
    "phone": "+234 803 123 4567",
    "businessName": "Chioma's Premium Bakery",
    "location": "Lagos"
  },
  "vendor": {
    "id": "vendor_001",
    "company_name": "SunPower Solutions Nigeria Ltd",
    "email": "info@sunpowernigeria.com",
    "phone": "+234 801 234 5678"
  },
  "systemDetails": {
    "recommendedCapacityKW": 13.2,
    "totalCost": 21180000,
    "monthlySavings": 202500,
    "paybackPeriodYears": 8.8,
    "components": {
      "panels": 33,
      "inverterKVA": 20,
      "batteries": 9
    }
  }
}
```

---

 Analytics Object — returned by `getSystemAnalytics()`

```json
{
  "success": true,
  "message": "Analytics generated from 12 quote request(s).",
  "data": {
    "totalQuotes": 12,
    "totalValue": 187450000,
    "popularLocation": "Lagos",
    "popularLocationCount": 7,
    "averageSystemSizeKW": 10.45,
    "locationBreakdown": {
      "Lagos": 7,
      "Abuja": 3,
      "Kano": 2
    }
  }
}
```

---

 Error Handling

 `validateInput(monthlyBill)`

`validateInput` must be called **before** `calculateSolarSizing`. It is the gatekeeper for all user input entering the recommendation engine. It always returns a plain object — it never throws — so the caller can handle all outcomes with a simple `if/else` check.

 Return Object Shape

```js
{
  isValid: Boolean,   // true = safe to proceed to calculateSolarSizing
  type: String,       // "success" | "warning" | "error"
  message: String     // Human-readable explanation
}
```

 Validation Rules (in order of evaluation)

| Condition | `isValid` | `type` | Meaning |
|---|---|---|---|
| `null`, `undefined`, or not a number | `false` | `"error"` | Input is completely invalid; block all further processing |
| `<= 0` (zero or negative) | `false` | `"error"` | Nonsensical bill amount; block processing |
| `< ₦15,000` | `true` | `"warning"` | Bill is unusually low for an SME; proceed but display a caution message to the user |
| `> ₦10,000,000` | `false` | `"error"` | Industrial-scale load; block and direct the user to the engineering team |
| `₦5,000,000 – ₦10,000,000` | `true` | `"warning"` | Very high consumption; proceed but recommend a manual consultation |
| `₦15,000 – ₦5,000,000` | `true` | `"success"` | Normal SME range; proceed without any message |

#### Recommended Frontend Usage

```js
const validation = validateInput(monthlyBill);

if (!validation.isValid) {
  // Show validation.message as a red error banner — do NOT call calculateSolarSizing
  return;
}

if (validation.type === 'warning') {
  // Show validation.message as a yellow advisory banner — still safe to continue
}

const result = calculateSolarSizing(monthlyBill);
```

---

### Errors Thrown by Other Functions

While `validateInput` returns gracefully, the following functions **throw** `Error` exceptions that must be caught with `try/catch`:

| Function | Condition that causes a throw |
|---|---|
| `saveQuoteRequest` | `userData` is missing `name` or `email` |
| `saveQuoteRequest` | `vendorId` is falsy or not found in `vendors_enhanced.json` |
| `saveQuoteRequest` | `sizingResult` is null or undefined |

`getMatchingVendors` and `getSystemAnalytics` do **not** throw — they return a `{ success: false, message: "..." }` object for all failure states (unknown location, empty file, parse error), making them safe to call without a try/catch.

---

## File Dependencies

```
project-root/
├── solarLogic.js           ← this module
├── vendors_enhanced.json   ← vendor database (required at runtime)
└── quote_requests.json     ← auto-created on first saveQuoteRequest() call
```

> `quote_requests.json` does not need to exist before first use. `saveQuoteRequest` will create it automatically. `getSystemAnalytics` will return `{ success: false }` gracefully if the file is absent or empty — this is expected behaviour on a fresh install.

---

## Engineering Constants (Reference)

The following constants are hardcoded inside `calculateSolarSizing` and drive all sizing and cost outputs. If pricing or technical assumptions change, update these values.

| Constant | Value | Description |
|---|---|---|
| `TARIFF_PER_KWH` | ₦120 | Nigerian grid tariff used to back-calculate kWh from bill |
| `PEAK_SUN_HOURS` | 5 hrs | Average daily peak solar irradiance in Nigeria |
| `PANEL_WATTAGE` | 400 W | Standard panel size |
| `BACKUP_HOURS` | 12 hrs | Target battery backup duration |
| `DEPTH_OF_DISCHARGE` | 0.8 (80%) | Usable battery capacity ratio |
| `BATTERY_EFFICIENCY` | 0.9 (90%) | Round-trip charge/discharge efficiency |
| `STANDARD_BATTERY_AH` | 200 Ah | Individual battery capacity |
| `SYSTEM_VOLTAGE` | 48 V | DC bus voltage |
| `COST_PER_PANEL` | ₦150,000 | Supply and delivery cost per 400W panel |
| `COST_PER_KVA_INVERTER` | ₦500,000 | Cost per kVA of inverter capacity |
| `COST_PER_BATTERY` | ₦300,000 | Cost per 200Ah battery unit |
| `INSTALLATION_COST_PERCENTAGE` | 20% | Installation labour as a % of equipment cost |
| `SAVINGS_RATE` | 90% | Assumed monthly bill reduction from going solar |
| `SYSTEM_LIFESPAN_YEARS` | 25 yrs | Industry standard for ROI calculation |

---

*For questions about this module, contact the backend developer. For frontend integration questions, refer to the Data Models section above.*