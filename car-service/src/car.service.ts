import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Car, CarDocument, CarDoc } from './model/car.model';
import { CarInput } from './input/car.input';

@Injectable()
export class CarService {
  constructor(@InjectModel(Car.name) private carModel: Model<CarDocument>) {}

  async findAll(): Promise<CarDoc[]> {
    return this.carModel.find().exec();
  }

  async getCarByObjectId(id: string): Promise<CarDoc> {
    return this.carModel.findById(id).exec();
  }

  async getCarById(id: string): Promise<CarDoc> {
    return this.carModel.findOne({ id: id }).exec();
  }

  async create(car: CarInput): Promise<CarDoc> {
    const newCar = new this.carModel(car);
    return newCar.save();
  }

  async update(id: string, car: CarInput): Promise<CarDoc> {
    return this.carModel.findByIdAndUpdate(id, car, { new: true }).exec();
  }

  async delete(id: string): Promise<CarDoc> {
    return this.carModel.findByIdAndDelete(id).exec();
  }

  async getCarByName(name: string): Promise<CarDoc[]> {
    const nameQueryString = Object.assign({
      $regex: name,
      $options: 'i',
    });

    return this.carModel
      .find({
        name: nameQueryString,
      })
      .exec();
  }

  // get car by brand
  async getCarByBrand(brand: string): Promise<CarDoc[]> {
    const brandQueryString = Object.assign({
      brand: {
        $regex: new RegExp(`^${brand}$`),
        $options: 'i',
      },
    });

    return this.carModel.find(brandQueryString).exec();
  }

  /**
   * Get the car by drive query
   * @param drive - drive query: like 2wd|4wd, awd|2wd
   */
  public async getCarByDrive(drive: string): Promise<CarDoc[]> {
    const driveRegexStr = drive
      .split('|')
      .map((str) => {
        return '(?=.*?(' + str + '))';
      })
      .join('');
    console.log(`driveRegexStr: ${driveRegexStr}`);

    const driveQueryString = Object.assign({
      drive: {
        $regex: driveRegexStr,
        $options: 'i',
      },
    });

    return this.carModel.find(driveQueryString).exec();
  }
}
