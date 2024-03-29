export function numeroALetras(n) {

    //***** CONFIGURACIÓN ****
    // UDS - Pesos MX - Pesos colombianos etc. determina la etiqueta de la moneda
    const moneda = "";
    // puedes usar "con" o "y" Chiquipesos - centavos etc.
    const cents  = ["con", "Centavos"];
    // 1 = Todo minúsculas, 2 = Todo Mayúsculas, 3 = Title case moneda Mayúscula,
    // 4 = Todo minúculas y moneda Mayúscula, 0 = Camel Case
    const format = 3

    // Variables
    const temp = [moneda , 'Mil', 'Millones', 'Mil'];
    const tem = Number.parseFloat(n).toFixed(2).split('.');
    const x = Number.parseInt(tem[0]);
    const y = Number.parseInt(tem[1]);
    let salidaEntero = [];
    let salidaCentavos = ''

    const centenas = (num) =>{
        const centena = Math.floor(num / 100);
        const decena = num - (Math.floor(centena * 100));
        // console.log("centena:",centena,"decena", decena);
        switch(centena){
            case 0: return '' + decenas(decena);
            case 1:
                if (decena === 0){
                    return 'Cien';
                } else{
                    return 'Ciento ' + decenas(decena);
                }
            case 2: return 'Doscientos ' + decenas(decena);
            case 3: return 'Trecientos ' + decenas(decena);
            case 4: return 'Cuatrocientos ' + decenas(decena);
            case 5: return 'Quinientos ' + decenas(decena);
            case 6: return 'Seiscientos ' + decenas(decena);
            case 7: return 'Setecientos ' + decenas(decena);
            case 8: return 'Ochocientos ' + decenas(decena);
            case 9: return 'Novecientos ' + decenas(decena);
        }
    }

    const decenas = (num) =>{
        const decena = Math.floor(num /10);
        const unidad = num - (decena * 10);
        // console.log("decenas:",decena,"unidades:", unidad);
        switch(decena) {
            case 0: return '' + unidades(unidad);
            case 1:
                switch(unidad){
                    case 0: return 'Diez'
                    case 1: return 'Once'
                    case 2: return 'Doce'
                    case 3: return 'Trece'
                    case 4: return 'Catorce'
                    case 5: return 'Quince'
                    default: return "Dieci" + unidades(unidad);
                }
            case 2:
                switch(unidad){
                    case 0: return 'Veinte';
                    default: return 'Veinti' + unidades(unidad);
                }
            case 3: return (unidad>0) ? `Treinta y ${unidades(unidad)}`:'Treinta';
            case 4: return (unidad>0) ? `Cuarenta y ${unidades(unidad)}`:'Cuarenta';
            case 5: return (unidad>0) ? `Cincuenta y ${unidades(unidad)}`:'Cincuenta';
            case 6: return (unidad>0) ? `Sesenta y ${unidades(unidad)}`:'Sesenta';
            case 7: return (unidad>0) ? `Setenta y ${unidades(unidad)}`:'Setenta';
            case 8: return (unidad>0) ? `Ochenta y ${unidades(unidad)}`:'Ochenta';
            case 9: return (unidad>0) ? `Noventa y ${unidades(unidad)}`:'Noventa';
        }

    }

    const unidades = (num) =>{
        // console.log("unidades:",num);
        switch(num) {
            case 0: return '';
            case 1: return 'Un';
            case 2: return 'Dos';
            case 3: return 'Tres';
            case 4: return 'Cuatro';
            case 5: return 'Cinco';
            case 6: return 'Seis';
            case 7: return 'Siete';
            case 8: return 'Ocho';
            case 9: return 'Nueve';
        }

    }

    const separadorMiles = (num) =>{
        const exp = /(\d)(?=(\d{3})+(?!\d))/g;
        const rep = '$1,';
        let arr = num.toString().split('.');
        arr[0] = arr[0].replace(exp,rep);
        // return arr[1] ? arr.join('.'): arr[0];
        return arr[0];
    }

    const procesadorEnteros = (num) =>{
        let separado = separadorMiles(num).split(',')
        // console.log(separadorMiles(num));
        separado.reverse().forEach((el, index) =>{
            // console.log(el);
            // console.log(centenas(Number.parseInt(el)));
            // console.log(temp[index])
            if (el == 1 && temp[index] === "Millones"){
                salidaEntero.push("Millón")
            } else if (el == '000' && temp[index] === "Mil"){
                // no hace nada
            } else {
                salidaEntero.push(temp[index])
            }
            salidaEntero.push(centenas(Number.parseInt(el)))
        })
        // console.log(salidaEntero);
    }

    const procesadorDecimales = (num) =>{
        const centavos = centenas(Number.parseInt(num));
        if (centavos.length > 0 ){
            // console.log("centavos:",centavos);
            salidaCentavos = ` ${cents[0]} ${centavos} ${cents[1]}`;
        }
    }

    const salida = () =>{
        const stringSalida = (salidaEntero.reverse().join(' ') + salidaCentavos).replace(/\s+/g, ' ');
        switch(format){
            case 1: return stringSalida.toLowerCase();
            case 2: return stringSalida.toUpperCase();
            case 3: return stringSalida.charAt(0).toUpperCase() + stringSalida.substring(1).toLowerCase().replace(moneda.toLocaleLowerCase(),moneda.toUpperCase());;
            case 4: return stringSalida.toLowerCase().replace(moneda.toLocaleLowerCase(),moneda.toUpperCase());
            // case 4: return stringSalida.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase());
            default: return stringSalida;
        }
    }

    procesadorEnteros(x)
    procesadorDecimales(y)
    return salida()
}
