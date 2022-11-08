import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { defaultUser } from '~/common/constants';

import { UsersService } from './users.service';

import { UserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  @ApiOperation({ description: 'Crea un usuario tenant' })
  @ApiBody({
    description: 'crea un usuario tenant usando un userDto',
    type: UserDto,
    examples: {
      ejemplo1: {
        value: defaultUser,
      },
    },
  })
  @ApiResponse({ status: 201, description: 'usuario creado correctamente' })
  @ApiResponse({
    status: 409,
    description: 'Email del user ya existe, <br/> El rol no existe',
  })
  create(@Body() userDto: UserDto) {
    return this.usersService.create(userDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
