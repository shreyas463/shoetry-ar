import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This script generates placeholder GLB files for testing
// In a real app, you would use actual 3D models

// Make sure the models directory exists
const modelsDir = path.join(__dirname, '../public/models');
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
}

// Create a single placeholder model for all shoes
// This is just an empty file for now
fs.writeFileSync(path.join(modelsDir, 'shoe_placeholder.glb'), '');
console.log('Created shoe_placeholder.glb');

// Create individual placeholder files for each model mentioned in our data
const models = [
  'air_cloud_runner.glb',
  'urban_street_pro.glb',
  'flex_runner.glb',
  'trail_blazer.glb',
  'sport_max.glb',
  'city_walker.glb',
  'velocity_x.glb',
  'summit_pro.glb',
  'urban_chic.glb',
  'retro_classic.glb',
  'bounce_elite.glb',
  'street_flow.glb',
  'alpine_trek.glb',
  'marathon_pro.glb'
];

models.forEach(model => {
  const modelPath = path.join(modelsDir, model);
  // Create a symbolic link to the placeholder
  fs.writeFileSync(modelPath, '');
  console.log(`Created ${model}`);
});

console.log('All placeholder models have been created!');