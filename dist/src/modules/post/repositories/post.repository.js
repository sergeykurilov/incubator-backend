"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRepository = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const blogDb_1 = require("../../../database/blogDb");
let PostRepository = class PostRepository {
    findAll() {
        return new Promise((resolve) => {
            return resolve(blogDb_1.blogDb.posts);
        });
    }
    findById(id) {
        return new Promise((resolve) => {
            const post = blogDb_1.blogDb.posts.find((blog) => blog.id === id);
            resolve(post || null);
        });
    }
    deleteById(id) {
        return new Promise((resolve) => {
            const post = blogDb_1.blogDb.posts.find((blog) => blog.id === id);
            if (!post) {
                resolve(false);
            }
            blogDb_1.blogDb.posts = blogDb_1.blogDb.posts.filter((blog) => blog.id !== id);
            resolve(true);
        });
    }
    create(createPostDto) {
        const lastPost = blogDb_1.blogDb.posts[blogDb_1.blogDb.posts.length - 1];
        const newPostId = lastPost ? String(Number(lastPost.id) + 1) : "0";
        const newPost = Object.assign({ id: newPostId }, createPostDto);
        return new Promise((resolve) => {
            blogDb_1.blogDb.posts.push(newPost);
            resolve(newPost);
        });
    }
    deleteAll() {
        return new Promise((resolve) => {
            blogDb_1.blogDb.posts = [];
            resolve(true);
        });
    }
    update(id, updatePostDto) {
        return new Promise((resolve, reject) => {
            let updatedPost;
            blogDb_1.blogDb.blogs.forEach((blog, index) => {
                if (blog.id === id) {
                    blogDb_1.blogDb.posts[index] = Object.assign({ id }, updatePostDto);
                    updatedPost = blogDb_1.blogDb.posts[index];
                }
            });
            if (updatedPost) {
                resolve(updatedPost);
            }
            else {
                reject(null);
            }
        });
    }
};
exports.PostRepository = PostRepository;
exports.PostRepository = PostRepository = __decorate([
    (0, inversify_1.injectable)()
], PostRepository);
