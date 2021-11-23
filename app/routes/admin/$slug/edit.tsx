import { useLoaderData, redirect } from 'remix';
import type { ActionFunction, LoaderFunction } from 'remix';
import { updatePost, getPost } from '~/post';
import invariant from 'tiny-invariant';
import PostForm from '~/components/admin/PostForm';

export let action: ActionFunction = async ({ request, params: { slug } }) => {
  let formData = await request.formData();

  let title = formData.get('title');
  let markdown = formData.get('markdown');

  let errors: Record<string, boolean> = {};
  if (!title) errors.title = true;
  if (!markdown) errors.markdown = true;

  if (Object.keys(errors).length) {
    return errors;
  }

  invariant(typeof title === 'string');
  invariant(typeof slug === 'string');
  invariant(typeof markdown === 'string');
  await updatePost({ title, slug, markdown });

  return redirect(`/admin/${slug}`);
};

export let loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, 'expected params.slug');
  return getPost(params.slug);
};

export default function EditPost() {
  let post = useLoaderData();

  return (
    <PostForm
      method="patch"
      post={post}
      submitText="Update Post"
      submittingText="Updating..."
    />
  );
}
