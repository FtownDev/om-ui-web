import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthGuardData, createAuthGuard } from 'keycloak-angular';

const isLoggedIn = async (
  route: ActivatedRouteSnapshot,
  _: RouterStateSnapshot,
  authData: AuthGuardData
): Promise<boolean> => {
  const { authenticated, keycloak } = authData;

  const path = route.pathFromRoot;
  if (authenticated) {
    return true;
  } else {
    await keycloak
      .login({
        redirectUri: window.location.href,
      })
      .then(() => {
        return true;
      });
  }

  return false;
};

export const isAuthenticated = createAuthGuard<CanActivateFn>(isLoggedIn);
