import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const simStudioPath = join(__dirname, '../src/features/simulator-studio');

function updateFile(filePath) {
  let content = readFileSync(filePath, 'utf8');
  
  // Update @/ imports to relative paths
  content = content.replace(
    /from "@\/([^"]+)"/g, 
    (match, p1) => `from "../../${p1}"`
  );
  
  // Update @/ imports in single quotes
  content = content.replace(
    /from '@\/([^']+)'/g, 
    (match, p1) => `from '../../${p1}'`
  );
  
  // Update @/ imports in template literals
  content = content.replace(
    /from `@\/([^`]+)`/g, 
    (match, p1) => 'from `../../' + p1 + '`'
  );
  
  writeFileSync(filePath, content, 'utf8');
}

function processDirectory(directory) {
  const files = readdirSync(directory);
  
  for (const file of files) {
    const fullPath = join(directory, file);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.jsx')) {
      updateFile(fullPath);
    }
  }
}

console.log('Updating imports in Simulator Studio files...');
processDirectory(simStudioPath);
console.log('Import updates complete!');
