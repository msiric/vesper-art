import * as Yup from 'yup';

export const commentValidation = Yup.object().shape({
  commentContent: Yup.string().trim().required('Comment cannot be empty'),
});
