import * as Yup from 'yup';
import { parse } from 'date-fns';
import Variables from '@model/recibo/v2/Variables';

export default function Validation(i18n, reference) {

  const validateDate = (value, context) => {
    const date = parse(value, 'dd/MM/yyyy', reference);
    return !isNaN(date.getTime());
  };

  function String(message: string) {
    return Yup.string().required(i18n(message));
  }

  function CUIL(message: string) { // 'XX-XXXXXXXX-X format!'
    return String(message)
      .matches(/\d{2}-\d{6,8}-\d/, i18n('bad.cuil.format'), { excludeEmptyString: true });
  }

  function Date(message: string) { //  'DD/MM/AAAA format!'
    return String(message)
      .matches(/\d{2}\/\d{2}\/\d{4}/, i18n('bad.date.format'))
      .test('is-date', i18n('invalid.date'), validateDate);
  }

  function Email(message: string) {
    return String(message).email(i18n('bad.email.format'));
  }

  function Number(message: string) {
    return Yup.number().notRequired().positive(i18n(message));
  }

  function NumberOrPlaceholder(message: string) {
    return Yup.string().test('is-number-or-pc', i18n(message), (value, context) => {
      if (isNaN(value)) {
        return Variables.isValid(value);
      }
      return true;
    });
  }

  return {
    String,
    CUIL,
    Date,
    Email,
    Number,
    NumberOrPlaceholder,
  };

}
