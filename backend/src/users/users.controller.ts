import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto, CreateAddressDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getProfile(@Request() req) {
    return this.usersService.findById(req.user.id);
  }

  @Put('me')
  updateProfile(@Request() req, @Body() dto: UpdateUserDto) {
    return this.usersService.updateProfile(req.user.id, dto);
  }

  @Put('me/password')
  changePassword(
    @Request() req,
    @Body() body: { oldPassword: string; newPassword: string },
  ) {
    return this.usersService.changePassword(req.user.id, body.oldPassword, body.newPassword);
  }

  @Get('me/addresses')
  getAddresses(@Request() req) {
    return this.usersService.getAddresses(req.user.id);
  }

  @Post('me/addresses')
  addAddress(@Request() req, @Body() dto: CreateAddressDto) {
    return this.usersService.addAddress(req.user.id, dto);
  }

  @Put('me/addresses/:id')
  updateAddress(@Request() req, @Param('id') id: string, @Body() dto: CreateAddressDto) {
    return this.usersService.updateAddress(req.user.id, id, dto);
  }

  @Delete('me/addresses/:id')
  deleteAddress(@Request() req, @Param('id') id: string) {
    return this.usersService.deleteAddress(req.user.id, id);
  }
}
