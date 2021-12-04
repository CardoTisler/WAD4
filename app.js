var express = require('express'),
    app = express(),
    postsRoutes = require("./routes/posts");

const { Pool } = require("pg");
const pg = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'postgres'
})

Pool.query('SELECT NOW()', (err, res) => {
    console.log(err, res);
    Pool.end();
})

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(postsRoutes);

app.listen(3000, process.env.IP, function(){
    console.log("Server running on port ", 3000);
});
