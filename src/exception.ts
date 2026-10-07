import { Status } from './status.ts';

export class HttpException extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = new.target.name;
    this.status = status;
  }
}

export class BadRequestException extends HttpException {
  constructor(message: string) {
    super(Status.BAD_REQUEST, message);
  }
}

export class BadGatewayException extends HttpException {
  constructor(message: string) {
    super(Status.BAD_GATEWAY, message);
  }
}
