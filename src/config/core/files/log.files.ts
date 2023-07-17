import { DefaultConfig } from 'src/config/default.config';
import { Files } from './files';
import { DateUtils } from 'src/libs/core/utils/date.utils';

/**
 * 로그파일처리 유틸
 */

export class LogFiles {
  // 로그파일 저장 경로
  file: Files;
  path: string;

  constructor() {
    this.file = new Files();
    this.path = DefaultConfig.files.log.error.path;
  }

  /**
   * 로그파일 저장
   * @param data
   * @param fileName
   */
  async save(data: string) {
    // 에러파일명(연월일)
    const name = DateUtils.nowString('YYYYMMDD');
    const fileName: string = await DefaultConfig.files.log.error.getLogFileName(
      name,
    );

    //연월일 폴더
    const newPath = `${this.path}/${DateUtils.nowString('YYYY/MM/DD')}`;

    //에러 메세지에 일시 추가
    const date = DateUtils.nowString('YYYY/MM/DD hh:mm:ss');
    await this.file.write(newPath, fileName, `[${date}]${data}\n`);
  }

  /**
   * 해당 경로페 파일 리스트가져오기
   * @param path
   * @returns
   */
  async getLogFileList() {
    return await this.file.getFiles(this.path);
  }
}
