export class BlogDataSource {
  constructor(options) {
    console.log(options);

    this.posts = [
      { id: 1, title: 'Hello World', content: 'Hello World' },
      { id: 2, title: 'Lorem Ipsum', content: 'Lorem Ipsum' }
    ];
  }

  getPosts() {
    return this.posts;
  }
}
