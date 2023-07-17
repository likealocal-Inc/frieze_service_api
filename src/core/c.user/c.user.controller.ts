import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { CUserService } from './c.user.service';
import { CreateCUserDto } from './dto/create-c.user.dto';
import { UpdateCUserDto } from './dto/update-c.user.dto';
import { APIResponseObj, HttpUtils } from 'src/libs/core/utils/http.utils';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { CUserEntity } from './entities/c.user.entity';

/**
 * 사용자
 */
@Controller('c.user')
export class CUserController {
  constructor(private readonly cUserService: CUserService) {}

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
   * 사용자 전체 조회
   * @returns
   */
  @Get()
  async findAll(): Promise<APIResponseObj> {
    return HttpUtils.makeAPIResponse(true, this.cUserService.findAll());
  }

  /**
   * 사용자 아이디 조회
   * @param id
   * @returns
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<APIResponseObj> {
    return HttpUtils.makeAPIResponse(true, this.cUserService.findOne(+id));
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
    @Body() updateCUserDto: UpdateCUserDto,
  ): Promise<APIResponseObj> {
    return HttpUtils.makeAPIResponse(
      true,
      await this.cUserService.update(+id, updateCUserDto),
    );
  }
}
