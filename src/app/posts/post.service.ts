import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post } from './post.model';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

  _notifyTheFuckers(posts) {
    this.posts = posts;
    return this.postsUpdated.next([...this.posts]);
  }

  getPosts () {
    this.http
      .get<{message: string, posts: any}>(
        'http://localhost:3000/api/posts'
      )
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          };
        });
      }))
      .subscribe((transformedPosts) => {
          this._notifyTheFuckers(transformedPosts);
      });
  }

  getPostUpdateListener () {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string){
    return this.http.get<{_id: string, title: string, content: string}>(`http://localhost:3000/api/posts/${id}`);
  }

  addPost(title: string, content: string) {
    const post: Post = {
      id: null,
      title: title,
      content: content
    };
    this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
      .subscribe( (responseData) => {
        post.id = responseData.postId;
        this._notifyTheFuckers(this.posts.concat([post]));
        this.router.navigate(["/"]);
      });
  }

  updatePost(id: string, title: string, content: string){
    const post: Post = {
      id: id,
      title: title,
      content: content
    }
    this.http.put(`http://localhost:3000/api/posts/${id}`, post)
      .subscribe((response) => {
        const updatedPosts = [...this.posts];
        const oldPost = updatedPosts.findIndex(p => p.id === post.id);
        updatedPosts[oldPost] = post;
        this._notifyTheFuckers(updatedPosts);
        this.router.navigate(["/"]);
      })
  }

  deletePost(id: string) {
    console.log(id);
    this.http.delete(`http://localhost:3000/api/posts/${id}`)
      .subscribe((responseData) => {
        this._notifyTheFuckers(this.posts.filter(post => post.id !== id));
      });
  }
}
