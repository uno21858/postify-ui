import { useParams } from "react-router";
import useFetch from "../hooks/useFetch";

const PostDetails = () => {
    const { postId } = useParams();
    const url = `http://localhost:8000/posts/${postId}`;
    const { data, loading, error } = useFetch(url);

    if (loading) return <div className="p-4">Loading...</div>;
    if (error) return <div className="p-4">Error: {error}</div>;

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-4">
            <div className="max-w-md mx-auto bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-neutral-800">
                    <p className="text-sm text-neutral-400">Post</p>
                    <h1 className="text-lg font-semibold">{data.description}</h1>
                </div>

                <div className="grid grid-cols-2 text-center border-b border-neutral-800">
                    <div className="p-3">
                        <p className="text-xl font-bold">{data.likes?.length ?? 0}</p>
                        <p className="text-xs text-neutral-400">Likes</p>
                    </div>
                    <div className="p-3 border-l border-neutral-800">
                        <p className="text-xl font-bold">{data.comments?.length ?? 0}</p>
                        <p className="text-xs text-neutral-400">Comments</p>
                    </div>
                </div>

                <div className="p-4 space-y-3">
                    <h2 className="font-semibold">Comments</h2>

                    {data.comments?.length === 0 && (
                        <p className="text-sm text-neutral-400">No comments yet.</p>
                    )}

                    {data.comments?.map((comment) => (
                        <div key={comment.id} className="bg-neutral-800 rounded-md p-3">
                            <p>{comment.content}</p>
                            <p className="text-xs text-neutral-500 mt-1">{comment.user_id}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PostDetails;
