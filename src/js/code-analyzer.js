import * as esprima from 'esprima';

const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse, {loc:true});
    //return esprima.parseScript(codeToParse);

};

var iterateFunctionFromTypeByNodeAndTable={
    'Program':function(node,table){
        let statement;
        let i;
        for(i=0;i< node.body.length;i++) {
            statement = node.body[i];
            addCorrectRowsToTable(statement, table);
        }
    },
    'BlockStatement':function(node,table){
        let statement;
        let i;
        for(i=0;i< node.body.length;i++) {
            statement = node.body[i];
            addCorrectRowsToTable(statement, table);
        }
    },
    'FunctionDeclaration':function(node,table){
        table.push(getTableRow(node));
        let i, param;
        for(i=0;i < node.params.length;i++){
            param = node.params[i];
            table.push(getTableRow(param));
        }
        addCorrectRowsToTable(node.body, table);
    },
    'VariableDeclaration':function(node,table){
        let i, VariableDeclarator;
        for(i=0; i< node.declarations.length; i++){
            VariableDeclarator = node.declarations[i];
            table.push(getTableRow(VariableDeclarator));
        }
    },
    'ExpressionStatement':function(node,table){
        table.push(getTableRow(node.expression));
    },
    'WhileStatement':function(node,table){
        table.push(getTableRow(node));
        addCorrectRowsToTable(node.body, table);
    },
    'ForStatement':function(node,table){
        table.push(getTableRow(node));
        addCorrectRowsToTable(node.body, table);
    },
    'IfStatement':function(node,table) {
        table.push(getTableRow(node));
        addCorrectRowsToTable(node.consequent, table);
        let elseState = node.alternate;
        while (elseState != null) {
            if (elseState.type === 'IfStatement') {
                table.push(getTableRow(elseState, 'ElseIfStatement'));
                addCorrectRowsToTable(elseState.consequent, table);
                elseState = elseState.alternate;
            }
            else {
                table.push(getTableRow(elseState, 'ElseStatement'));
                addCorrectRowsToTable(elseState, table);
                elseState = null;
            }
        }
    },
    'ReturnStatement':function(node,table){
        table.push(getTableRow(node));
    },
};

//iterates through program to find suitable rows to document
function addCorrectRowsToTable(node, table){
    const type = node.type;
    iterateFunctionFromTypeByNodeAndTable[type](node,table);
}
var rowFromTypeByNode = {
    'FunctionDeclaration': function (node, type) {
        let line, name, condition, value;
        let id = node.id;
        name = id.name;
        line = id.loc.start.line;
        return [line, type, name, condition, value];
    },
    'VariableDeclarator': function (node, type) {
        let line, name, condition, value;
        let id = node.id;
        name = id.name;
        line = id.loc.start.line;
        return [line, type, name, condition, value];
    },
    'Identifier': function (node, type) {
        let line, name, condition, value;
        type = 'VariableDeclarator';
        name = node.name;
        line = node.loc.start.line;
        return [line, type, name, condition, value];
    },
    'AssignmentExpression': function (node, type) {
        let line, name, condition, value;
        name = getVal(node.left);
        value = getVal(node.right);
        line = node.loc.start.line;
        return [line, type, name, condition, value];
    },
    'WhileStatement': function (node, type) {
        let line, name, condition, value;
        condition = getVal(node.test);
        line = node.loc.start.line;
        return [line, type, name, condition, value];
    },
    'ForStatement':function(node,type){
        let line, name, condition, value;
        condition = getVal(node);
        line = node.loc.start.line;
        return [line, type, name, condition, value];

    },
    'IfStatement': function (node, type) {
        let line, name, condition, value;
        condition = getVal(node.test);
        line = node.loc.start.line;
        return [line, type, name, condition, value];
    },
    'ElseIfStatement': function (node, type) {
        let line, name, condition, value;
        condition = getVal(node.test);
        line = node.loc.start.line;
        return [line, type, name, condition, value];
    },
    'ElseStatement': function (node, type) {
        let line, name, condition, value;
        line = node.loc.start.line;
        return [line, type, name, condition, value];
    },
    'ReturnStatement': function (node, type) {
        let line, name, condition, value;
        value = getVal(node.argument);
        line = node.loc.start.line;
        return [line, type, name, condition, value];
    }
};

function getTableRow(node, type = node.type){
    return rowFromTypeByNode[type](node, type);

}


var valFromTypeByNode = {
    'Identifier': function(node){
        return node.name;
    },
    'Literal': function(node){
        return node.value;
    },
    'BinaryExpression': function(node){
        return getVal(node.left) + node.operator + getVal(node.right);
    },
    'MemberExpression': function(node){
        return getVal(node.object) + '[' + getVal(node.property) + ']';
    },
    'UnaryExpression': function(node){
        return node.operator + getVal(node.argument);
    },
    'UpdateExpression': function(node){
        return node.prefix? node.operator + getVal(node.argument):getVal(node.argument) + node.operator;
    },
    'ForStatement':function(node){
        let condition = getVal(node.init);
        condition += ';';
        condition += getVal(node.test);
        condition += ';';
        condition += getVal(node.update);
        return condition;
    },
    'AssignmentExpression':function(node) {
        return getVal(node.left) + '=' + getVal(node.right);
    },
    // 'VariableDeclaration':function(node){
    //     let decleration = node.declarations[0];
    //
    // }

    // null:function(node){
    //     return '';
    // }
};
function getVal(node) {
    const type = node.type;
    return valFromTypeByNode[type](node);
}

export {parseCode, addCorrectRowsToTable};
