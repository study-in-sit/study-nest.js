import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PropertyType, UserType } from '@prisma/client';
import { Roles } from 'src/decolators/roles.decolator';
import { AuthGuard } from 'src/guard/auth.guard';
import { User } from 'src/user/decolator/user.decolator';
import { HomeCreateDto, HomeResponseDto } from './dtos/home.dto';
import { HomeService } from './home.service';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get('/')
  getHomes(
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('propertyType') propertyType?: PropertyType,
  ): Promise<HomeResponseDto[]> {
    const filtors = {
      ...(city && { city }),
      price: {
        ...(minPrice && { gte: minPrice }),
        ...(maxPrice && { lte: maxPrice }),
      },
      ...(propertyType && { property_type: propertyType }),
    };

    return this.homeService.getHomes(filtors);
  }

  @Get(':id')
  getHome(@Param('id') id: number): Promise<HomeResponseDto> {
    return this.homeService.getHome(id);
  }

  @Roles(UserType.ADMIN, UserType.ADMIN)
  @UseGuards(AuthGuard)
  @Post()
  createHome(@Body() body: HomeCreateDto, @User() user) {
    return this.homeService.createHome(body);
  }

  // @Put(':id')
  // updateHome() {}

  @Delete(':id')
  deleteHome(@Param('id') id: number) {
    return this.homeService.deleteHome(id);
  }
}
