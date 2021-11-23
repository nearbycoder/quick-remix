import { useActionData, redirect } from 'remix';
import type { ActionFunction } from 'remix';
import { createPost } from '~/post';
import invariant from 'tiny-invariant';
import PostForm from '~/components/admin/PostForm';

export let action: ActionFunction = async ({ request }) => {
  let formData = await request.formData();

  let title = formData.get('title');
  let slug = formData.get('slug');
  let markdown = formData.get('markdown');

  let errors: Record<string, boolean> = {};
  if (!title) errors.title = true;
  if (!slug) errors.slug = true;
  if (!markdown) errors.markdown = true;

  if (Object.keys(errors).length) {
    return errors;
  }

  invariant(typeof title === 'string');
  invariant(typeof slug === 'string');
  invariant(typeof markdown === 'string');
  await createPost({ title, slug, markdown });

  return redirect(`/admin/${slug}`);
};

export default function NewPost() {
  let errors = useActionData();

  return (
    <PostForm
      method="post"
      errors={errors}
      submitText="Create Post"
      submittingText="Creating..."
    />
  );
}
