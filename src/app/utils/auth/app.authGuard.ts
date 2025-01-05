import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthGuardData, createAuthGuard } from 'keycloak-angular';

const isAccessAllowed = async (
  route: ActivatedRouteSnapshot,
  _: RouterStateSnapshot,
  authData: AuthGuardData
): Promise<boolean> => {
  const { authenticated, keycloak } = authData;

  if (authenticated) {
    return true;
  } else {
    await keycloak.login().then(() => {
      return true;
    });
  }

  return false;
};

export const isAuthenticated = createAuthGuard<CanActivateFn>(isAccessAllowed);
