import { SQLDataSource } from 'datasource-sql';

export class KnexDatasource extends SQLDataSource {

  getPosts = () => {
    return this.knex
      .select('*')
      .from('posts')
      .orderBy('id', 'desc');
  }

  getPost = async (id) => {
    const result = await this.knex
      .select('*')
      .from('posts')
      .where({ id });

    return result[0];
  }

  newPost = async (title, content) => {
    const result = await this.knex
      .insert({ title, content})
      .into('posts')
      .returning(['id', 'title', 'content']);

    return result[0];
  }

  delPost = async (id) => {
    const result = await this.knex('posts')
      .where({ id })
      .del();

    const msg = result ? "telah di hapus" : "tidak di temukan";

    return `Post ${id} ${msg}`;
  }

}
