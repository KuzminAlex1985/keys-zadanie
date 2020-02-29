 $(document).ready( function(){
    const countRows = 5;
    const countCols = 5;
    var table = $("#mainTable tbody");
    for(var ind=0; ind < countRows; ind++) {
        var tr = $("<tr>").attr("id", "row" + ind).attr("style","bordercolor='black'");
        for(var indCol=0; indCol < countCols; indCol++) {
            tr.append($("<td>").append($("<input type='text'>")
            .attr("id", "input" + ind + "_" + indCol)));
        }
        table.append(tr);
    }
        //
        var sel = $("select#sel0");
        for(var ind=1; ind < countCols; ind++) {
            $("select#sel" + ind).append($("select#sel0 > option").clone());
        }

//
    $('#but1').click(function(){
        var result = [];
        var grCols = [];
        var execCols = [];
        var table = $("#mainTable thead");
        var headNamesGr = [];
        var headNamesEx = [];
        $("select[id ^= sel]").each(function(indx, element){
            if ($(element).val() === "krit") {
                grCols.push($(element).attr("id").replace("sel", ""));
                var test = $($("th", table)[parseInt(grCols[grCols.length - 1])]);
                headNamesGr.push($($("th", table)[parseInt(grCols[grCols.length - 1])]).text());
            } else if ($(element).val() !== "nothing") {
                execCol = {
                    number: $(element).attr("id").replace("sel", ""),
                    method: $(element).val()
                };
                execCols.push(execCol);
                headNamesEx.push($($("th", table)[parseInt(execCols[execCols.length - 1].number)]).text());
            }
        });
        // Перебираем строки основной таблицы
        for(var indRow = 0; indRow < countRows; indRow++) {
                var resultEl = null;
                var grValues = {};
                $(grCols).each(function(indGr, elGr) {
                    grValues["gr" + indGr] = $("input#input" + indRow + "_" + elGr).val();
                });
                $(result).each(function(indR, elR) {
                    var isFined = true;
                    for (key in grValues) {
                        if (elR[key] !== grValues[key]) {
                            isFined = false;
                        }
                    }
                    if (isFined === true) {
                        resultEl = elR;
                    }
                });
                // Если не нашли элемент, то добавляем
                if (resultEl === null) {
                    resultEl = {};
                    $(grCols).each(function(indGr, elGr) {
                        resultEl["gr" + indGr] = $("input#input" + indRow + "_" + elGr).val();
                    });
                    result.push(resultEl);
                }
                // выполняем операции
                $(execCols).each(function(indEx, elEx) {
                    var value = $("input#input" + indRow + "_" + elEx.number).val();
                    var elValue = resultEl["ex" + elEx.number];
                    switch(elEx.method) {
                        case "sum":
                            resultEl["ex" + elEx.number] = elValue !== undefined ?
                                parseFloat(elValue) + parseFloat(value) : parseFloat(value);
                        break;
                        case "max":
                            resultEl["ex" + elEx.number] = elValue !== undefined ?
                                Math.max(parseFloat(elValue), parseFloat(value)) : parseFloat(value);
                        break;
                        case "min":
                            resultEl["ex" + elEx.number] = elValue !== undefined ?
                                Math.min(parseFloat(elValue), parseFloat(value)) : parseFloat(value);
                        break;
                        case "konkat":
                            resultEl["ex" + elEx.number] = elValue !== undefined ? elValue.concat(value) : value;
                        break;
                    }
                })
        }

        paintResultTable(result, grCols.length + execCols.length, headNamesGr.concat(headNamesEx));
     });
});

function paintResultTable(data, countCols, headNames) {
    const countRows = data.length;
    var header = $("#result thead");
    $("tr", header).empty();
    $(headNames).each(function(ind, el) {
        var th = $("<th>").text(el);
        $("tr", header).append(th);
    });
    var table = $("#result tbody").attr("class", "bgcolor=grey");
    table.empty();
        for(var ind=0; ind < countRows; ind++) {
            var tr = $("<tr>").attr("id", "rowRes" + ind);
            for(var indCol = 0; indCol < countCols; indCol++) {
                tr.append($("<td>"));
            }
            var indCol = 0;
            for(key in data[ind]) {
                $($("td", tr)[indCol++]).text(data[ind][key]);
            }
            table.append(tr);
    }
}