import { balance, result } from '../handlers/util/economy';

describe('Economy Util', () => {

  it('should calculate correct addition/subtraction for each account type', () => {
    const intialValue = 2000;
    const asset = 1000;
    const debit = 1000;

    expect(result('PATRIMONIAL', asset, undefined)(intialValue)).toBe(3000); // +
    expect(result('PATRIMONIAL', undefined, debit)(intialValue)).toBe(1000); // -

    expect(result('ACTIVO', asset, undefined)(intialValue)).toBe(1000); // -
    expect(result('ACTIVO', undefined, debit)(intialValue)).toBe(3000); // +

    expect(result('PASIVO', asset, undefined)(intialValue)).toBe(3000); // +
    expect(result('PASIVO', undefined, debit)(intialValue)).toBe(1000); // -

    expect(result('RESULTADOS POSITIVOS', asset, undefined)(intialValue)).toBe(3000); // +
    expect(result('RESULTADOS POSITIVOS', undefined, debit)(intialValue)).toBe(1000); // -

    expect(result('RESULTADOS NEGATIVOS', asset, undefined)(intialValue)).toBe(1000); // -
    expect(result('RESULTADOS NEGATIVOS', undefined, debit)(intialValue)).toBe(3000); // +
  });

});
