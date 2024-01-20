import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Car, CarDoc } from './model/car.model';
import { CarService } from './car.service';
import { CarInput } from './input/car.input';

@Resolver(() => Car)
export class CarResolver {
  constructor(private readonly carService: CarService) {}

  @Query(() => [Car], { name: 'allCars' })
  cars(): Promise<Car[]> {
    return this.carService.findAll();
  }

  @Query(() => Car, { name: 'getCarById' })
  async getCarById(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<CarDoc> {
    return this.carService.getCarById(id);
  }

  @Mutation(() => Car, { name: 'createCar' })
  async createCar(@Args('input') input: CarInput): Promise<CarDoc> {
    return this.carService.create(input);
  }

  @Mutation(() => Car, { name: 'updateCar' })
  async updateCar(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: CarInput,
  ): Promise<Car> {
    return this.carService.update(id, input);
  }

  @Mutation(() => Car, { name: 'deleteCar' })
  async deleteCar(@Args('id', { type: () => ID }) id: string): Promise<CarDoc> {
    return this.carService.delete(id);
  }

  // 查询一个车
  @Query(() => [Car], { name: 'getCarByName' })
  public async getCarByName(@Args('name') name: string): Promise<CarDoc[]> {
    return this.carService.getCarByName(name);
  }

  // 查询一个车
  @Query(() => [Car], { name: 'getCarByBrand' })
  public async getCarByBrand(@Args('brand') brand: string): Promise<CarDoc[]> {
    return this.carService.getCarByBrand(brand);
  }

  // 查询一个车
  @Query(() => [Car], { name: 'getCarByDrive' })
  public async getCarByDrive(@Args('drive') drive: string): Promise<CarDoc[]> {
    return this.carService.getCarByDrive(drive);
  }
}
