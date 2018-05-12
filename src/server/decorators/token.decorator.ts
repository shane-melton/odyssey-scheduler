import { createRouteParamDecorator } from '@nestjs/common';
import { IAuthToken } from '@shared/interfaces/Auth';

export const Token = createRouteParamDecorator((data, req): IAuthToken => {
    return req.token || {};
});
