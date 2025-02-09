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
    const user = await this.userModel.find({_id: id});
    if (!user) throw new NotFoundException('could not find the user');
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true
    })
  }

  remove(id: number) {
    return this.userModel.findByIdAndDelete(id);
  }
}
