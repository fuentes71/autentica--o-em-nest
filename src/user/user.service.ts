import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
@Injectable()
export class UserService {

  constructor(private readonly prisma: PrismaService) { }
  async create(createUserDto: CreateUserDto) {
    const { email, name, password } = createUserDto

    const foundByEmail = await this.prisma.user.findUnique({
      where: { email },
    });

    if (foundByEmail) { throw new ConflictException("Este email já está cadastrado.") }


    const createdUser = await this.prisma.user.create({
      data: { email, name, password: await bcrypt.hash(password, 10) }
    });

    return {
      ...createdUser,
      password: undefined
    };
  }

  findByEmail(email: string) {
    const foundByEmail = this.prisma.user.findUnique({
      where: { email },
    })

    if (!foundByEmail) throw new NotFoundException("Email não encontrado.")

    return foundByEmail;
  }
}
