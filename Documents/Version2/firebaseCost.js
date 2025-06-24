// Adjustable Parameters
const MARGIN_PERCENT = 20; // Change this to your desired profit margin (e.g. 20, 50, 300)

// Main Function
function calculateFirebaseCost(participants, photosPerPerson, storageDays = 8, photoSizeMB = 1) {
  // Firebase Pricing
  const STORAGE_PRICE_PER_GB_PER_MONTH = 0.026;
  const EGRESS_PRICE_PER_GB = 0.12; 
  const DAYS_IN_MONTH = 30;

  const markup = MARGIN_PERCENT / 100;

  // Calculations
  const totalPhotos = participants * photosPerPerson;
  const totalGB = (totalPhotos * photoSizeMB) / 1024;

  // Storage cost (for 1 copy stored)
  const storageFraction = storageDays / DAYS_IN_MONTH;
  const storageCost = totalGB * STORAGE_PRICE_PER_GB_PER_MONTH * storageFraction;

  // Egress cost: each participant views/downloads the entire album
  const egressGB = totalGB * participants;
  const egressCost = egressGB * EGRESS_PRICE_PER_GB;

  // Total cost
  const totalCost = storageCost + egressCost;

  // Final price with margin
  const finalPrice = totalCost * (1 + markup);

  // Output
  console.log("Event Configuration:");
  console.log(`Participants: ${participants}`);
  console.log(`Photos per Person: ${photosPerPerson}`);
  console.log(`Storage Duration: ${storageDays} days`);
  console.log(`Total Photos: ${totalPhotos}`);
  console.log(`Total GB Stored: ${totalGB.toFixed(2)} GB`);
  console.log(`Total GB Egress: ${egressGB.toFixed(2)} GB`);

  console.log("\nCost Breakdown:");
  console.log(`Storage Cost: €${storageCost.toFixed(3)}`);
  console.log(`Egress Cost: €${egressCost.toFixed(3)}`);
  console.log(`Total Firebase Cost: €${totalCost.toFixed(2)}`);

  console.log(`\nSuggested Price (${MARGIN_PERCENT}% margin): €${finalPrice.toFixed(2)}`);
}

// participants, images, duration in days
calculateFirebaseCost(20, 15, 8); 
