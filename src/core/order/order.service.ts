import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create.order.dto';
import { UpdateOrderDto } from './dto/update.order.dto';
import { PrismaService } from 'src/config/core/prisma/prisma.service';
import { CustomException } from 'src/config/core/exceptions/custom.exception';
import { ExceptionCodeList } from 'src/config/core/exceptions/exception.code';
import { DateUtils } from 'src/libs/core/utils/date.utils';
import axios from 'axios';
import { PaymentEntity } from './entities/payment.entity';
import { OrderEntity } from './entities/order.entity';
import { SecurityUtils } from 'src/libs/core/utils/security.utils';
import { Response } from 'express';
import { Prisma } from '@prisma/client';

export enum STATUS {
  PAYMENT = 'PAYMENT',
  DISPATCH_REQUEST = 'DISPATCH_REQUEST',
  CANCEL_REQUEST = 'CANCEL_REQUEST',
  CANCEL_DONE = 'CANCEL_DONE',
  DISPATCH_DONE = 'DISPATCH_DONE',
  DONE = 'DONE',
}
export function isValidSTATUS(value: any): value is STATUS {
  return Object.values(STATUS).includes(value);
}

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async setStatus(id: string, status: string) {
    // 상태값 확인-
    if (isValidSTATUS(status) === false) {
      throw new CustomException(
        ExceptionCodeList.COMMON.WRONG_REQUEST,
        'worng status',
      );
    }

    try {
      await this.prisma.order.update({
        where: { id },
        data: { status: status },
      });
      return status;
    } catch (error) {
      throw new CustomException(ExceptionCodeList.COMMON.WRONG_REQUEST, error);
    }
  }

  /**
   * 주문생성
   * @param createOrderDto
   * @returns
   */
  async create(createOrderDto: CreateOrderDto) {
    console.log(createOrderDto);
    const { aeindifo, ...dbData } = createOrderDto;
    const data = SecurityUtils.decryptText(aeindifo);
    const dataJson = JSON.parse(data);

    // 결체 확인 -> 결제 정보가 문제가 없을때 프로세스를 진행한다.
    let paymentEntity: PaymentEntity = await this.checkPayment(
      dataJson.id,
      dataJson.authToken,
      dataJson.signature,
      dataJson.txTid,
    );

    console.log(paymentEntity);

    // 결제처리
    const paymentResult = await this.runPayment(
      dataJson.txTid,
      dataJson.authToken,
      dataJson.signature,
      paymentEntity.paymentToken,
    );

    try {
      // 주문데이터 생성
      const now = DateUtils.nowString('YYYY-MM-DD hh:mm');
      const order: OrderEntity = await this.prisma.order.create({
        data: {
          ...dbData,
          approvalDate: now,
          status: STATUS.PAYMENT.toString(),
        },
      });

      console.log(order);

      // 결제 정보 업데이트
      paymentEntity = await this.prisma.payment.update({
        where: { id: dataJson.id },
        data: {
          orderId: order.id,
          authToken: dataJson.authToken,
          signature: dataJson.authToken,
          txTid: dataJson.authToken,
          successInfo: paymentResult,
        },
      });

      return order;
    } catch (err) {
      console.log(err);
    }

    // paymentEntity = await this.payresult(
    //   dataJson.authToken,
    //   dataJson.signature,
    //   dataJson.txTid,
    //   paymentEntity.paymentToken,
    //   order.id,
    //   dataJson.id,
    // );
  }

  /**
   * 결제정보 업데이트
   * @param orderId
   * @param paymentData
   */
  // async updatePayment(orderId: string, paymentData: string) {
  //   const data = SecurityUtils.decryptText(paymentData);
  //   const dataJson = JSON.parse(data);
  //   this.payresult(
  //     dataJson.id,
  //     dataJson.authToken,
  //     dataJson.signature,
  //     dataJson.txTid,
  //     orderId,
  //   );
  // }

  /**
   * 사용자 아이디로 주문
   * @param userId
   * @returns
   */
  async findByUserId(userId: string) {
    try {
      return await this.prisma.order.findMany({
        where: { userId },
        orderBy: { created: 'desc' },
      });
    } catch (error) {
      throw new CustomException(ExceptionCodeList.COMMON.WRONG_REQUEST, error);
    }
  }

  /**
   * 아이디로 조회
   * @param id
   * @returns
   */
  async findById(id: string) {
    try {
      return await this.prisma.order.findFirst({ where: { id } });
    } catch (error) {
      throw new CustomException(ExceptionCodeList.COMMON.WRONG_REQUEST, error);
    }
  }

  /**
   * 주문 업데이트하기
   * @param id
   * @param updateOrderDto
   * @returns
   */
  async update(id: string, updateOrderDto: UpdateOrderDto) {
    try {
      return await this.prisma.order.update({
        where: { id },
        data: updateOrderDto,
      });
    } catch (error) {
      throw new CustomException(ExceptionCodeList.COMMON.WRONG_REQUEST, error);
    }
  }

  async paymentInit(price, email, tempKey) {
    const payInfoCount = await this.prisma.payment.count({
      where: { email, tempKey },
    });
    if (payInfoCount > 0) {
      return false;
    }
    const res: any = await axios.post(
      `${process.env.PAYMENT_URL}/api/nicepay/payment`,
      {
        currencyCode: 'USD', // 원화 결제 (KRW) / 달러 결제 (USD)
        amt: price, // 100원 결제 신청
        type: 'GLOBAL_CARD', // 국내 카드 (ko) 해외카드 (en)
      },
      {
        headers: {
          authorization: process.env.PAYMENT_KEY,
          'Content-Type': 'application/json',
        },
      },
    );
    const dbRea = await this.prisma.payment.create({
      data: { ...res.data.data, email, tempKey },
    });
    return dbRea;
  }

  /**
   * 결제 체크하기
   * @param id
   * @param authToken
   * @param signature
   * @param txTid
   * @param orderId
   */
  async checkPayment(paymentId, authToken, signature, txTid) {
    const paymentInfo: PaymentEntity = await this.prisma.payment.findFirst({
      where: { id: paymentId },
    });
    if (paymentInfo === null || paymentInfo === undefined) {
      throw new CustomException(
        ExceptionCodeList.PAYMENT.WRONG,
        '결제진행을 위한 결제메타정보가 없음',
      );
    }

    // 결제 확인전 검증
    const res2: any = await axios.post(
      `${process.env.PAYMENT_URL}/api/nicepay/verification/sign`,
      {
        authToken: authToken,
        currencyCode: 'USD',
        amt: paymentInfo.amt,
        type: 'GLOBAL_CARD',
      },
      {
        headers: {
          authorization: process.env.PAYMENT_KEY,
          'Content-Type': 'application/json',
        },
      },
    );

    console.log('--------------------------');
    console.log(res2.data);
    console.log('--------------------------');

    if (res2.data.ok === false) {
      console.log('fail');
      console.log(res2.data);
      throw new CustomException(
        ExceptionCodeList.PAYMENT.WRONG,
        `결제검증오류[${res2.data}]`,
      );
    }

    console.log(res2.data.data);
    console.log(paymentId, authToken, signature, txTid);
    if (res2.data.data !== signature) {
      console.log('fail - 2');
      console.log(res2.data);
      throw new CustomException(
        ExceptionCodeList.PAYMENT.WRONG,
        `결제검증오류 signature불일치 [${res2.data}]`,
      );
    }

    return paymentInfo;
  }

  async runPayment(txTid, authToken, signature, paymentToken) {
    try {
      const res3: any = await axios.post(
        `${process.env.PAYMENT_URL}/api/nicepay/auth`,
        {
          txTid: txTid,
          authToken: authToken,
          signature: signature,
          paymentToken: paymentToken,
        },
        {
          headers: {
            authorization: process.env.PAYMENT_KEY,
            'Content-Type': 'application/json',
          },
        },
      );
      console.log(res3);

      if (res3.data.ok === false) {
        throw new CustomException(
          ExceptionCodeList.PAYMENT.WRONG,
          `결제오류-[${res3.data}]`,
        );
      }

      return JSON.stringify(res3.data);
    } catch (err) {
      throw new CustomException(
        ExceptionCodeList.PAYMENT.WRONG,
        err.response.data.data.description.codeMessage,
      );
    }
  }

  async payresult(
    authToken,
    signature,
    txTid,
    paymentToken,
    orderId,
    paymentId,
  ) {
    try {
      // 실제 결제 처리
      const res3: any = await axios.post(
        `${process.env.PAYMENT_URL}/api/nicepay/auth`,
        {
          txTid: txTid,
          authToken: authToken,
          signature: signature,
          paymentToken: paymentToken,
        },
        {
          headers: {
            authorization: process.env.PAYMENT_KEY,
            'Content-Type': 'application/json',
          },
        },
      );

      let res;
      if (res3.data.ok === true) {
        res = await this.prisma.payment.update({
          where: { id: paymentId },
          data: {
            orderId,
            authToken,
            signature,
            txTid,
            successInfo: JSON.stringify(res3.data),
          },
        });
        return res;
      } else {
        throw new CustomException(
          ExceptionCodeList.PAYMENT.WRONG,
          `결제처리오류`,
        );
      }
    } catch (err) {
      throw new CustomException(
        ExceptionCodeList.PAYMENT.WRONG,
        err.response.data.data.description.codeMessage,
      );
    }
  }

  async paymentCancel(id) {
    try {
      const paymentEntity = await this.prisma.payment.findFirst({
        where: { id },
      });

      // 실제 결제 처리
      const res: any = await axios.post(
        `${process.env.PAYMENT_URL}/api/nicepay/cancel`,
        {
          moid: paymentEntity.moid,
          cancelMsg: 'string',
          cancelAmt: paymentEntity.amt,
        },
        {
          headers: {
            authorization: process.env.PAYMENT_KEY,
            'Content-Type': 'application/json',
          },
        },
      );

      const resData = res.data;
      console.log(resData);
      if (resData.ok) {
        // 취소 성공 후 처리
        await this.prisma.$transaction(async (tx) => {
          // 취소정보 추가
          await tx.payment.update({
            where: { id },
            data: { cancelInfo: JSON.stringify(resData) },
          });

          // 취소상태값 업데이트
          await tx.order.update({
            where: { id: paymentEntity.orderId },
            data: { status: 'CANCEL' },
          });
        });

        return resData;
      } else {
        console.log(resData);
        throw new CustomException(
          ExceptionCodeList.PAYMENT.WRONG,
          resData.data.description.codeMessage,
        );
      }
    } catch (err) {
      console.log(err.response.data);
      throw new CustomException(
        ExceptionCodeList.PAYMENT.WRONG,
        err.response.data.data.description.codeMessage,
      );
    }
  }
}
