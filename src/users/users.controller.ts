import { Body, Controller, Post, Patch, Delete, Get, Param, Query, NotFoundException, Session, UseInterceptors, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { CurrentUser } from './current-user.decorator';
// import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { User } from './user.entity';
import { AuthGuard } from 'src/guards/auth.guards';
@Serialize(UserDto)
// @UseInterceptors(CurrentUserInterceptor)
@Controller('auth')
export class UsersController {
    constructor(
        private UsersService: UsersService,
        private authService: AuthService
    ) {}

    @Get('/whoami')
    @UseGuards(AuthGuard)
    whoAmI(@CurrentUser() user: User) {
        return user;
    }

    @Post('/signout') 
    signOut(@Session() session: any) {
        return session.userId = null;
    }

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        const {email, password} = body;
        const user = await this.authService.signup(email, password);
        session.userId = user.id;
    };

    @Post('/signin')
    async signin(@Body() body:  CreateUserDto, @Session() session: any) {
        const { email, password} = body;
        const user = await this.authService.signin(email, password);
        session.userId = user.id;
    }

    
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
