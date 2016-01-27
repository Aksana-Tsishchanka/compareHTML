var fs = require('fs');
var jade = require('jade');
var options  = {
    pretty: true
} 

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

function produceHTML(fileNameList) {
    var length = fileNameList.length;
    var k=0;
    for (var i=0; i<length; i++) {
        console.log(k++);
    }
    /*1)в цикле пробежать по всем папкам в файле
      2) читаем файл, записываем содержимле в переменную
      3) компилем jade файл с нужными данными (2 переменные) в HTML файл вида diff_docId.html
      4) сохраняем полученный HTML файл
*/


}

var fileNameList = getFiles('before');
console.log("fileNameList " + fileNameList);

var templateFn = jade.compileFile('views/index.jade',options);
var html = templateFn({ fileNameList: fileNameList });

saveToFile('index.html', html);

produceHTML(fileNameList);

