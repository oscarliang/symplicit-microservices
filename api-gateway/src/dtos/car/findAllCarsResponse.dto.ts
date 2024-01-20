import { ServiceResponse } from '../vo/serviceResponse.vo';
import { CarVo } from '../vo/car.vo';

interface FindAllCars {
  allCar: CarVo[];
  modules?: Record<string, number>;
}

export interface FindAllCarsResponse extends ServiceResponse<FindAllCars> {}

export interface FindAllCarsTcpResponse extends ServiceResponse<FindAllCars> {}
