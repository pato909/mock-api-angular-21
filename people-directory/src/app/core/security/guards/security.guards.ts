import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SecurityService } from '../security.service';

export const adminGuard: CanActivateFn = () => {
  const securityService = inject(SecurityService);
  const router = inject(Router);

  if (securityService.canCreatePerson()) {
    return true;
  }

  return router.parseUrl('/denied');
};

export const connectedGuard: CanActivateFn = () => {
  const securityService = inject(SecurityService);
  const router = inject(Router);

  if (securityService.canAccessProtectedRoute()) {
    return true;
  }

  return router.parseUrl('/denied');
};
