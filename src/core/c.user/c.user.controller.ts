import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { CUserService } from './c.user.service';
import { CreateCUserDto } from './dto/create.user.dto';
import { APIResponseObj, HttpUtils } from 'src/libs/core/utils/http.utils';
import { UpdateAuthUserDto } from './dto/update.auth.user.dto';

/**
 * 사용자
 */
@Controller('c.user')
export class CUserController {
  constructor(private readonly cUserService: CUserService) {}

  @Post('check.email')
  async checkEmail(@Body() body: any) {
    const email = body.email;
    return this.cUserService.checkEmail(email);
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
    console.log(createCUserDto);
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

  /**
   * 사용자 업데이트
   * @param id
   * @param updateCUserDto
   * @returns
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCUserDto: UpdateAuthUserDto,
  ): Promise<APIResponseObj> {
    return HttpUtils.makeAPIResponse(
      true,
      await this.cUserService.updateAuth(updateCUserDto),
    );
  }
}
