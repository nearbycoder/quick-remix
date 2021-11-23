import { useLoaderData, Link, Outlet } from 'remix';
import { Form, redirect } from 'remix';
import type { LoaderFunction, ActionFunction } from 'remix';
import { getPost, deletePost } from '~/post';
import invariant from 'tiny-invariant';

export let loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, 'expected params.slug');
  return getPost(params.slug);
};

export let action: ActionFunction = async ({ request }) => {
  let formData = await request.formData();

  let slug = formData.get('slug');

  let errors: Record<string, boolean> = {};
  if (!slug) errors.title = true;

  if (Object.keys(errors).length) {
    return errors;
  }

  invariant(typeof slug === 'string');
  await deletePost(slug);

  return redirect(`/admin`);
};

export default function AdminPost() {
  let post = useLoaderData();
  return (
    <div>
      <Outlet />
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
      <Form method="delete">
        <Link to="edit">Edit</Link>
        <input type="hidden" value={post.slug} name="slug" />
        <button className="link" style={{ color: '#f09eb7' }} type="submit">
          Delete
        </button>
      </Form>
    </div>
  );
}
