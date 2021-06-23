
const OP_TYPES = {
  PERM: 'PERMUTATIVA',
  MOD: 'MODIFICATIVA'
};

const ACC_TYPES = {
  ACT: 'ACTIVO',
  PAS: 'PASIVO',
  PAT: 'PATRIMONIAL',
  RPOS: 'RESULTADOS POSITIVOS',
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

export function result(type: string, assets: number, debit: number) {

  function increase(a, accountBalance) {
    return accountBalance + a;
  }

  function decrease(a, accountBalance) {
    return accountBalance - a;
  }

  function exists(value) {
    return value !== undefined && value !== null;
  }

  if (assets === undefined && debit === undefined) {
    throw new Error('At least one of Assets or Debit must be provided.');
  }

  // http://elcontador.net/naturaleza-de-las-cuentas-contables/
  switch (type) {  // TODO - Should extract into DB to avoid this switch here.
    case ACC_TYPES.ACT: {
      if (exists(assets)) {
        return b => decrease(assets, b); // Haber/Credito -
      }
      return b => increase(debit, b); // Debe/Debito +
    }
    case ACC_TYPES.PAS: {
      if (exists(assets)) {
        return b => increase(assets, b); // Haber/Credito -
      }
      return b => decrease(debit, b); // Debe/Debito +
    }
    case ACC_TYPES.PAT: {
      if (exists(assets)) {
        return b => increase(assets, b); // Haber/Credito -
      }
      return b => decrease(debit, b); // Debe/Debito +
    }
    case ACC_TYPES.RPOS: {
      if (exists(assets)) {
        return b => increase(assets, b); // Haber/Credito +
      }
      return b => decrease(debit, b); // Debe/Debito -
    }
    case ACC_TYPES.RNEG: {
      if (exists(assets)) {
        return b => decrease(assets, b); // Haber/Credito -
      }
      return b => increase(debit, b); // Debe/Debito +
    }
    default:
      console.log(type, 'Not found');
  }
}

interface DetailedAccount {
  account_types: {
    name: string
  };
  account_balance: number;
  entry_seat_lines: {
    assets: number,
    debit: number,
    entry_seats: {
      description: string
    }
  }[];
}

interface SummarizedAccountLine {
  description: string;
  balance: number;
  assets: number;
  debit: number;
}

const sumAssets = (account: DetailedAccount) => account.entry_seat_lines.reduce((total, account) => total + account.assets, 0);
const sumDebit = (account: DetailedAccount) => account.entry_seat_lines.reduce((total, account) => total + account.debit, 0);

export function balance(type: string, assets: number, debit: number, current: number) {
  return result(type, undefined, assets)(result(type, debit, undefined)(current));
}

export function accountSummary(account: DetailedAccount) : SummarizedAccountLine[] {
  const totalAssets = sumAssets(account);
  const totalDebit = sumDebit(account);
  const type = account.account_types.name;
  const initialBalance = balance(type, totalAssets, totalDebit, account.account_balance);
  const initial = {
    description: 'Inicial',
    balance: initialBalance,
    assets: null,
    debit: null
  };
  const summary = [initial];
  let currentBalance = initialBalance;
  for (const line of account.entry_seat_lines) {
    currentBalance = result(type, line.assets, line.debit)(currentBalance);
    summary.push({
      description: line.entry_seats.description,
      assets: line.assets,
      debit: line.debit,
      balance: currentBalance
    });
  }
  const final = {
    description: 'Saldo Final',
    balance: account.account_balance,
    assets: null,
    debit: null
  };
  summary.push(final);
  return summary;
}
