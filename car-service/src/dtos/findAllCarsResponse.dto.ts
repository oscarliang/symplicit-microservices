import { ServiceResponse } from './serviceResponse.vo';
import { Car } from '../model/car.model';

interface FindAllCarsResponse {
  allCars: Car[];
}

export interface FindAllCarsResponseDto
  extends ServiceResponse<FindAllCarsResponse> {}
