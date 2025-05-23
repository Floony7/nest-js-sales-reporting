import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async signup(email: string, password: string) {
        // Check if email exists
        const users = await this.usersService.find(email);

        if (users.length) {
            throw new BadRequestException('email in use');
        }

        // Generate a salt
        const salt = randomBytes(8).toString('hex');

        // Salt and Hash user's password
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        const  result = `${salt}.${hash.toString('hex')}`;

        // Create new user and save
        const user = await this.usersService.create(email, result);

        // Return the user
        return user;
    }

async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);

    if (!user) {
        throw new NotFoundException('User not found');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')){
        throw new BadRequestException('Bad password');
    } 

    return user;
}
}

