
const OP_TYPES = {
  PERM: 'PERMUTATIVA',
  MOD: 'MODIFICATIVA'
};

const ACC_TYPES = {
  ACT: 'ACTIVO',
  PAS: 'PASIVO',
  PAT: 'PATRIMONIAL',
  RPOS: 'RESULTADOS POSTIVOS',
  RNEG: 'RESULTADOS NEGATIVOS'
};

export function getOperationType(accounts) {
  let operationType = OP_TYPES.PERM;
  for (const account of accounts) {
    const type = account.account_types.name;
    if ([ACC_TYPES.PAT, ACC_TYPES.RPOS, ACC_TYPES.RNEG].includes(type)) {
      operationType = OP_TYPES.MOD;
    }
  }
  return operationType;
}

export function result(type, assets, debit) {

  function increase(a, accountBalance) {
    return accountBalance + a;
  }

  function decrease(a, accountBalance) {
    return accountBalance - a;
  }

  if (!(assets || debit)) {
    throw new Error('At least one of Assets or Debit must be provided.');
  }

  // http://elcontador.net/naturaleza-de-las-cuentas-contables/
  switch (type) {  // TODO - Should extract into DB to avoid this switch here.
    case ACC_TYPES.ACT: {
      if (assets) {
        return b => decrease(assets, b); // Haber/Credito -
      }
      return b => increase(debit, b); // Debe/Debito +
    }
    case ACC_TYPES.PAS: {
      if (assets) {
        return b => increase(assets, b); // Haber/Credito -
      }
      return b => decrease(debit, b); // Debe/Debito +
    }
    case ACC_TYPES.PAT: {
      if (assets) {
        return b => increase(assets, b); // Haber/Credito -
      }
      return b => decrease(debit, b); // Debe/Debito +
    }
    case ACC_TYPES.RPOS: {
      if (assets) {
        return b => increase(assets, b); // Haber/Credito +
      }
      return b => decrease(debit, b); // Debe/Debito -
    }
    case ACC_TYPES.RNEG: {
      if (assets) {
        return b => decrease(assets, b); // Haber/Credito -
      }
      return b => increase(debit, b); // Debe/Debito +
    }
  }
}
