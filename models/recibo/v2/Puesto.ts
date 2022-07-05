export class Puesto {

  nombre: string;
  categoria: Categoria;
  sueldo: number;

  getSueldo() : number {
    return this.categoria.calcularAumento(this.sueldo);
  }

}

export class Categoria {

  nombre: string;
  aumentoFijo: number;
  aumentoPorc: number;

  calcularAumento(sueldo: number) : number {
    let res : number = sueldo;
    if (this.aumentoFijo && this.aumentoFijo !== 0) {
      res += this.aumentoFijo;
    }
    if (this.aumentoPorc && this.aumentoPorc !== 0) {
      res += ((res * this.aumentoPorc) / 100);
    }
    return res;
  }

}
