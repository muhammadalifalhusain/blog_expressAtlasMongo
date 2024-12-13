const express = require('express');
const mongodb = require('mongodb');
const db = require('../data/database');
const ObjectId = mongodb.ObjectId;
const router = express.Router();

// Rute untuk mengarahkan ke posts
router.get('/', function(req, res) {
    res.redirect('/posts');
});

// Menangani rute untuk menampilkan semua posts
router.get('/posts', async function(req, res) {
    const posts = await db
        .getDb()
        .collection('posts')
        .find({}, { title: 1, summary: 1, 'author.name': 1 })
        .toArray();
    res.render('posts-list', { posts: posts })
});

// Menangani rute untuk membuat post baru
router.get('/new-post', async function(req, res) {
    const authors = await db.getDb().collection('authors').find().toArray();
    //console.log(authors); 
    res.render('create-post', { authors: authors });
});

// Menangani rute untuk menampilkan post detail berdasarkan ID
router.get('/posts/:id', async function(req, res) {
    try {
        const postId = req.params.id;
        const post = await db.getDb().collection('posts').findOne({ _id: new ObjectId(postId) }, { summary: 0 });

        if (!post) {
            return res.status(404).render('404');
        }

        post.humanReadableDate = post.date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        res.render('post-detail', { post: post });
    } catch (err) {
        console.error('Error fetching post by ID:', err);
        res.status(500).render('500', { error: 'Failed to fetch the post' });
    }
});

// Menangani rute untuk mengedit post
router.get('/posts/:id/edit', async function(req, res) {
    try {
        const postId = req.params.id;
        const post = await db.getDb()
            .collection('posts')
            .findOne({ _id: new ObjectId(postId) }, { title: 1, summary: 1, body: 1 });

        if (!post) {
            return res.status(404).render('404');
        }

        res.render('update-post', { post: post });
    } catch (err) {
        console.error('Error fetching post for edit:', err);
        res.status(500).render('500', { error: 'Failed to fetch the post for editing' });
    }
});

// Menangani rute untuk menambahkan post baru
router.post('/posts', async function(req, res) {
    try {
        const authorId = new ObjectId(req.body.author);
        const author = await db.getDb().collection('authors').findOne({ _id: authorId });

        if (!author) {
            return res.status(404).render('404', { error: 'Author not found' });
        }

        const newPost = {
            title: req.body.title,
            summary: req.body.summary,
            body: req.body.content,
            date: new Date(),
            author: {
                id: authorId,
                name: author.name,
                email: author.email
            }
        };

        const result = await db.getDb().collection('posts').insertOne(newPost);
        console.log(result);
        res.redirect('/posts');
    } catch (err) {
        console.error('Error creating post:', err);
        res.status(500).render('500', { error: 'Failed to create the post' });
    }
});

// Menangani rute untuk memperbarui post
router.post('/posts/:id/edit', async function(req, res) {
    try {
        const postId = new ObjectId(req.params.id);
        const result = await db.getDb().collection('posts').updateOne({ _id: postId }, {
            $set: {
                title: req.body.title,
                summary: req.body.summary,
                body: req.body.content
            },
        });

        res.redirect('/posts');
    } catch (err) {
        console.error('Error updating post:', err);
        res.status(500).render('500', { error: 'Failed to update the post' });
    }
});

// Menangani rute untuk menghapus post
router.post('/posts/:id/delete', async function(req, res) {
    try {
        const postId = new ObjectId(req.params.id);
        const result = await db.getDb().collection('posts').deleteOne({ _id: postId });
        res.redirect('/posts');
    } catch (err) {
        console.error('Error deleting post:', err);
        res.status(500).render('500', { error: 'Failed to delete the post' });
    }
});

module.exports = router;