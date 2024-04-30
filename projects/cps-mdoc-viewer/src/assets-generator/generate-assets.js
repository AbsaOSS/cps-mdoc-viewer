/*
 * Copyright 2024 ABSA Group Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const fs = require('fs').promises;
const path = require('path');
const matter = require('gray-matter');

const titleIds = {};

// Recursive function to traverse a directory and its subdirectories to find all .md files
async function findDirectories(
  startPath,
  relativePath = '',
  rootDirectory = '',
  level = 0
) {
  let result = {};

  let files = await fs.readdir(startPath);
  let directories = [];
  let fileObjs = [];

  for (let file of files) {
    let filename = path.join(startPath, file);
    let relativeFilename = path.join(relativePath, file);
    let stat = await fs.lstat(filename);

    if (stat.isDirectory()) {
      let indexFile = path.join(filename, '_index.md');
      try {
        await fs.access(indexFile); // Check if the file exists
      } catch (err) {
        if (err.code === 'ENOENT') continue; // Skip this directory if it does not have an _index.md file
        throw err;
      }
      directories.push({
        isDir: true,
        title: file,
        name: file,
        path: filename,
        relativePath: relativeFilename
      });
    } else {
      if (filename.endsWith('.md')) {
        let frontMatter = matter.read(filename);
        let metadata = frontMatter.data;
        let title = metadata.title || path.basename(filename, '.md');
        let weight =
          frontMatter.data.weight !== null &&
          frontMatter.data.weight !== undefined
            ? frontMatter.data.weight
            : Infinity; // Default weight for files without weight
        let date = metadata.date;
        let description_title = metadata.description_title;
        let description = metadata.description;
        let id = createUniqueId(title, rootDirectory);
        let image = metadata.image;
        let offseted_level = filename.endsWith('_index.md') ? level - 1 : level;

        let toolbar_title =
          metadata.toolbar_title || path.basename(filename, '.md'); //Used on the navbar
        fileObjs.push({
          id,
          title,
          toolbar_title,
          filePath: relativeFilename.replace(/\\/g, '/'),
          file,
          date,
          weight,
          description_title,
          description,
          image,
          level: offseted_level
        });
      }
    }
  }

  directories = await addWeightToDirectories(directories);

  result.sortedOrder = [...fileObjs, ...directories]
    .sort((a, b) => {
      if (a.file === '_index.md') return -1;
      if (b.file === '_index.md') return 1;
      return a.weight - b.weight || a.title.localeCompare(b.title);
    })
    .map((item) => (item.isDir ? item.name : item));

  for (let dir of directories) {
    result[dir.name] = await findDirectories(
      dir.path,
      dir.relativePath,
      !rootDirectory ? dir.name : rootDirectory,
      level + 1
    );
  }

  return result;
}

// Process directories by reading _index.md file in each directory and sorting them by weight and name
async function addWeightToDirectories(directories) {
  for (let dir of directories) {
    let indexFile = path.join(dir.path, '_index.md');
    dir.weight = Infinity;
    try {
      let content = await fs.readFile(indexFile, 'utf-8');
      let frontMatter = matter(content);
      // Default weight for files without weight is Infinity
      dir.weight =
        frontMatter.data.weight !== null &&
        frontMatter.data.weight !== undefined
          ? frontMatter.data.weight
          : Infinity; // Default weight for files without weight
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }
  }
  return directories;
}

function createUniqueId(title, rootDirectory) {
  let id = title.toLowerCase().replace(/ /g, '-');

  if (!titleIds[rootDirectory] || !titleIds[rootDirectory][id]) {
    titleIds[rootDirectory] = { ...titleIds[rootDirectory], [id]: 1 };
    return id;
  }

  return `${id}-${titleIds[rootDirectory][id]++}`;
}

(async () => {
  const directories = await findDirectories(
    './projects/example-app/src/assets/categories',
    'assets/categories'
  );
  await fs.writeFile(
    './projects/example-app/src/assets/categories/categories.json',
    JSON.stringify(directories)
  );

  /* Modification of the main.ts just to trigger the dev server reload, to serve newly added assets
       Workaround until https://github.com/angular/angular-cli/issues/27511 is resolved
    */
  let mainTs = await fs.readFile('./projects/example-app/src/main.ts', 'utf-8');
  await fs.writeFile('./projects/example-app/src/main.ts', mainTs);
})();
