import { DateUtils } from 'src/libs/core/utils/date.utils';

/**
 * 시스테 기본 설정 값
 */
export const DefaultConfig = {
  // 스웨거 설정
  swagger: {
    title: '',
    description: '',
    version: '',
    tag: '',
  },
  // 기호
  sign: {
    arrToStringDelim: '|', // 스트링과 배열을 나누는 값
  },
  // 파일 관련설정
  files: {
    upload: {
      image: {
        path: `./files/`, // 파일 업로드 로뜨 폴드
        maxSize: 100000000, // 파일 업로드 최대 사이즈
        // 파일 저장 경로 가져오기(년/월/일)
        getUploadFilePath: (): string => {
          return `${DefaultConfig.files.upload.image.path}${DateUtils.nowString(
            'YYYY/MM/DD',
          )}`;
        },
      },
    },
    log: {
      error: {
        path: './files/error',
        name: 'ERROR',
        ext: 'err',
        getLogFileName: async (name: string): Promise<string> => {
          return `${DefaultConfig.files.log.error.name}_${name}.${DefaultConfig.files.log.error.ext}`;
        },
      },
    },
  },
  // 인증관련
  auth: {
    jwt: {
      secrete: process.env.SESSION_SECRET_KEY,
    },
  },
  security: {
    key: 'likealocalkeysecury',
  },
  redis: {
    // 레디스 접속 주소
    URL: () => `redis://${process.env.REDIS_URL}:${process.env.REDIS_PORT}`,
    KEY: process.env.SESSION_KEY,
  },
  session: {
    KEY: process.env.SESSION_KEY,
    expireTime: process.env.SESSION_TIME,
  },
};
