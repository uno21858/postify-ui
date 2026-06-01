import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import useFetch from "../hooks/useFetch";
import { useUser } from "../context/UserContext";
import { GoArrowLeft, GoHeart, GoHeartFill, GoComment, GoPencil, GoTrash } from "react-icons/go";

const Avatar = ({ name = "?", size = "w-8 h-8", text = "text-sm" }) => (
    <div className={`${size} rounded-full bg-grape flex items-center justify-center font-semibold ${text} text-white shrink-0`}>
        {name[0]?.toUpperCase()}
    </div>
);

const PostDetails = () => {
    const { postId, userId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useUser();

    const [newComment, setNewComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editText, setEditText] = useState("");

    const { data: post, loading: loadingPost, refetch: refetchPost } = useFetch(`http://localhost:8000/posts/${postId}`);
    const { data: author } = useFetch(userId ? `http://localhost:8000/users/${userId}` : null);
    const { data: comments, loading: loadingComments, refetch: refetchComments } = useFetch(`http://localhost:8000/posts/${postId}/comments`);
    const { data: likes, refetch: refetchLikes } = useFetch(`http://localhost:8000/posts/${postId}/likes`);
    const { data: users } = useFetch("http://localhost:8000/users/");

    const userMap = users?.reduce((acc, u) => { acc[u.id] = u; return acc; }, {}) ?? {};

    const myLike = likes?.find(l => l.user_id === currentUser?.id);
    const liked = !!myLike;
    const likeCount = likes?.length ?? 0;

    const allComments = comments ?? [];

    const isOwner = currentUser?.id === userId;

    const handleLike = async () => {
        if (!currentUser) return;
        if (myLike) {
            await fetch(`http://localhost:8000/likes/${myLike.id}`, { method: "DELETE" });
        } else {
            await fetch("http://localhost:8000/likes/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: currentUser.id, post_id: postId }),
            });
        }
        refetchLikes();
    };

    const handleComment = async () => {
        if (!newComment.trim() || !currentUser) return;
        setSubmitting(true);
        try {
            const res = await fetch("http://localhost:8000/comments/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: newComment.trim(),
                    user_id: currentUser.id,
                    post_id: postId,
                }),
            });
            if (res.ok) {
                setNewComment("");
                refetchComments();
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        await fetch(`http://localhost:8000/comments/${commentId}`, { method: "DELETE" });
        refetchComments();
    };

    const handleDeletePost = async () => {
        await fetch(`http://localhost:8000/posts/${postId}`, { method: "DELETE" });
        navigate(-1);
    };

    const handleSaveEdit = async () => {
        await fetch(`http://localhost:8000/posts/${postId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ description: editText.trim(), user_id: userId }),
        });
        setEditing(false);
        refetchPost();
    };

    if (loadingPost) return (
        <div className="min-h-screen bg-deep text-white flex items-center justify-center text-mist text-sm">
            Cargando...
        </div>
    );

    const displayName = author ? `${author.name} ${author.lastname}` : "Usuario";

    return (
        <div className="min-h-screen bg-deep text-white flex flex-col">
            <div className="h-[52px] bg-slate border-b border-steel flex items-center px-4 gap-3">
                <button onClick={() => navigate(-1)} className="text-teal">
                    <GoArrowLeft className="w-6 h-6" />
                </button>
                <span className="font-semibold text-base text-teal flex-1">Post</span>
                {isOwner && (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => { setEditText(post.description); setEditing(true); }}
                            className="text-mist hover:text-teal transition-colors"
                        >
                            <GoPencil className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleDeletePost}
                            className="text-mist hover:text-coral transition-colors"
                        >
                            <GoTrash className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto pb-20">
                <div
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                    onClick={() => navigate(`/profile/${userId}`)}
                >
                    <Avatar name={displayName} />
                    <div>
                        <p className="text-sm font-semibold">{displayName}</p>
                        {author?.username && (
                            <p className="text-xs text-mist">@{author.username}</p>
                        )}
                    </div>
                </div>

                {editing ? (
                    <div className="mx-4">
                        <textarea
                            className="w-full bg-slate border border-teal rounded-xl p-4 text-sm text-white resize-none h-32 outline-none"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                        />
                        <div className="flex gap-2 mt-2">
                            <button onClick={handleSaveEdit} className="flex-1 bg-teal text-deep rounded-lg py-1.5 text-sm font-semibold">Guardar</button>
                            <button onClick={() => setEditing(false)} className="flex-1 bg-plum text-white rounded-lg py-1.5 text-sm">Cancelar</button>
                        </div>
                    </div>
                ) : (
                    <div className="mx-4 bg-slate border border-steel rounded-xl overflow-hidden">
                        {post?.image_url && (
                            <img src={post.image_url} alt="" className="w-full max-h-[480px] object-cover" />
                        )}
                        <p className="text-sm leading-relaxed p-4">{post?.description}</p>
                    </div>
                )}

                <div className="flex items-center gap-5 px-4 py-3 border-b border-steel">
                    <button
                        className={`flex items-center gap-1.5 transition-colors ${liked ? "text-coral" : "text-mist"}`}
                        onClick={handleLike}
                    >
                        {liked ? <GoHeartFill className="w-6 h-6" /> : <GoHeart className="w-6 h-6" />}
                        <span className="text-sm">{likeCount}</span>
                    </button>
                    <div className="flex items-center gap-1.5 text-mist">
                        <GoComment className="w-5 h-5" />
                        <span className="text-sm">{allComments.length}</span>
                    </div>
                </div>

                <div className="px-4 py-4 space-y-3">
                    {loadingComments && (
                        <p className="text-sm text-mist">Cargando comentarios...</p>
                    )}
                    {!loadingComments && allComments.length === 0 && (
                        <p className="text-sm text-mist">Sin comentarios aún.</p>
                    )}
                    {allComments.map((comment) => {
                        const commentAuthor = userMap[comment.user_id];
                        const commentName = commentAuthor
                            ? `${commentAuthor.name} ${commentAuthor.lastname}`
                            : comment.user_id?.slice(0, 8) ?? "?";
                        return (
                            <div key={comment.id} className="flex gap-3">
                                <Avatar name={commentName} />
                                <div className="flex-1 bg-plum rounded-xl px-3 py-2">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <p className="text-xs text-teal font-semibold">
                                            {commentAuthor ? `@${commentAuthor.username}` : commentName}
                                        </p>
                                        {currentUser?.id === comment.user_id && (
                                            <button
                                                onClick={() => handleDeleteComment(comment.id)}
                                                className="text-mist hover:text-coral text-xs ml-1 leading-none"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-sm">{comment.content}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {currentUser && (
                <div className="fixed bottom-0 left-0 right-0 bg-slate border-t border-steel px-4 py-3 flex gap-3 items-center">
                    <Avatar name={currentUser.name} size="w-8 h-8" text="text-sm" />
                    <input
                        className="flex-1 bg-deep border border-steel rounded-full px-4 py-2 text-sm text-white placeholder:text-mist outline-none focus:border-teal transition-colors"
                        placeholder="Agregar comentario..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleComment()}
                    />
                    <button
                        onClick={handleComment}
                        disabled={!newComment.trim() || submitting}
                        className="text-teal hover:text-teal-bright font-semibold text-sm disabled:text-mist transition-colors"
                    >
                        Publicar
                    </button>
                </div>
            )}
        </div>
    );
};

export default PostDetails;
