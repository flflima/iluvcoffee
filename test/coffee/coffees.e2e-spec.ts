import { UpdateCoffeeDto } from './../../src/coffees/dto/update-coffee.dto';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { CreateCoffeeDto } from 'src/coffees/dto/create-coffee.dto';
import { CoffeesModule } from '../../src/coffees/coffees.module';

describe('[Feature] Coffees - /coffees', () => {
  const coffee = {
    name: 'Shipwrek Roast',
    brand: 'Buddy Brew',
    flavors: ['chocolate', 'vanilla'],
  };

  const updatedCoffee = {
    name: 'Shipwrek Roast',
    brand: 'Buddy Brew',
    flavors: ['strawberry'],
  };

  let app: INestApplication;

  let coffeeId = '';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CoffeesModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5433,
          username: 'postgres',
          password: 'pass123',
          database: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    await app.init();
  });

  it('Create [POST /]', () => {
    return request(app.getHttpServer())
      .post('/coffees')
      .send(coffee as CreateCoffeeDto)
      .expect(HttpStatus.CREATED)
      .then(({ body }) => {
        const expectedCoffee = jasmine.objectContaining({
          ...coffee,
          flavors: jasmine.arrayContaining(
            coffee.flavors.map((name) => jasmine.objectContaining({ name })),
          ),
        });

        coffeeId = body.id;

        expect(body).toEqual(expectedCoffee);
      });
  });

  it('Get all [GET /]', () => {
    return request(app.getHttpServer())
      .get('/coffees')
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        const expectedCoffee = jasmine.objectContaining({
          ...coffee,
          flavors: jasmine.arrayContaining(
            coffee.flavors.map((name) => jasmine.objectContaining({ name })),
          ),
        });
        expect(body).toContainEqual(expectedCoffee);
      });
  });

  it('Get one [GET /:id]', () => {
    return request(app.getHttpServer())
      .get(`/coffees/${coffeeId}`)
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        const expectedCoffee = jasmine.objectContaining({
          ...coffee,
          flavors: jasmine.arrayContaining(
            coffee.flavors.map((name) => jasmine.objectContaining({ name })),
          ),
        });
        expect(body).toEqual(expectedCoffee);
      });
  });

  it('Update one [PATCH /:id]', () => {
    return request(app.getHttpServer())
      .patch(`/coffees/${coffeeId}`)
      .send({ flavors: ['strawberry'] } as UpdateCoffeeDto)
      .expect(HttpStatus.OK)
      .then(({ body }) => {
        const expectedCoffee = jasmine.objectContaining({
          ...updatedCoffee,
          flavors: jasmine.arrayContaining(
            updatedCoffee.flavors.map((name) =>
              jasmine.objectContaining({ name }),
            ),
          ),
        });
        expect(body).toEqual(expectedCoffee);
      });
  });

  it('Delete one [DELETE /:id]', () => {
    return request(app.getHttpServer())
      .delete(`/coffees/${coffeeId}`)
      .send({ flavors: ['strawberry'] } as UpdateCoffeeDto)
      .expect(HttpStatus.OK);
  });

  afterAll(async () => {
    await app.close();
  });
});
