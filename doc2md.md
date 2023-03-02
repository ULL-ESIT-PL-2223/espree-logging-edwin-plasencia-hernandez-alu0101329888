## Functions

<dl>
<dt><a href="#transpile">transpile(inputFile, outputFile)</a></dt>
<dd><p>Reads JavaScript code and adds console.log calls every time you enter a function</p>
</dd>
<dt><a href="#addLogging">addLogging(code)</a> ⇒ <code>string</code></dt>
<dd><p>Adds logging to functions in js code</p>
</dd>
<dt><a href="#addBeforeCode">addBeforeCode(node)</a> ⇒ <code>Node</code></dt>
<dd><p>Receives an AST function node and adds a console.log with the name and params of the function</p>
</dd>
</dl>

<a name="transpile"></a>

## transpile(inputFile, outputFile)
Reads JavaScript code and adds console.log calls every time you enter a function

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| inputFile | <code>string</code> | file with the js code |
| outputFile | <code>string</code> | optional output file |

<a name="addLogging"></a>

## addLogging(code) ⇒ <code>string</code>
Adds logging to functions in js code

**Kind**: global function  
**Returns**: <code>string</code> - logged code  

| Param | Type | Description |
| --- | --- | --- |
| code | <code>string</code> | javascript code |

<a name="addBeforeCode"></a>

## addBeforeCode(node) ⇒ <code>Node</code>
Receives an AST function node and adds a console.log with the name and params of the function

**Kind**: global function  
**Returns**: <code>Node</code> - logged node  

| Param | Type | Description |
| --- | --- | --- |
| node | <code>Node</code> | AST node |
