
/// <reference lib = "">

import { defineConfig } from 'tsup'
import * as fs from 'fs'
import * as path from 'path'

const entryFiles: string[] = [];

function isTsOrJsFile(dirent: fs.Dirent) {
  if (!dirent.isFile()) return false;
  const ext = path.extname(dirent.name);
  return ext === '.ts' || ext === '.js';
}

function processFolder(folderPath: string) {
  const folderContents = fs.readdirSync(folderPath, { withFileTypes: true });
  const folderName = path.basename(folderPath);

  for (const dirent of folderContents) {
    if (isTsOrJsFile(dirent)) {
      const ext = path.extname(dirent.name);
      const baseName = path.basename(dirent.name, ext);

      if (baseName === folderName) {
        entryFiles.push(path.join(folderPath, dirent.name));
        return;
      }
    }
  }

  for (const dirent of folderContents) {
    const fullPath = path.join(folderPath, dirent.name);
    if (isTsOrJsFile(dirent)) {
      entryFiles.push(fullPath);
    } else if (dirent.isDirectory()) {
      processFolder(fullPath);
    }
  }
}

processFolder('./src/scripts/');

console.log('Using entry files: ' + entryFiles.join(', '));

export default defineConfig({
    entry: entryFiles.map(e=>`./${e.replace(/\\/g, '/')}`),
    tsconfig: './src/tsconfig.json',
    // dts: true,
})
