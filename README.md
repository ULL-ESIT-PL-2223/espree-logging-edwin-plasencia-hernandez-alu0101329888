# Práctica Espree logging

## Resumen de lo aprendido

...

## Retos
### Argumentos

Se ha modificado el código de `logging-espree.js` para que el log también indique los valores de los argumentos que se pasaron a la función. 
Ejemplo:

```javascript
function foo(a, b) {
  var x = 'blah';
  var y = (function (z) {
    return z+3;
  })(2);
}
foo(1, 'wut', 3);
```

```javascript
function foo(a, b) {
    console.log(`Entering foo(${ a }, ${ b })`);
    var x = 'blah';
    var y = function (z) {
        console.log(`Entering <anonymous function>(${ z })`);
        return z + 3;
    }(2);
}
foo(1, 'wut', 3);
```

Para realizar tal cambio, hizo falta analizar los valores de los parámetros del nodo pasado a la función `addBeforeCode`

```javascript
let args = [];
for (let parameter of node.params) {
    args.push(parameter.name);
  }
  let beforeCode = "console.log(\`Entering " + name + "(";
  for (let [index, value] of args.entries()) {
    if (index != 0) {
      beforeCode += ", ";
    }
    beforeCode += "${ " + value + " }";
  }
  beforeCode += ")";
```

Este código, guarda en args los parámetros de la función y luego los escribe en `beforeCode` correctamente 

### Funciones de flecha gorda

Para lograr analizar correctamente funciones flecha gorda como las de este ejemplo:

```javascript
function foo(a, b, c) {
    let x = 'tutu';
    let y = (function (x) { return x*x })(2);
    let z = (e => { return e +1 })(4);
    console.log(x,y,z);
  }
foo(1, 'wut', 3);
```

Hace falta editar la función addLoging para que acepte las funciones, esto se hace modificando el código de la siguiente forma:

```javascript
estraverse.traverse(ast, {
      enter: function(node, parent) {
          if (node.type === 'FunctionDeclaration' ||
              node.type === 'FunctionExpression'  ||
              node.type === 'ArrowFunctionExpression') {
              addBeforeCode(node);
          }
      }
  });
```

Aquí especificamos cómo queremos que también tenga en cuenta las `ArrowFunctionExpression`, esto es posible gracias a que llamamos anteriormente a la instrucción `parse`, especificando que queremos que use ecmaVersion >= 6.

```javascript
const ast = espree.parse(code, {ecmaVersion: 12, loc: true});
```

### Número de línea

Puede apreciarse en el código anterior, cómo llamamos a parse con también la opción `loc: true`, ésto hace que el parser cree información extra sobre la posición de cada línea de código. Con ésta información, solo hace falta modificar un poco de código en la función `addBeforeCode` para añadir las líneas:

```javascript
...

beforeCode += ") at line " + node.loc.start.line + "\`);";

...
```

## CLI con [Commander.js](https://www.npmjs.com/package/commander)

Con el uso de commander, podemos crear menús de ayuda y documentación simple para la ejecución de nuestro programa.
En nuestro ejecutable `log.js` encontramos lo siguiente:

```javascript
import { program } from "commander";

program
  .version(version)
  .argument("<filename>", 'file with the original code')
  .option("-o, --output <filename>", "file in which to write the output")
  .action((filename, options) => {
    transpile(filename, options.output);
  });

program.parse(process.argv);
```

De entre todas las opciones que podemos poner, las que vamos a ver son las anteriores.
`.version` permite establecer un número de versión.
`.argument` nos deja poner los argumentos que recibirá nuestro programa, de no ser dados, devolverá un error.
`.option` nos permite añadir argumentos opcionales a nuestro programa, en este caso, el fichero de salida, que no es necesario para que el programa funcione.
`.action` por último, dice al programa qué hacer dados los argumentos y parámetros opcionales. En nuestro caso, llama a transpile que es la función principal del programa.


## Tests and Covering

En esta práctica he desarrollado tests con Mocha y con Jest para también tener un test de cobertura.
En el fichero `test.mjs` se encuentran los tests de Mocha y en `loging-espree.test.js` los de jest.
Para ejecutarlos solo hace falta usar `npm test`.

Ambos ficheros usan los códigos de JS encontrados en la carpeta `data` y comparan los resultados con ficheros correctos también en la misma carpeta.

Logramos testear el módulo con Github actions cada vez que realizamos un push al repositorio gracias al fichero `nodejs.yml` en `./github/workflows` y nos cercioramos que funciona todo correctamente en varios sistemas operativos.

## NPMJS

El módulo finalizado y funcional, se puede descargar desde npmjs con el simple comando:
`npm install @alu0101329888js/espree-logging` en cualquier proyecto.
Para usar lo que proporciona el módulo, se puede importar con:
```javascript
import * as el from '@alu0101329888pl/espree-logging'
```

## Documentación

Con ayuda de documentation, se ha creado un fichero `doc.md` que contiene información en MarkDown sobre el fichero `logging-espree.js` que contiene las funciones principales del programa.

Con JSDoc, se ha creado lo mismo pero en formato HTML en la carpeta `out`

Y con JSDoc 2 markdown se ha creado otro fichero markdown llamado `doc2md.md` para ver todas las posibilidades de documentación existentes.
