"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRepository = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const blogDb_1 = require("../../../database/blogDb");
const http_status_codes_interface_1 = require("../../common/interfaces/http-status-codes.interface");
let BlogRepository = class BlogRepository {
    findAll() {
        return new Promise((resolve) => {
            return resolve(blogDb_1.blogDb.blogs);
        });
    }
    findById(id) {
        return new Promise((resolve) => {
            const blog = blogDb_1.blogDb.blogs.find((blog) => blog.id === id);
            resolve(blog || null);
        });
    }
    deleteById(id) {
        return new Promise((resolve) => {
            const blog = blogDb_1.blogDb.blogs.find((blog) => blog.id === id);
            if (!blog) {
                resolve(false);
            }
            blogDb_1.blogDb.blogs = blogDb_1.blogDb.blogs.filter((blog) => blog.id !== id);
            resolve(true);
        });
    }
    create(createBlogDto) {
        const lastBlog = blogDb_1.blogDb.blogs[blogDb_1.blogDb.blogs.length - 1];
        const newBlogId = lastBlog ? String(Number(lastBlog.id) + 1) : "0";
        const newBlog = Object.assign({ id: newBlogId }, createBlogDto);
        return new Promise((resolve) => {
            blogDb_1.blogDb.blogs.push(newBlog);
            resolve(http_status_codes_interface_1.HttpStatusCodes.CREATED);
        });
    }
    deleteAll() {
        return new Promise((resolve) => {
            blogDb_1.blogDb.blogs = [];
            resolve(true);
        });
    }
    update(id, updateBlogDto) {
        return new Promise((resolve, reject) => {
            let updatedBlog;
            blogDb_1.blogDb.blogs.forEach((blog, index) => {
                if (blog.id === id) {
                    blogDb_1.blogDb.blogs[index] = Object.assign({ id }, updateBlogDto);
                    updatedBlog = blogDb_1.blogDb.blogs[index];
                }
            });
            if (updatedBlog) {
                resolve(updatedBlog);
            }
            else {
                reject(null);
            }
        });
    }
};
exports.BlogRepository = BlogRepository;
exports.BlogRepository = BlogRepository = __decorate([
    (0, inversify_1.injectable)()
], BlogRepository);
