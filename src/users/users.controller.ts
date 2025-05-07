import { Body, Controller, Post, Patch, Delete, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
@Serialize(UserDto)
@Controller('auth')
export class UsersController {
    constructor(private UsersService: UsersService) {}
    @Post('/signup')
    createUser(@Body() body: CreateUserDto) {
        const {email, password} = body;
        this.UsersService.create(email, password);
    };

    
    @Get('/:id')
    async findUser(@Param('id') id: string) {
        console.log('handler is running');
        const userId = parseInt(id);
        const user = this.UsersService.findOne(userId);
        if (!user) {
            throw new NotFoundException(`User with  Id ${userId} not found.`);
        }
        return user;
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

    @Patch('/:id') 
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        const userId = parseInt(id);
        return this.UsersService.update(userId, body)
    }
}
