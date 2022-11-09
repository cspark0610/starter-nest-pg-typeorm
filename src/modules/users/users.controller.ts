/* eslint-disable @typescript-eslint/no-floating-promises */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import fastify = require('fastify');
import { defaultUser } from '~/common/constants';

import { UsersService } from './users.service';

import { UserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  @ApiOperation({
    description: 'Crea un usuario tenant y le envia un correo de bienvenida',
  })
  @ApiBody({
    description: 'Crea un usuario tenant usando un userDto',
    type: UserDto,
    examples: {
      ejemplo1: {
        value: defaultUser,
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado correctamente y correo enviado',
  })
  @ApiResponse({
    status: 409,
    description: 'Email del user o el subdomiino a registar ya existe',
  })
  async create(@Body() userDto: UserDto, @Res() res: fastify.FastifyReply) {
    const data = await this.usersService.create(userDto);
    res.status(201).send({
      message: 'User tenant has been successfully created and sent email',
      data,
    });
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
