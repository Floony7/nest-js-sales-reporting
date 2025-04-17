import { Body, Controller, Post, Patch, Delete, Get, Param, Query } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
@Controller('auth')
export class UsersController {
    constructor(private UsersService: UsersService) {}
    @Post('/signup')
    createUser(@Body() body: CreateUserDto) {
        const {email, password} = body;
        this.UsersService.create(email, password);
    };

    @Get(':id')
    findUser(@Param('id') id: string) {
        const userId = parseInt(id);
        return this.UsersService.findOne(userId);
    }

    @Get()
    findAllUsers(@Query('email') email: string) {
        return this.UsersService.find(email);
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        const userId = parseInt(id);
        return this.UsersService.remove(userId)
    }
}
