var express = require('express');
const pool = require("../database");
var router = express.Router();

router.get("/", async (req, res) => {
    // tells pool to look at postsSchema because our data isn't in the default schema
    await pool.query("SET search_path TO 'postsSchema'")
    try{
        const posts = await pool.query("SELECT * FROM posts ORDER BY date");
        if(posts.length === 0){ console.error("No data found from database."); }

        //replace null values with image placeholder path
        const postsArray = posts.rows.map((post) => {
            let path = post.imagePath;
            return {...post, imagePath: path};
            
        })
        res.render("posts/posts", {postsArray})
    } catch (err){
        console.error("Querying data from db failed. ")
        console.error(err.message);
    }
})

router.put("/posts/increment/:id", async (req, res) => {
    const {id} = req.params;
    const row = await pool.query("SELECT likecount FROM posts WHERE id = $1", [id])
    const {likecount} = row.rows[0];
    const incremented = parseInt(likecount) + 1;
    await pool.query("UPDATE posts SET likecount = $1 WHERE id = $2", [incremented, id]);
    // https://stackoverflow.com/questions/33214717/why-post-redirects-to-get-and-put-redirects-to-put
    res.redirect(303,"/");
})

router.delete("/posts/delete/:id", async (req, res) => {
    const {id} = req.params;
    await pool.query("DELETE FROM posts WHERE id = $1", [id])
    res.redirect(303, "/");
})
module.exports = router;
