import { CanDeactivateFn } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
    canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}
export const leavePageGuard: CanDeactivateFn<CanComponentDeactivate> = (component) => {
    if ('skipGuard' in component && component.skipGuard === true) {
        return true;
    }
    return component.canDeactivate ? component.canDeactivate() : true;
};

