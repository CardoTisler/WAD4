var express = require('express');
const pool = require("../database");
var router = express.Router();

router.get("/", async (req, res) => {
    // tells pool to look at postsSchema because our data isn't in the default schema
    await pool.query("SET search_path TO 'postsSchema'")
        .then(async () => {
            await pool.query("SELECT * FROM posts ORDER BY date DESC, id")
                .then((databaseResponse) => {
                    const postsArray = databaseResponse.rows;
                    if(postsArray.length === 0){ console.error("No data found from database."); }
                    res.render("posts/posts", {postsArray})
                });
        }).catch((err) => {
            console.error("Querying data from db failed. ")
            console.error(err.message);
        })
})

router.put("/posts/increment/:id", async (req, res) => {
    const {id} = req.params;
    const row = await pool.query("SELECT likecount FROM posts WHERE id = $1", [id])
    const {likecount} = row.rows[0];
    const incremented = parseInt(likecount) + 1;
    await pool.query("UPDATE posts SET likecount = $1 WHERE id = $2", [incremented, id])
        .then(() => {
            // https://stackoverflow.com/questions/33214717/why-post-redirects-to-get-and-put-redirects-to-put
            res.redirect(303,"/");
        }).catch((err) => {
            console.error("Updating post's likecount failed!")
            console.error(err.message);
        });
})
router.get("/posts/show/:id", async (req, res) => {
    const {id} = req.params;
    await pool.query("SELECT * FROM posts WHERE id = $1", [id])
        .then((postsArray) => {
            const post = postsArray.rows[0];
            res.render("posts/singlePost", {post});
        }).catch((err) => {
            console.error("Retrieving post from database failed!")
            console.error(err.message);
        });
})
router.delete("/posts/delete/:id", async (req, res) => {
    const {id} = req.params;
    await pool.query("DELETE FROM posts WHERE id = $1", [id])
        .then(() => {
            res.redirect(303, "/");
        }).catch((err) => {
            console.error("Deleting post from database failed!")
            console.error(err.message);
        })
})
router.get("/posts/new", (req, res) => {
    res.render("posts/addNewPost");
})
router.post("/posts/new", async (req, res) => {
    const {title, imagePath, description} = req.body;
    //generates random authorId between 1 to 20
    const authorId = Math.floor(Math.random() * 20) + 1;
    const authorName = "Random Author";
    const date = new Date();
    await pool.query(`INSERT INTO posts("text", "imagePath", "title", "authorId", "authorName", "date") VALUES ($1, $2, $3, $4, $5, $6)`,
        [description, imagePath, title, authorId, authorName, date])
        .then(() => {
            res.redirect("/");
        }).catch((err) => {
            console.error("Inserting new post to db failed!")
            console.error(err.message);
        });

})
module.exports = router;
