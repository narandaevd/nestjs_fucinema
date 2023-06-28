import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsLessThan(comparingWith: number, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isLessThan',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'number' && 
            typeof comparingWith === 'number' &&
            value < comparingWith;
        },
        defaultMessage() {
          return `Оценка должна быть меньше, чем ${comparingWith}`;
        }
      },
    });
  };
}
