import { Concepto } from './Concepto';

export class ConceptoCalculado {

  private readonly _concepto: Concepto;
  private readonly _calculo: number;
  private gids: Set<string>;

  constructor(concepto: Concepto) {
    this._concepto = concepto;
    this.gids = new Set<string>([this.grupo, this.subGrupo]);
    this._calculo = concepto.calcular();
  }

  get grupo(): string {
    return this._concepto.grupo;
  }

  get subGrupo(): string {
    return this._concepto.subGrupo;
  }

  get concepto(): Concepto {
    return this._concepto;
  }

  get calculo(): number {
    return this._calculo;
  }

  matches(gids: string[]) {
    for (const gid of gids) {
      if (this.gids.has(gid)) {
        return true;
      }
    }
    return false;
  }

}
