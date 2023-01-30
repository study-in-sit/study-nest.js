import { PropertyType, User, Image } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UserResponseDto } from 'src/user/dtos/auth.dto';

export class HomeCreateDto {
  @IsNotEmpty()
  @IsString()
  address: string;

  // @IsNotEmpty()
  // @IsNumber()
  // realtor_id: number;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  number_of_bathrooms: number;

  @IsNumber()
  @IsPositive()
  number_of_bedrooms: number;

  @IsNumber()
  @IsPositive()
  land_size: number;

  @IsEnum(PropertyType)
  property_type: PropertyType;

  @IsString({ each: true })
  images: string[];

  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => Image)
  // images: string[];

  // @ValidateNested()
  // @Type(User)
}

export class HomeResponseDto {
  id: number;
  address: string;
  city: string;
  price: number;

  @Exclude()
  realtor: User;

  @Expose({ name: 'realtor' })
  getReator() {
    return new UserResponseDto(this.realtor);
  }

  @Exclude()
  images: Image[];

  @Expose({ name: 'imagesList' })
  imagesList() {
    if (!this.images) return [];
    return this.images.map((e) => e.url);
  }

  @Exclude()
  number_of_bedrooms: number;

  @Expose({ name: 'numberOfBedrooms' })
  numberOfBedrooms() {
    return this.number_of_bathrooms;
  }

  @Exclude()
  number_of_bathrooms: number;

  @Expose({ name: 'numberOfBathrooms' })
  numberOfBathrooms() {
    return this.number_of_bathrooms;
  }

  @Exclude()
  land_size: number;

  @Expose({ name: 'landSize' })
  landSize() {
    return this.land_size;
  }

  property_type: PropertyType;
  created_at: Date;
  updated_at: Date;
  realtor_id: number;

  constructor(partial: Partial<HomeResponseDto>) {
    Object.assign(this, partial);
  }
}
