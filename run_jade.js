var beautify = require('js-beautify').html;
var fs = require('fs');
var jade = require('jade');
var options  = {
    pretty: true
};

function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name, files_);
        } else {
            files_.push(name.substr(dir.length+1));
        }
    }
    return files_;
}

function saveToFile(fileName, data) {
    fs.writeFileSync(fileName, data , 'utf-8');
}

function produceHTML(fileNameList, dirBefore, dirAfter) {
    var length = fileNameList.length;
    var k = 1;
    var template = jade.compileFile('views/template.jade',options);
    for (var i=0; i<length; i++) {
        console.log(k++);
        var fileBefore = dirBefore + '/' + fileNameList[i];
        var fileAfter = dirAfter + '/' + fileNameList[i];
        var dataBefore = fs.readFileSync(fileBefore, 'utf8');
        var dataBeforeBeautify = beautify(dataBefore, {});

        var dataAfter = fs.readFileSync(fileAfter, 'utf8');
        var dataAfterBeautify = beautify(dataAfter, {});

        var nameHTML = 'report/diffTool/diff_' + fileNameList[i];
        var html = template({ after: dataAfterBeautify, before: dataBeforeBeautify });
        saveToFile(nameHTML, html);
    }
}

var fileNameList = getFiles('before');
var templateFn = jade.compileFile('views/index.jade',options);
var htmlList = templateFn({ fileNameList: fileNameList });

saveToFile('report/index.html', htmlList);
produceHTML(fileNameList, 'before', 'after');

console.log("Generating HTML was completed!");

