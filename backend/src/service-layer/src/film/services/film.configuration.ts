import {Injectable} from "@nestjs/common";
import {BaseConfiguration} from "../../../../config";
import {FilmConfig} from "../film.config";

@Injectable()
export class FilmConfiguration extends BaseConfiguration<FilmConfig> {}
