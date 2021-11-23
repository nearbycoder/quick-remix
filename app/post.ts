import path from 'path';
import fs from 'fs/promises';
import parseFrontMatter from 'front-matter';
import invariant from 'tiny-invariant';
import { processMarkdown } from '@ryanflorence/md';

export type Post = {
  slug: string;
  title: string;
  body: string;
};

type NewPost = {
  title: string;
  slug: string;
  markdown: string;
};

export type UpdatePost = {
  title: string;
  slug: string;
  markdown: string;
};

export type PostMarkdownAttributes = {
  title: string;
};

let postsPath = path.join(__dirname, '../posts');

function isValidPostAttributes(
  attributes: any
): attributes is PostMarkdownAttributes {
  return attributes?.title;
}

export async function getPost(slug: string) {
  let filepath = path.join(postsPath, slug + '.md');
  let file = await fs.readFile(filepath);
  let { attributes, body } = parseFrontMatter(file.toString());
  invariant(
    isValidPostAttributes(attributes),
    `Post ${filepath} is missing attributes`
  );
  let html = await processMarkdown(body);
  return { slug, html, body, title: attributes.title };
}

export async function getPosts() {
  let dir = await fs.readdir(postsPath);

  let files = await Promise.all(
    dir.map(async (filename) => {
      if (filename === '.keep') {
        return;
      }
      let file = await fs.readFile(path.join(postsPath, filename));
      let { attributes } = parseFrontMatter(file.toString());
      invariant(
        isValidPostAttributes(attributes),
        `${filename} has bad meta data!`
      );
      return {
        slug: filename.replace(/\.md$/, ''),
        title: attributes.title,
      };
    })
  );

  return files.filter((f) => f);
}

export async function createPost(post: NewPost) {
  let md = `---\ntitle: ${post.title}\n---\n\n${post.markdown}`;
  await fs.writeFile(path.join(postsPath, post.slug + '.md'), md);
  return getPost(post.slug);
}

export async function deletePost(slug: string) {
  await fs.unlink(path.join(postsPath, slug + '.md'));
  return true;
}

export async function updatePost(post: UpdatePost) {
  let md = `---\ntitle: ${post.title}\n---\n\n${post.markdown}`;
  await fs.writeFile(path.join(postsPath, post.slug + '.md'), md);
  return getPost(post.slug);
}
