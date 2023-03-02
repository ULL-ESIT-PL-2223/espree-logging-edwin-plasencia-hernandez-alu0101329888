import { transpile, addLogging } from "../src/logging-espree.js";
import assert from 'assert';
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
})
)

function removeSpaces(s) {
  return s.replace(/\s/g, '');
}

for (let instance of Test) {
  describe('#addLogging', function() {
    it('correctly adds logs to functions', function() {
      let input = fs.readFileSync(instance['input']);
      let result = addLogging(input);
      const correctOutput = fs.readFileSync(instance['correctLogged'], 'utf-8');
      assert.equal(result, correctOutput);
    });
  });

  describe('#transpile', function() {
    it('writes logged function to file correctly', function() {
      transpile(instance['input'], instance['output']);
      
      const output = fs.readFileSync(instance['output'], 'utf-8');
      const correctOutput = fs.readFileSync(instance['correctLogged'], 'utf-8');
      assert.equal(output, correctOutput);
    });

    it('doesn\'t write to file if not specified', function() {
      fs.unlinkSync(instance['output']);
      transpile(instance['input']);
      
      assert.equal(fs.existsSync(instance['output']), false);
    });
  });
}


