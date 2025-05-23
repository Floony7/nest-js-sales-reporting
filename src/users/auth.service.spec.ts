import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe('AuthService', () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService> = {
        find: () => Promise.resolve([]),
        create: (email: string, password: string) => Promise.resolve({ id: 1, email, password} as User)
    }

beforeEach(async () => {
    const module = await Test.createTestingModule({
        providers: [AuthService, {
            provide: UsersService,
            useValue: fakeUsersService
        }],
    }).compile();

    service = module.get(AuthService);
})
it("Can create an instance of auth service", async () => {
    expect(service).toBeDefined();
});

it("Creates a new user with a salted hash password", async () => {
    const user = await service.signup('jaquelyn@dupree.com', 'asdf');

    expect(user).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
});

it('throws an error if user signs up with email that is in use', async () => {
    fakeUsersService.find = () => Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);

    await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(BadRequestException);
  });

  
it("throws an exception if signin is called with a malformed email", async () => {
    await expect(service.signin('ergsfef.com', 'wefwef')).rejects.toThrow(NotFoundException);
});

})
