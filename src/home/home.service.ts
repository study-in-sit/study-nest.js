import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeCreateDto, HomeResponseDto } from './dtos/home.dto';

const homeSelect = {
  id: true,
  address: true,
  city: true,
  price: true,
  number_of_bedrooms: true,
  number_of_bathrooms: true,
  land_size: true,
  property_type: true,
  created_at: true,
  updated_at: true,
  realtor_id: true,
  images: true,
  realtor: true,
};

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}
  // constructor(private readonly authUservice: AuthUser) {}

  async getHomes(filtors: any): Promise<HomeResponseDto[]> {
    const homes = await this.prismaService.home.findMany({
      select: homeSelect,
      where: {
        ...filtors,
      },
    });

    if (!homes.length) {
      throw new NotFoundException();
    }

    return homes.map((e) => new HomeResponseDto(e));
  }

  async getHome(id: number): Promise<HomeResponseDto> {
    const home = await this.prismaService.home.findUnique({
      select: homeSelect,
      where: {
        id,
      },
    });

    if (!home) {
      throw new NotFoundException();
    }

    return new HomeResponseDto(home);
  }

  async createHome({
    address,
    city,
    price,
    number_of_bathrooms,
    number_of_bedrooms,
    land_size,
    property_type,
    images,
  }: HomeCreateDto) {
    const home = await this.prismaService.home.create({
      data: {
        address,
        city,
        price,
        number_of_bathrooms,
        number_of_bedrooms,
        land_size,
        property_type,
        realtor_id: 2,
      },
    });

    const imagesPayload = images.map((data) => {
      return { url: data, home_id: home.id };
    });

    await this.prismaService.image.createMany({
      data: imagesPayload,
    });

    return new HomeResponseDto(await this.getHome(home.id));
  }

  async deleteHome(id: number): Promise<HomeResponseDto> {
    try {
      const iamges = await this.prismaService.image.deleteMany({
        where: {
          home_id: id,
        },
      });

      const home = await this.prismaService.home.delete({
        where: {
          id,
        },
      });
      return new HomeResponseDto(home);
    } catch (err) {
      return err;
    }
  }
}
