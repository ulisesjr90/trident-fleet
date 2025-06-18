import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import { firestoreUtils } from '../utils/firebaseUtils';
import type { Vehicle } from '../types/Vehicle';

async function seedVehiclesFromCSV() {
  try {
    const csvFilePath = path.resolve(__dirname, '../../vehicles_export_cleaned.csv');
    const csvData = fs.readFileSync(csvFilePath, 'utf8');

    const records = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    }) as Vehicle[];

    const seedPromises = records.map(vehicle => {
      // Basic data cleaning
      const cleanedVehicle = Object.fromEntries(
        Object.entries(vehicle).filter(([_, v]) => v !== '' && v !== undefined)
      );

      // Numeric conversion
      ['currentMileage', 'nextOilChangeDueMileage'].forEach(field => {
        if (cleanedVehicle[field]) {
          cleanedVehicle[field] = Number(cleanedVehicle[field]);
        }
      });

      return firestoreUtils.create('vehicles', cleanedVehicle);
    });

    const results = await Promise.all(seedPromises);
    console.log(`Seeded ${results.length} vehicles`);
    return results;
  } catch (error) {
    console.error('Seeding error:', error);
    throw error;
  }
}

// Direct script execution
if (require.main === module) {
  seedVehiclesFromCSV()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

export default seedVehiclesFromCSV; 