import {Param, ParseUUIDPipe} from "@nestjs/common";

export const UuidParam = () => Param('uuid', ParseUUIDPipe);
