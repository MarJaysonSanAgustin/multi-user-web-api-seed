import { Role } from '../enums/user-role.enum';

export interface JwtPayload {
   readonly id: string;
   readonly email: string;
   readonly role: Role;
}

export interface JwtPayloadDecoded extends JwtPayload {
   readonly iat: number;
   readonly exp: number;
}
