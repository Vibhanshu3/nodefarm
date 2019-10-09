var http = require("http")
var fs = require("fs")
var url = require("url")

var json = fs.readFileSync("data.json")
var template = fs.readFileSync("./templates/Product.html") + "" // in buffer
var cardsTemplate = fs.readFileSync("./templates/Card.html") + "" 
var overviewTemplate = fs.readFileSync("./templates/Overview.html") + ""
var myname = "vibhanshu"

json = JSON.parse(json)

function replace(template, product) {
    template = template.replace(/#Images#/g, product["image"])
    template = template.replace(/#Productname#/g, product["productName"])
    template = template.replace(/#From#/g, product["from"])
    template = template.replace(/#Nutrients#/g, product["nutrients"])
    template = template.replace(/#Price#/g, product["price"])
    template = template.replace(/#Description#/g, product["description"])
    template = template.replace(/#id#/g, product["id"])
    template = template.replace(/#Quantity#/g, product["quantity"])

    if(!product["organic"]) {
        template = template.replace(/#NOT_ORGANIC#/g, "not-organic")
    }

    return template
}

var server = http.createServer(function (req, res) {

    console.log(url.parse(req.url, true))

    var parseUrl = url.parse(req.url, true)
    var id = parseUrl.query.id
    var pathname = parseUrl.pathname

    if (req.url == "/api") {
        res.write(json)
    } else if (req.url == "" || req.url == "/" || req.url == "/homepage") {
        // res.write("<h1> HomePage </h1>")
        var cards = "";
        for (var i = 0; i < json.length; i++) {
          cards = cards + replace(cardsTemplate, json[i]);
        }
    
        overviewTemplate=overviewTemplate.replace(/{%cardTemplate%}/g, cards);
        res.write(overviewTemplate);

    } else if (pathname == "/product") {
        var temp = replace(template, json[id])
        res.write(temp)

    } else {
        res.write("ERROR 404 Page NOT FOUND ")

    }
    res.end()
})
port = process.env.PORT||3001
server.listen(port, function () {
    console.log("server has started on port 3001")
})