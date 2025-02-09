import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/entities/user.entity';
import { LoginDto } from './dto/login.dto';

import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  async checkEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  async signUp(signupDto: CreateAuthDto) {
    const { firstname, lastname, role, gender,email, password } = signupDto;

    const existingUser = await this.checkEmail(email);

    if (existingUser) {
      throw new UnauthorizedException('email already exists');
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      firstname,
      lastname,
      gender,
      role,
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = await this.jwtService.sign(
      { id: user.id },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRES'),
      },
    );

    return { token };
  }


  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({
      email,
    });

    if (!user) throw new UnauthorizedException('invalid email or password');

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      throw new UnauthorizedException('invalid email or password');

    const token = await this.jwtService.sign(
      { id: user.id },
      {
        secret: this.configService.get('JWT_SECRET'),
      },
    );
    return { token };
  }
}
