import { Controller, HttpStatus } from '@nestjs/common';
import { CarService } from './car.service';
import { MessagePattern } from '@nestjs/microservices';
import { FindAllCarsResponseDto } from './dtos/findAllCarsResponse.dto';

@Controller()
export class CarController {
  constructor(private readonly carService: CarService) {}

  @MessagePattern('find_all_cars')
  public async findAllCars(): Promise<FindAllCarsResponseDto> {
    const cars = await this.carService.findAll();
    if (cars) {
      return {
        statusCode: HttpStatus.OK,
        message: 'find_all_cars_success',
        data: {
          allCars: cars,
        },
      };
    } else {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'find_all_cars_not_found',
        data: null,
      };
    }
  }
}
