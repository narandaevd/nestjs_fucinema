import { HttpStatus } from "@nestjs/common";

export const FILMS_TAG = 'films';
export const RATING_TAG = 'rating';
export const REPORTS_TAG = 'reports';
export const COMPANIES_TAG = 'companies';
export const ACTORS_TAG = 'actors';
export const USERS_TAG = 'users';

export const HttpCodes = {
  ...HttpStatus,
  WEB_SERVER_IS_DOWN: 521,
};
