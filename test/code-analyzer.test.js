import assert from 'assert';
import {parseCode, addCorrectRowsToTable} from '../src/js/code-analyzer';


describe('The javascript parser', () => {
    it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('')),
            '{"type":"Program","body":[],"sourceType":"script","loc":{"start":{"line":0,"column":0},"end":{"line":0,"column":0}}}'
        );
    });

    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let a = 1;')),
            '{"type":"Program","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"a","loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":5}}},"init":{"type":"Literal","value":1,"raw":"1","loc":{"start":{"line":1,"column":8},"end":{"line":1,"column":9}}},"loc":{"start":{"line":1,"column":4},"end":{"line":1,"column":9}}}],"kind":"let","loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":10}}}],"sourceType":"script","loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":10}}}'
        );
    });
});


describe('The addCorrectRowsToTable function', ()=>{
    it('is parsing functions',()=>{
        let code = 'function X(){\n' +
            ' return true;\n' +
            '}';
        let parsedCode = parseCode(code);
        let table = [];
        addCorrectRowsToTable(parsedCode,table);
        assert.equal(
            table.toString(),
            '1,FunctionDeclaration,X,,,2,ReturnStatement,,,true');
    });

    it('is parsing functions with args',()=>{
        let code = 'function X(y){\n' +
            ' return y;\n' +
            '}';
        let parsedCode = parseCode(code);
        let table = [];
        addCorrectRowsToTable(parsedCode,table);
        assert.equal(
            table.toString(),
            '1,FunctionDeclaration,X,,,1,VariableDeclarator,y,,,2,ReturnStatement,,,y');
    });


    it('is parsing if statements',()=>{
        let code = 'if(x<val){\n' +
            ' x=x-1;\n' +
            '}';
        let parsedCode = parseCode(code);
        let table = [];
        addCorrectRowsToTable(parsedCode,table);
        assert.equal(
            table.toString(),
            '1,IfStatement,,x<val,,2,AssignmentExpression,x,,x-1');
    });

    it('is parsing else statements',()=>{
        let code = 'if(x<val){\n' +
            ' x=x-1;\n' +
            '}\n' +
            'else{\n' +
            ' x=x+1;\n' +
            '}';
        let parsedCode = parseCode(code);
        let table = [];
        addCorrectRowsToTable(parsedCode,table);
        assert.equal(
            table.toString(),
            '1,IfStatement,,x<val,,2,AssignmentExpression,x,,x-1,4,ElseStatement,,,,5,AssignmentExpression,x,,x+1');
    });

    it('is parsing else if statements',()=>{
        let code = 'if(x<val){\n' +
            ' x=x-1;\n' +
            '}\n' +
            'else if(x>val){\n' +
            ' x=x+1;\n' +
            '}';
        let parsedCode = parseCode(code);
        let table = [];
        addCorrectRowsToTable(parsedCode,table);
        assert.equal(
            table.toString(),
            '1,IfStatement,,x<val,,2,AssignmentExpression,x,,x-1,4,ElseIfStatement,,x>val,,5,AssignmentExpression,x,,x+1');
    });

    it('is parsing while statements',()=>{
        var code = 'while (x<val) {x=x-5}';
        var parsedCode = parseCode(code);
        var table = [];
        addCorrectRowsToTable(parsedCode,table);
        assert.equal(
            table.toString(),
            '1,WhileStatement,,x<val,,1,AssignmentExpression,x,,x-5');
    });

    it('is parsing for statements',()=>{
        let code = 'for(i=0;i<arr.length;i++){\n' +
            ' x=x+1;\n' +
            '}';
        let parsedCode = parseCode(code);
        let table = [];
        addCorrectRowsToTable(parsedCode,table);
        assert.equal(
            table.toString(),
            '1,ForStatement,,i=0;i<arr[length];i++,,2,AssignmentExpression,x,,x+1');
    });


    it('is parsing let statements',()=>{
        let code = 'let low, high, mid;';
        let parsedCode = parseCode(code);
        let table = [];
        addCorrectRowsToTable(parsedCode,table);
        assert.equal(
            table.toString(),
            '1,VariableDeclarator,low,,,1,VariableDeclarator,high,,,1,VariableDeclarator,mid,,');
    });


    it('is parsing assignments',()=>{
        let code = 'low = 0;\n' +
            'high = n - 1;';
        let parsedCode = parseCode(code);
        let table = [];
        addCorrectRowsToTable(parsedCode,table);
        assert.equal(
            table.toString(),
            '1,AssignmentExpression,low,,0,2,AssignmentExpression,high,,n-1');
    });

    it('is parsing unary expressions',()=>{
        let code = 'low = -1;';
        let parsedCode = parseCode(code);
        let table = [];
        addCorrectRowsToTable(parsedCode,table);
        assert.equal(
            table.toString(),
            '1,AssignmentExpression,low,,-1');
    });

    it('is parsing update expressions',()=>{
        let code = 'low = i++;\n' +
            'low = --i;';
        let parsedCode = parseCode(code);
        let table = [];
        addCorrectRowsToTable(parsedCode,table);
        assert.equal(
            table.toString(),
            '1,AssignmentExpression,low,,i++,2,AssignmentExpression,low,,--i');
    });
});


