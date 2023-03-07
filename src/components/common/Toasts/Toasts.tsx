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
    </>
  );
};

export default Toasts;
