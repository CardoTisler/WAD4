const express = require('express'),
    app = express(),
    postsRoutes = require("./routes/posts"),
    bodyParser = require('body-parser');

//auto sets file extension to .ejs when rendering files in api request
app.set("view engine", "ejs");
//tells app to look for static files(i.e. images) from given path
app.use(express.static(__dirname + "/public"));
app.use(express.json());
//needed to get values from req.body that were inserted in the addNewPost form
app.use(bodyParser.urlencoded({ extended: true }));
app.use(postsRoutes);

app.use( (req, res, next) => {
    res.status(404);
    res.render("404");
})
app.listen(3000, process.env.IP, function(){
    console.log("Server running on port ", 3000);
});
