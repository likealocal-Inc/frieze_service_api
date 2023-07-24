import { Injectable } from '@nestjs/common';
import { CreateCUserDto } from './dto/create.user.dto';
import { CUserEntity } from './entities/c.user.entity';
import { PrismaService } from 'src/config/core/prisma/prisma.service';
import { CustomException } from 'src/config/core/exceptions/custom.exception';
import { ExceptionCodeList } from 'src/config/core/exceptions/exception.code';
import { SecurityUtils } from 'src/libs/core/utils/security.utils';
import { UpdateAuthUserDto } from './dto/update.auth.user.dto';
import { EmailService } from '../mail/email.service';
import { ElseUtils } from 'src/libs/core/utils/else.utils';
import { promises as fs } from 'fs';
import { Files } from 'src/config/core/files/files';

@Injectable()
export class CUserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * 이메일 여부 확인
   * @param email
   * @returns
   */
  async checkEmail(email: string): Promise<boolean> {
    try {
      // 이메일 복호화
      const emailStr = await SecurityUtils.decryptText(email);
      console.log(emailStr);

      const count = await this.prisma.user.count({
        where: { email: emailStr },
      });
      console.log(count);
      if (count > 0) return true;
      return false;
    } catch (error) {
      throw new CustomException(ExceptionCodeList.COMMON.WRONG_REQUEST, error);
    }
  }

  /**
   * 사용자 생성
   * @param createCUserDto
   * @returns
   */
  async create(createCUserDto: CreateCUserDto): Promise<CUserEntity> {
    try {
      // 사용자 존재 하는지 이메일로 확인
      const users: CUserEntity[] = await this.prisma.user.findMany({
        where: { email: createCUserDto.email },
      });

      if (users.length > 0) {
        throw new CustomException(ExceptionCodeList.USER.ALREADY_EXIST_USER);
      } else {
        const user = await this.prisma.user.create({
          data: {
            name: SecurityUtils.decryptText(createCUserDto.name),
            email: SecurityUtils.decryptText(createCUserDto.email),
            isAuth: false,
          },
        });

        const file = new Files();
        let data = await file.read('./static/mail.html');

        data = data.replace('__NAME__', user.name);
        data = data.replace(
          '__AUTHURL__',
          `${createCUserDto.authUrl}?${user.id}`,
        );

        this.emailService.authEmail2('hanblues@gmail.com', data);

        return user;
      }
    } catch (error) {
      throw new CustomException(ExceptionCodeList.COMMON.WRONG_REQUEST, error);
    }
  }

  /**
   * 사용자 찾기
   * @param id
   * @returns
   */
  async findById(id: string): Promise<CUserEntity> {
    try {
      return await this.prisma.user.findFirst({
        where: { id },
      });
    } catch (error) {
      throw new CustomException(ExceptionCodeList.COMMON.WRONG_REQUEST, error);
    }
  }

  /**
   * 이메일로 찾기
   * @param email
   * @returns
   */
  async findByEmail(email: string): Promise<CUserEntity> {
    try {
      return await this.prisma.user.findUnique({ where: { email } });
    } catch (error) {
      throw new CustomException(ExceptionCodeList.COMMON.WRONG_REQUEST, error);
    }
  }

  /**
   *
   * @param updateCUserDto
   * @returns
   */
  // 인증 여부 업데이트
  async updateAuth(updateCUserDto: UpdateAuthUserDto): Promise<CUserEntity> {
    try {
      return await this.prisma.user.update({
        where: { id: updateCUserDto.id },
        data: { isAuth: updateCUserDto.isAuth },
      });
    } catch (error) {
      throw new CustomException(ExceptionCodeList.COMMON.WRONG_REQUEST, error);
    }
  }
}
