import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class EmailSendDto {
  /**
   * 받는 사람 메일
   */
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  to: string;

  /**
   * 메일 제목
   */
  @IsString()
  @IsNotEmpty()
  subject: string;

  /**
   * 메일 내용 HTML
   */
  @IsString()
  @IsNotEmpty()
  html: string;
}
