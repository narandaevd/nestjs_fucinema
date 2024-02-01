import { applyDecorators } from "@nestjs/common";
import { ApiResponse } from "@nestjs/swagger";
import { HttpCodes } from "../consts";

export function ApiWebServerIsDownResponse() {
  return applyDecorators(
    ApiResponse({
      status: HttpCodes.WEB_SERVER_IS_DOWN,
    })
  );
}
