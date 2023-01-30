import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInDto, SignupDto } from '../dtos/auth.dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserType } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  generateJwt(name: string, id: number) {
    return jwt.sign(
      {
        name,
        id,
      },
      process.env.JSON_TOKEN_KEY,
      { expiresIn: 3600000 },
    );
  }

  generateProductKey(email: string, userType: UserType) {
    const string = `${email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;

    return bcrypt.hash(string, 10);
  }

  async signup(
    { email, password, name, phone }: SignupDto,
    userType: UserType,
  ) {
    const userExits = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (userExits) {
      throw new ConflictException();
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // console.log(hashedPassword);
    const user = await this.prismaService.user.create({
      data: {
        email,
        name,
        phone,
        password: hashedPassword,
        user_type: userType,
      },
    });

    const token = this.generateJwt(user.name, user.id);
    return token;
  }

  async signin({ email, password }: SignInDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new HttpException('Invalid credential', 400);
    }

    const check = await bcrypt.compare(password, user.password);

    if (!check) {
      throw new HttpException('Invalid credential password', 400);
    }

    const token = this.generateJwt(user.name, user.id);
    return token;
  }
}
