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

import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { map, of, switchMap, tap } from 'rxjs';
import { DirectoryToolbarInfo } from '../models/directory-toolbar-info.interface';
import { DirectoryService } from '../services/directory.service';

export const firstDirectoryGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
) => {
  const directoryService = inject(DirectoryService);
  const router = inject(Router);
  const currentDirectory = route.paramMap.get('directory');

  return directoryService.getTopLevelDirectories().pipe(
    switchMap((topLevelDirectories) => {
      // Check if the current directory is a top level directory
      const isTopLevelDirectory = topLevelDirectories.some(
        (dir) => dir.directory === currentDirectory
      );
      if (isTopLevelDirectory) {
        return of(true);
      } else {
        // If it's not, navigate to the first directory and prevent the route from being activated
        return directoryService.getFirstDirectory().pipe(
          tap((firstDirectory: DirectoryToolbarInfo) => {
            router.navigate([firstDirectory.directory]);
          }),
          map(() => false)
        );
      }
    })
  );
};
