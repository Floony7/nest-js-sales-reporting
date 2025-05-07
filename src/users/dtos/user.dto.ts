import { Expose } from "class-transformer";
/**
 * DTO that describes how to serialize a user for this particular route handler
 */

export class UserDto {
    @Expose()
    id: number;

    @Expose()
    email: string;
}