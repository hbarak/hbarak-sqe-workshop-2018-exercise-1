import $ from 'jquery';
import {parseCode, addCorrectRowsToTable} from './code-analyzer';

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);

        let table = [];
        addCorrectRowsToTable(parsedCode, table);
        addTableToPage(table);
    });
});

function addTableToPage(tableArr){
    let table = document.getElementById('myTable').getElementsByTagName('tbody')[0];

    //deleting rows
    for(var i = table.rows.length - 1; i > 0; i--)
        table.deleteRow(i);
    //iterate over every array(row) within tableArr
    for (let row of tableArr) {
        //Insert a new row element into the table element
        table.insertRow();
        //Iterate over every index(cell) in each array(row)
        for (let cell of row) {
            //insert a cell into the table element
            let newCell = table.rows[table.rows.length - 1].insertCell();
            //add text to the created cell element
            newCell.textContent = cell;
        }
    }
}


