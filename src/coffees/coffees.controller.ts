import { PaginationQueryDto } from './../common/dto/pagination-query.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { CoffeesService } from './coffees.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Public } from 'src/common/decorators/public.decorator';

// @UsePipes(ValidationPipe)
@Controller({
  path: 'coffees',
  scope: Scope.DEFAULT,
})
export class CoffeesController {
  constructor(
    private readonly coffeesService: CoffeesService,
    @Inject(REQUEST) private readonly request: Request,
  ) {
    console.log('CoffeesController instantiated');
    console.log(request.headers);
  }

  // @UsePipes(ValidationPipe)
  // @SetMetadata('isPublic', true)
  @Public()
  @Get()
  async findAll(@Query() paginationQuery: PaginationQueryDto) {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return this.coffeesService.findAll(paginationQuery);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.coffeesService.findOne('' + id);
  }

  @Post()
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    return this.coffeesService.create(createCoffeeDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(/* ValidationPipe */) updateCofeeDto: UpdateCoffeeDto,
  ) {
    return this.coffeesService.update(id, updateCofeeDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.coffeesService.remove(id);
  }
}
