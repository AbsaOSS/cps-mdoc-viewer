import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { map, of, switchMap, tap } from 'rxjs';
import { DirectoryToolbarInfo } from '../models/directory-toolbar-info.interface';
import { DirectoryService } from '../services/directory.service';

export const firstDirectoryGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const directoryService = inject(DirectoryService);
  const router = inject(Router);
  const currentDirectory = route.paramMap.get('directory');

  return directoryService.getTopLevelDirectories().pipe(
    switchMap((topLevelDirectories) => {
      // Check if the current directory is a top level directory
      const isTopLevelDirectory = topLevelDirectories.some((dir) => dir.directory === currentDirectory);
      if (isTopLevelDirectory) {
        return of(true);
      } else {
        // If it's not, navigate to the first directory and prevent the route from being activated
        return directoryService.getFirstDirectory().pipe(
          tap((firstDirectory: DirectoryToolbarInfo) => {
            router.navigate([firstDirectory.directory]);
          }),
          map(() => false),
        );
      }
    }),
  );
};
