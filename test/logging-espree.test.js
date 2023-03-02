import { transpile, addLogging } from "../src/logging-espree.js";
import * as fs from "fs";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
import Tst from './test-description.mjs';

const Test = Tst.map(t => ({
  input: __dirname + '/data/' + t.input,
  output: __dirname + '/data/' + t.output,
  correctLogged: __dirname + '/data/' + t.correctLogged,
  correctOut: __dirname + '/data/' + t.correctOut,
}));

for (let instance of Test) {
  test('correctly adds logs to functions', () => {
    let input = fs.readFileSync(instance['input']);
    let result = addLogging(input);
    const correctOutput = fs.readFileSync(instance['correctLogged'], 'utf-8');
    expect(result).toBe(correctOutput);
  });

  test('writes logged function to file correctly', () => {
    transpile(instance['input'], instance['output']);
      
    const output = fs.readFileSync(instance['output'], 'utf-8');
    const correctOutput = fs.readFileSync(instance['correctLogged'], 'utf-8');
    expect(output).toBe(correctOutput);
  });

  test('doesn\'t write to file if not specified', () => {
    fs.unlinkSync(instance['output']);
    transpile(instance['input']);

    expect(fs.existsSync(instance['output'])).toBe(false);
  });
}