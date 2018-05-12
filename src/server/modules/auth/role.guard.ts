import { CanActivate, ExecutionContext, Guard } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '@server/modules/auth/auth.service';
import { IAuthToken } from '@shared/interfaces/Auth';

@Guard()
export class RoleGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly authService: AuthService
    ) { }

    async canActivate(dataOrRequest, context: ExecutionContext): Promise<boolean> {
        const roles = this.getRolesFromContext(context);
        const user = (dataOrRequest.token || null) as IAuthToken;

        return this.authService.userHasRoles(user, roles);
    }

    /**
     * Retrieves any Role meta data from the executing context (the controller and specific route)
     * @param {ExecutionContext} context
     * @returns {string[]}
     */
    getRolesFromContext(context: ExecutionContext): string[] {
        const {parent, handler} = context;
        const handlerRoles = this.reflector.get<string[]>('roles', handler) || [];
        const parentRoles = this.reflector.get<string[]>('roles', parent) || [];

        return [].concat(handlerRoles, parentRoles);
    }
}
