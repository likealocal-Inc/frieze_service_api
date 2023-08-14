import { Injectable } from '@nestjs/common';
import { CreateCUserDto } from './dto/create.user.dto';
import { CUserEntity } from './entities/c.user.entity';
import { PrismaService } from 'src/config/core/prisma/prisma.service';
import { CustomException } from 'src/config/core/exceptions/custom.exception';
import { ExceptionCodeList } from 'src/config/core/exceptions/exception.code';
import { SecurityUtils } from 'src/libs/core/utils/security.utils';
import { UpdateAuthUserDto } from './dto/update.auth.user.dto';
import { EmailService } from '../mail/email.service';
import { Files } from 'src/config/core/files/files';
import { CreateCManagerDto } from './dto/create.manager.dto';
import { ManagerEntity } from './entities/manager.entity';
import { DateUtils } from 'src/libs/core/utils/date.utils';

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
  async checkEmail(email: string): Promise<CUserEntity> {
    console.log(email);
    try {
      // 이메일 복호화
      const emailStr = SecurityUtils.decryptText(email);

      const user = await this.prisma.user.findFirst({
        where: { email: emailStr },
      });
      return user;
    } catch (error) {
      console.log(error);
      throw new CustomException(ExceptionCodeList.COMMON.WRONG_REQUEST, error);
    }
  }

  async list(page, size) {
    const users = await this.prisma.user.findMany({
      skip: page * size,
      take: size,
      orderBy: { created: 'desc' },
    });
    const total = await this.prisma.user.count();
    const totalPage = Math.ceil(total / size);

    return {
      page,
      size,
      total,
      totalPage,
      data: users,
    };
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
            phone: SecurityUtils.decryptText(createCUserDto.phone),
            isAuth: false,
          },
        });

        await this.sendAuthMail(
          user.name,
          user.email,
          createCUserDto.authUrl,
          user.id,
        );

        // const file = new Files();
        // let data = await file.read('./static/mail.html');

        // data = data.replace('__NAME__', user.name);
        // data = data.replace(
        //   '__AUTHURL__',
        //   `${createCUserDto.authUrl}?${user.id}`,
        // );

        // this.emailService.authEmail2(user.email, data);

        return user;
      }
    } catch (error) {
      throw new CustomException(ExceptionCodeList.COMMON.WRONG_REQUEST, error);
    }
  }

  async sendAuthEmail(userEmailStr: string, authUrlStr: string) {
    try {
      const userEmail = SecurityUtils.decryptText(userEmailStr);
      const authUrl = SecurityUtils.decryptText(authUrlStr);
      const user = await this.prisma.user.findFirst({
        where: { email: userEmail },
      });
      await this.sendAuthMail(user.name, user.email, authUrl, user.id);
      return true;
    } catch (error) {
      throw new CustomException(ExceptionCodeList.COMMON.WRONG_REQUEST, error);
    }
  }

  async sendAuthMail(name: string, email: string, authUrl, userId: string) {
    const file = new Files();
    let data = await file.read('./static/mail.html');

    data = data.replace('__NAME__', name);
    data = data.replace('__AUTHURL__', `${authUrl}?${userId}`);

    this.emailService.authEmail2(email, data);
  }

  /**
   * 사용자 찾기
   * @param i
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

  /**
   * 관리자 추가
   * @param managerDto
   * @returns
   */
  async addManager(managerDto: CreateCManagerDto) {
    managerDto.password = SecurityUtils.encryptText(managerDto.password);
    const manager: ManagerEntity = await this.prisma.manager.create({
      data: managerDto,
    });
    manager.password = '';
    return manager;
  }

  /**
   * 관리자 로그인
   * @param email
   * @param password
   * @returns
   */
  async loginManager(email, password) {
    const manager = await this.prisma.manager.findFirst({
      where: { email, password: SecurityUtils.encryptText(password) },
    });
    if (manager === undefined || manager === null) {
      throw new CustomException(ExceptionCodeList.MANAGER.FAIL_LOGIN);
    }
    await this.prisma.manager.update({
      where: { id: manager.id },
      data: { lastLoginDate: DateUtils.nowString('YYYY-MM-DD hh:mm') },
    });
    manager.password = '';
    return manager;
  }
}
