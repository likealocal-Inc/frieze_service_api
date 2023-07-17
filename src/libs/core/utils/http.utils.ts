export interface APIResponseObj {
  ok: boolean;
  data: any;
}

/**
 * Http Util
 */
export const HttpUtils = {
  /**
   * API 리턴데이터 생성
   * @param ok
   * @param data
   * @returns
   */
  makeAPIResponse: (ok, data = null): APIResponseObj => {
    return { ok, data };
  },
};
