import { Coffee } from './entities/coffee.entity';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class CoffeesService {
  private coffees: Coffee[] = [];

  findAll() {
    return this.coffees;
  }

  findOne(id: string) {
    const coffee = this.coffees.find((item) => item.id === +id);
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee;
  }

  create(createCoffeeDto: any) {
    this.coffees.push(createCoffeeDto);
  }

  update(id: string, updateCoffeeDto: any) {
    const existingCoffee = this.findOne(id);
    if (existingCoffee) {
    }
  }

  remove(id: string) {
    const coffeeIdx = this.coffees.findIndex((item) => item.id === +id);
    if (coffeeIdx >= 0) {
      this.coffees.splice(coffeeIdx, 1);
    }
  }
}
