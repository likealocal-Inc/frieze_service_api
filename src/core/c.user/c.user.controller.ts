import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { CUserService } from './c.user.service';
import { CreateCUserDto } from './dto/create.user.dto';
import { APIResponseObj, HttpUtils } from 'src/libs/core/utils/http.utils';
import { UpdateAuthUserDto } from './dto/update.auth.user.dto';
import { CustomException } from 'src/config/core/exceptions/custom.exception';
import { ExceptionCodeList } from 'src/config/core/exceptions/exception.code';
import { CreateCManagerDto } from './dto/create.manager.dto';

/**
 * 사용자
 */
@Controller('c.user')
export class CUserController {
  constructor(private readonly cUserService: CUserService) {}

  /**
   * 이메일 체크
   * @param body
   * @returns
   */
  @Post('check.email')
  async checkEmail(@Body() body: any) {
    const email = body.email;
    return HttpUtils.makeAPIResponse(
      true,
      await this.cUserService.checkEmail(email),
    );
  }
  /**
   * 사용자 추가
   * @param createCUserDto
   * @returns
   */
  @Post()
  async create(
    @Body() createCUserDto: CreateCUserDto,
  ): Promise<APIResponseObj> {
    const res = await this.cUserService.create(createCUserDto);
    return HttpUtils.makeAPIResponse(true, res);
  }

  /**
   * 사용자 아이디 조회
   * @param id
   * @returns
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<APIResponseObj> {
    const res = HttpUtils.makeAPIResponse(
      true,
      await this.cUserService.findById(id),
    );
    return res;
  }

  @Get('list/:page/:size')
  async listUser(@Param('page') page, @Param('size') size) {
    console.log(page, size);
    try {
      const res = HttpUtils.makeAPIResponse(
        true,
        await this.cUserService.list(+page, +size),
      );
      return res;
    } catch (error) {
      console.log(error);
      throw new CustomException(ExceptionCodeList.COMMON.WRONG_REQUEST);
    }
  }

  /**
   * 이메일로 조회
   * @param email
   * @returns
   */
  @Get('email/:email')
  async findByEmail(@Param('email') email: string): Promise<APIResponseObj> {
    const res = HttpUtils.makeAPIResponse(
      true,
      await this.cUserService.findByEmail(email),
    );
    return res;
  }

  @Patch('send.auth.email')
  async sendAuthMail(@Body() body: any): Promise<APIResponseObj> {
    const res = HttpUtils.makeAPIResponse(
      true,
      await this.cUserService.sendAuthEmail(body.skdidd, body.kfkkdm),
    );
    return res;
  }
  /**
   * 사용자 업데이
   * @param id
   * @param updateCUserDto
   * @returns
   */
  @Patch()
  async updateAuth(
    @Body() updateCUserDto: UpdateAuthUserDto,
  ): Promise<APIResponseObj> {
    return HttpUtils.makeAPIResponse(
      true,
      await this.cUserService.updateAuth(updateCUserDto),
    );
  }

  /**
   * 관리자 추가
   * @param manager
   * @returns
   */
  @Post('manager/add')
  async addManager(@Body() manager: CreateCManagerDto) {
    return HttpUtils.makeAPIResponse(
      true,
      await this.cUserService.addManager(manager),
    );
  }

  /**
   * 관리자 로그인
   * @param body
   * @returns
   */
  @Post('manager/login')
  async loginManager(@Body() body: any) {
    return HttpUtils.makeAPIResponse(
      true,
      await this.cUserService.loginManager(body.email, body.password),
    );
  }
}
