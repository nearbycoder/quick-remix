import React from 'react';
import { Form, useTransition, useActionData } from 'remix';
import type { FormMethod } from 'remix';
import type { Post } from '~/post';

export default function PostForm({
  method,
  post,
  submitText,
  submittingText,
}: {
  method: FormMethod;
  post?: Post;
  submitText: string;
  submittingText: string;
}) {
  let transition = useTransition();
  let errors = useActionData();

  return (
    <Form method={method}>
      <p>
        <label>Post Title: {errors?.title && <em>Title is required</em>}</label>
        <input defaultValue={post?.title} type="text" name="title" />
      </p>
      {method === 'post' ? (
        <p>
          <label>Post Slug: {errors?.slug && <em>Slug is required</em>}</label>
          <input type="text" name="slug" />
        </p>
      ) : (
        <p>
          <label>Post Slug: {post?.slug}</label>
        </p>
      )}
      <p>
        <label htmlFor="markdown">Markdown:</label>{' '}
        {errors?.markdown && <em>Markdown is required</em>}
        <br />
        <textarea
          defaultValue={post?.body}
          style={{ width: '100%' }}
          rows={20}
          name="markdown"
        />
      </p>
      <p>
        <button type="submit">
          {transition.submission ? submittingText : submitText}
        </button>
      </p>
    </Form>
  );
}
