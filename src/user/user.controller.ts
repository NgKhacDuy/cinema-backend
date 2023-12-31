import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSignUpDto } from './dto/user-signup.dto';
import { UserSignInDto } from './dto/user-signin.dto';
import { UserChangePassDto } from './dto/user-changePass.dto';
import { CurrentUser } from 'src/utilities/decorators/current-user.decorators';
import { User } from './entities/user.entity';
import { AuthenGuard } from 'src/utilities/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utilities/guards/authorization.guard';
import { AuthorizeRoles } from 'src/utilities/decorators/authorize-roles.decorator';
import { Role } from 'src/utilities/common/user-role.enum';
import { UserRefreshDto } from './dto/user-refresh.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Body() body: UserSignUpDto) {
    return await this.userService.signup(body);
  }

  @Post('signin')
  async signin(@Body() body: UserSignInDto) {
    return await this.userService.signin(body);
  }

  @UseGuards(AuthenGuard, AuthorizeGuard([Role.ADMIN]))
  @Get('all')
  async findAll() {
    return this.userService.findAll();
  }

  @UseGuards(AuthenGuard, AuthorizeGuard([Role.ADMIN]))
  @Get('find/:name')
  findName(@Param('name') name: string) {
    return this.userService.findName(name);
  }

  @UseGuards(AuthenGuard, AuthorizeGuard([Role.USER]))
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @UseGuards(AuthenGuard, AuthorizeGuard([Role.USER]))
  @Patch('password/:id')
  changePassword(@Param('id') id: number, @Body() password: UserChangePassDto) {
    return this.userService.changePassword(id, password);
  }

  @UseGuards(AuthenGuard, AuthorizeGuard([Role.ADMIN]))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @UseGuards(AuthenGuard, AuthorizeGuard([Role.USER, Role.ADMIN]))
  @Get('profile')
  getProfile(@CurrentUser() currentUser: User) {
    return currentUser;
  }

  @Post('refresh')
  async refreshToken(@Body() refreshToken: UserRefreshDto) {
    return await this.userService.refreshToken(refreshToken);
  }
}
