import * as escodegen from "escodegen";
import * as espree from "espree";
import * as estraverse from "estraverse";
import * as fs from "fs";

export async function transpile(inputFile, outputFile) {
  let input = fs.readFileSync(inputFile);
  console.log('\ninput:\n' + input + '\n\n---');

  let result = addLogging(input);

  if (outputFile != undefined) {
    fs.writeFileSync(outputFile, result);
    console.log('Output in file \'' + outputFile + '\'\n');
  }
}

export function addLogging(code) {
  const ast = espree.parse(code, {ecmaVersion: 12, loc: true});
  estraverse.traverse(ast, {
      enter: function(node, parent) {
          if (node.type === 'FunctionDeclaration' ||
              node.type === 'FunctionExpression'  ||
              node.type === 'ArrowFunctionExpression') {
              addBeforeCode(node);
          }
      }
  });
  return escodegen.generate(ast);
}

function addBeforeCode(node) {
  const name = node.id ? node.id.name : '<anonymous function>';
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
  beforeCode += ") at line " + node.loc.start.line + "\`);";
  const beforeNodes = espree.parse(beforeCode, {ecmaVersion: 12, loc: true}).body;
  node.body.body = beforeNodes.concat(node.body.body);
}
