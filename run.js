var beautify = require('js-beautify').html;
var fs = require('fs');
var jade = require('jade');
var options  = {
    pretty: true
};
var diff = require('diff');

var initialFolder = 'before';
var targetFolder = 'after';

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

function removeFiles(dir, files) {
    files_ = files || [];
    var files = fs.readdirSync(dir);

    for (var i in files) {
        var name = dir + '/' + files[i];
        if (!fs.statSync(name).isDirectory()){
          fs.unlink(name);
        }
    }
    return files;
}

function saveToFile(fileName, data) {
    fs.writeFileSync(fileName, data , 'utf-8');
}

function isFilesIdentical(file1, file2) {
    var identical = true;

    var results = diff.diffLines(file1, file2);

    results.forEach(function(part) {
       if (part.added || part.removed ) {
           identical = false;
       }
    });
    return identical;
}

function filtredFiles(fileNameList, dirBefore, dirAfter) {
    var filtredNotIdenticalList = [];
    var length = fileNameList.length;
    var count = 0;
    for (var i=0; i<length; i++) {
        count++;
        var fileBefore = dirBefore + '/' + fileNameList[i];
        var fileAfter = dirAfter + '/' + fileNameList[i];

        var dataBefore = fs.readFileSync(fileBefore, 'utf8');
        var dataAfter = fs.readFileSync(fileAfter, 'utf8');
        if (!isFilesIdentical(dataBefore, dataAfter)) {
            filtredNotIdenticalList.push(fileNameList[i]);
        }
    }
    console.log("Total files: " + count + "; Not IDENTICAL files: " + filtredNotIdenticalList.length)
    return filtredNotIdenticalList;
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
        var dataAfter = fs.readFileSync(fileAfter, 'utf8');

        var dataBeforeBeautify = beautify(dataBefore, {"indent-size": 2});
        var dataAfterBeautify = beautify(dataAfter, {"indent-size": 2});

        var nameHTML = 'report/diffTool/diff_' + fileNameList[i];
        var html = template({ after: dataAfterBeautify, before: dataBeforeBeautify, namefile: fileNameList[i], nextfile: fileNameList[i+1], previousfile: fileNameList[i-1]});
        saveToFile(nameHTML, html);
    }
}


removeFiles("report/diffTool");

var fileNameList = getFiles(initialFolder);
var filtredNotIdenticalList = filtredFiles(fileNameList,initialFolder, targetFolder);

var templateFn = jade.compileFile('views/index.jade',options);
var htmlList = templateFn({ fileNameList: filtredNotIdenticalList });

saveToFile('report/index.html', htmlList);
produceHTML(filtredNotIdenticalList, initialFolder, targetFolder);

console.log("Generating HTML was completed!");

