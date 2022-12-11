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
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

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
    description:
      'Emails sent to {email} and devsmartcore@outlook.com and user tenant created successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'Email del user o el subdominio a registar ya existe',
  })
  async create(@Body() userDto: UserDto, @Res() res: fastify.FastifyReply) {
    const { user, message } = await this.usersService.create(userDto);
    res.status(201).send({
      message,
      data: user,
    });
  }

  @ApiOperation({
    description: 'Trae todos los usuarios tenant',
  })
  @ApiResponse({
    status: 200,
    description: 'Users found successfully',
  })
  @Get()
  async findAll(@Res() res: fastify.FastifyReply) {
    const data = await this.usersService.findAll();

    res.status(200).send({
      message: `Users found successfully`,
      data,
    });
  }

  @ApiOperation({
    description: 'Trae un usuario tenant pasando su id',
  })
  @ApiParam({
    description: 'Pasar el id del usuario tenant a buscar',
    type: String,
    required: true,
    name: 'id',
  })
  @ApiResponse({
    status: 200,
    description: 'User with id: {id} found successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'User with id: {id} not found',
  })
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: fastify.FastifyReply) {
    const data = await this.usersService.findOne(Number(id));

    res.status(200).send({
      message: `User with id: ${id} found successfully`,
      data,
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiOperation({
    description:
      'Elimina un usuario tenant y su organizacion pasando el id de usuario',
  })
  @ApiParam({
    description: 'Pasar el id del usuario tenant a eliminar',
    type: String,
    required: true,
    name: 'id',
  })
  @ApiResponse({
    status: 200,
    description:
      'User with id: {id}, and organization with id: {id} removed successfully',
  })
  @ApiResponse({
    status: 409,
    description: 'User with id: {id} not found',
  })
  @Delete(':id')
  remove(@Param('id') id: string, @Res() res: fastify.FastifyReply) {
    this.usersService.remove(Number(id));
    res.status(200).send({
      message: `User with id: ${id}, and organization with id: ${id} removed successfully`,
      data: `${id}`,
    });
  }
}
