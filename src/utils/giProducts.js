// Geographical Indication Products Mapping
// If product keyword found in OCR text, GSTIN state MUST match expected state

export const GI_PRODUCTS = {
  // Jammu & Kashmir (01)
  "kashmiri": { states: ["01"], product: "Kashmiri Products", region: "Jammu & Kashmir" },
  "pashmina": { states: ["01"], product: "Pashmina Shawl", region: "Jammu & Kashmir" },
  "saffron": { states: ["01"], product: "Kashmiri Saffron", region: "Jammu & Kashmir" },
  "kesar": { states: ["01"], product: "Kashmiri Kesar", region: "Jammu & Kashmir" },

  // Uttar Pradesh (09)
  "banarasi": { states: ["09"], product: "Banarasi Silk", region: "Uttar Pradesh" },
  "benarasi": { states: ["09"], product: "Benarasi Silk", region: "Uttar Pradesh" },
  "lucknowi": { states: ["09"], product: "Lucknowi Chikan", region: "Uttar Pradesh" },
  "chikan": { states: ["09"], product: "Chikankari", region: "Uttar Pradesh" },

  // West Bengal (19)
  "darjeeling": { states: ["19"], product: "Darjeeling Tea", region: "West Bengal" },
  "baluchari": { states: ["19"], product: "Baluchari Saree", region: "West Bengal" },

  // Madhya Pradesh (23)
  "chanderi": { states: ["23"], product: "Chanderi Silk", region: "Madhya Pradesh" },
  "maheshwari": { states: ["23"], product: "Maheshwari Saree", region: "Madhya Pradesh" },

  // Gujarat (24)
  "patola": { states: ["24"], product: "Patan Patola", region: "Gujarat" },
  "bandhani": { states: ["24", "08"], product: "Bandhani", region: "Gujarat/Rajasthan" },

  // Maharashtra (27)
  "alphonso": { states: ["27"], product: "Alphonso Mango", region: "Maharashtra" },
  "hapus": { states: ["27"], product: "Ratnagiri Hapus", region: "Maharashtra" },
  "paithani": { states: ["27"], product: "Paithani Saree", region: "Maharashtra" },
  "kolhapuri": { states: ["27"], product: "Kolhapuri Chappal", region: "Maharashtra" },

  // Karnataka (29)
  "mysore": { states: ["29"], product: "Mysore Silk", region: "Karnataka" },
  "coorg": { states: ["29"], product: "Coorg Orange/Coffee", region: "Karnataka" },
  "byadgi": { states: ["29"], product: "Byadgi Chilli", region: "Karnataka" },

  // Kerala (32)
  "malabar": { states: ["32"], product: "Malabar Pepper/Coffee", region: "Kerala" },
  "kasavu": { states: ["32"], product: "Kerala Kasavu Saree", region: "Kerala" },

  // Tamil Nadu (33)
  "kanchipuram": { states: ["33"], product: "Kanchipuram Silk", region: "Tamil Nadu" },
  "kanjeevaram": { states: ["33"], product: "Kanjeevaram Silk", region: "Tamil Nadu" },
  "chettinad": { states: ["33"], product: "Chettinad Products", region: "Tamil Nadu" },
  "nilgiri": { states: ["33"], product: "Nilgiri Tea", region: "Tamil Nadu" },

  // Telangana (36)
  "pochampally": { states: ["36"], product: "Pochampally Ikat", region: "Telangana" },
  "gadwal": { states: ["36"], product: "Gadwal Saree", region: "Telangana" },

  // Andhra Pradesh (37)
  "tirupati": { states: ["37"], product: "Tirupati Laddu", region: "Andhra Pradesh" },
  "venkatagiri": { states: ["37"], product: "Venkatagiri Saree", region: "Andhra Pradesh" },

  // Odisha (21)
  "sambalpuri": { states: ["21"], product: "Sambalpuri Saree", region: "Odisha" },
  "bomkai": { states: ["21"], product: "Bomkai Saree", region: "Odisha" },

  // Assam (18)
  "assam tea": { states: ["18"], product: "Assam Tea", region: "Assam" },
  "muga": { states: ["18"], product: "Muga Silk", region: "Assam" },

  // Rajasthan (08)
  "blue pottery": { states: ["08"], product: "Jaipur Blue Pottery", region: "Rajasthan" },
  "sanganeri": { states: ["08"], product: "Sanganeri Print", region: "Rajasthan" },
  "kota doria": { states: ["08"], product: "Kota Doria", region: "Rajasthan" }
};

/**
 * Check for GI Origin fraud
 * @param {string} ocrText - Full text extracted from receipt
 * @param {string} stateCode - State code from GSTIN (e.g., "27")
 * @returns {array} - Array of alerts (empty if no issues)
 */
export function checkGIOrigin(ocrText, stateCode) {
  if (!ocrText || !stateCode) return [];

  const alerts = [];
  const lowerText = ocrText.toLowerCase();

  for (const [keyword, info] of Object.entries(GI_PRODUCTS)) {
    if (lowerText.includes(keyword)) {
      // Check if seller's state matches expected origin
      if (!info.states.includes(stateCode)) {
        alerts.push({
          keyword: keyword,
          product: info.product,
          expectedRegion: info.region,
          expectedStates: info.states,
          actualState: stateCode,
          severity: "HIGH",
          message: `⚠️ ORIGIN MISMATCH: "${info.product}" should be from ${info.region} (State ${info.states.join('/')}), but seller is from State ${stateCode}`
        });
      }
    }
  }

  return alerts;
}

/**
 * Get GI status for display
 */
export function getGIStatus(ocrText, stateCode) {
  const alerts = checkGIOrigin(ocrText, stateCode);

  if (alerts.length === 0) {
    return { status: "OK", alerts: [], message: "No GI products detected or origin verified" };
  }

  return {
    status: "ALERT",
    alerts: alerts,
    message: `${alerts.length} origin mismatch(es) detected`
  };
}

export default { GI_PRODUCTS, checkGIOrigin, getGIStatus };
