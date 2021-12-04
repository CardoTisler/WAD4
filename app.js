const express = require('express'),
    app = express(),
    postsRoutes = require("./routes/posts"),
    pool = require("./database");


const getPostsFromDB = async () => {
    await pool.query("SET search_path TO 'postsSchema'")
    const posts = await pool.query("SELECT * FROM posts");
    console.log(posts);
}
getPostsFromDB();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(postsRoutes);

app.listen(3000, process.env.IP, function(){
    console.log("Server running on port ", 3000);
});
