var express = require('express');
var app = express();

var fs = require('fs');

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

var fileNameList = getFiles('views');
console.log("fileNameList " + fileNameList);


//set view engine
app.set("view engine","jade")

app.get('/', function (req, res) {
    res.renderFile('index', { fileNameList: fileNameList });
});

var server = app.listen(5000, function () {
    console.log('Node server is running..');
});