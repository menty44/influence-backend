import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {

  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async create(createUserDto: CreateUserDto) {
    const user = await this.userModel.create(createUserDto);
    return user.save();
  }

  findAll() {
    const users = this.userModel.find();
    return users;
  }

  async findOne(id: string) {
    const user = await this.userModel.findOne({_id: id});
    if (!user) throw new NotFoundException('could not find the user');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const checkUser = await this.userModel.findOne({_id: id});
    if (!checkUser) throw new NotFoundException('could not find the user');
    return this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true
    })
  }

  async remove(id: string) {
    const checkUser = await this.userModel.findOne({_id: id});
    if (!checkUser) throw new NotFoundException('could not find the user');
    return this.userModel.findByIdAndDelete(id);
  }
}
