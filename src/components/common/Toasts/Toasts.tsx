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
            <Toast id='thread-rate-success' variant="success">
                Thread has been rated!
            </Toast>
            <Toast id="thread-rate-error" variant="error">
                Couldn't rate the thread.
            </Toast>
            <Toast id='thread-create-error' variant="error">
                ok
            </Toast>
            <Toast id="thread-create-success" variant="success">
                ok
            </Toast>
        </>
    );
};

export default Toasts;
