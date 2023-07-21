import { Injectable } from '@nestjs/common';
import { CustomException } from 'src/config/core/exceptions/custom.exception';
import { ExceptionCodeList } from 'src/config/core/exceptions/exception.code';
import { PrismaService } from 'src/config/core/prisma/prisma.service';

@Injectable()
export class InfoService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne() {
    try {
      let info = await this.prisma.info.findFirst();
      if (info === null || info === undefined) {
        info = await this.prisma.info.create({
          data: { exchangeRate: 1270, else01: '', else02: '' },
        });
      }
      return info;
    } catch (error) {
      throw new CustomException(ExceptionCodeList.COMMON.WRONG_REQUEST, error);
    }
  }
}
