const express = require('express'),
    app = express(),
    postsRoutes = require("./routes/posts");

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(postsRoutes);

app.listen(3000, process.env.IP, function(){
    console.log("Server running on port ", 3000);
});
