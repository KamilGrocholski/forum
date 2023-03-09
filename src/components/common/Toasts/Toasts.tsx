import Toast from "./Toast";

const Toasts = () => {
  return (
    <>
      <Toast id="post-report-success" variant="success">
        ok
      </Toast>
      <Toast id="post-report-error" variant="error">
        ok
      </Toast>
      <Toast id="post-like-success" variant="success">
        ok
      </Toast>
      <Toast id="post-like-error" variant="error">
        ok
      </Toast>
      <Toast id="post-create-success" variant="success">
        Post created!
      </Toast>
      <Toast id="post-create-error" variant="error">
        Could not create a post
      </Toast>
      <Toast id="thread-rate-success" variant="success">
        Thread has been rated!
      </Toast>
      <Toast id="thread-rate-error" variant="error">
        Could not rate the thread.
      </Toast>
      <Toast id="thread-create-error" variant="error">
        ok
      </Toast>
      <Toast id="thread-create-success" variant="success">
        ok
      </Toast>
    </>
  );
};

export default Toasts;
