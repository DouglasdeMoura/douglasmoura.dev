import fs from 'fs';
import { join } from 'path';
import { formatRFC3339 } from 'date-fns';
import matter from 'gray-matter';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import RSS from 'rss-generator';

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  modified: string;
  featuredImage: string;
  content: any;
  locale: string;
  filename: string;
  source?: any;
}

export default class Posts {
  private postsList = [];
  private postsDirectory = '';

  constructor(postsDirectory: string) {
    this.postsDirectory = postsDirectory;
    this.postsList = this.readPostsDirectory();
  }

  private readPostsDirectory(): string[] {
    try {
      return fs.readdirSync(this.postsDirectory)
    } catch (error) {
      throw new Error(`Invalid directory: ${error}`);
    }
  }

  private processPost(post: string): Post {
    const source = fs.readFileSync(join(this.postsDirectory, post), 'utf8');
    const { content, data } = matter(source);

    return {
      id: data.id,
      title: data.title,
      slug: post.replace(/\.md?(x)$/, '').replace(/^\d{4}-\d{2}-\d{2}_/, ''),
      date: data.date.toString(),
      modified: data.modified.toString(),
      excerpt: data.excerpt,
      locale: data.locale,
      featuredImage: data.featuredImage,
      content,
      source,
      filename: post,
    };
  }

  public create(post: Partial<Post>) {
    const date = formatRFC3339(new Date()).toString();
    const title = 'Create an awesome post!'

    const defaultData: Post = {
      id: uuidv4(),
      title,
      slug: _.kebabCase(title),
      date,
      modified: date,
      content: '',
      excerpt: '',
      featuredImage: '',
      locale: 'en',
      filename: `${date}_${_.kebabCase(title)}.mdx`,
    }
    const data = { ...defaultData, post };
    const stream = fs.createWriteStream(`${this.postsDirectory}/${data.filename}`);

    stream.once('open', () => {
      stream.write('---\n');
      stream.write(`id: ${data.id}\n`);
      stream.write(`title: ${data.title}\n`);
      stream.write(`excerpt: ${data.excerpt}\n`);
      stream.write(`date: ${date}\n`);
      stream.write(`modified: ${date}\n`);
      stream.write(`featuredImage: ${data.featuredImage}\n`);
      stream.write('---\n');
      stream.write(`${data.content}\n`);
      stream.end();
    });
  }

  get all(): Post[] {
    return (
      this.postsList
        .map(post => this.processPost(post))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );
  }

  get feed() {
    const feed = new RSS({
      title: process.env.SITE_NAME,
      description: process.env.SITE_NAME,
      site_url: 'https://douglasmoura.dev/',
      feed_url: 'https://douglasmoura.dev/feed.xml',
    });

    this.all.map(item => {
      feed.item({
        guid: item.id,
        title: item.title,
        author: 'Douglas Moura',
        url: `https://douglasmoura.dev/${item.slug}`,
        description: item.excerpt,
        date: item.date,
      });
    });

    return feed;
  }
}
