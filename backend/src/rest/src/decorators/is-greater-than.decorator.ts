import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsGreaterThan(comparingWith: number, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isGreaterThan',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'number' && 
            typeof comparingWith === 'number' &&
            value > comparingWith;
        },
        defaultMessage() {
          return `Оценка должна быть больше, чем ${comparingWith}`;
        },
      },
    });
  };
}
