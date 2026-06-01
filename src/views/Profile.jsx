import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router";
import useFetch from "../hooks/useFetch";
import BottomNav from "../components/BottomNav";
import CreatePostModal from "../components/CreatePostModal";
import { useUser } from "../context/UserContext";
import { GoArrowLeft, GoGear, GoPlus } from "react-icons/go";

const Avatar = ({ name = "?", size = "w-20 h-20", text = "text-2xl" }) => (
    <div className={`${size} rounded-full bg-grape flex items-center justify-center font-bold ${text} text-white shrink-0`}>
        {name[0]?.toUpperCase()}
    </div>
);

const Profile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { currentUser, logout } = useUser();

    const isOwnProfile = currentUser?.id === userId;
    const [showCreate, setShowCreate] = useState(false);

    const { data: posts, loading: loadingPosts, refetch: refetchPosts } = useFetch(`http://localhost:8000/users/${userId}/posts`);
    const { data: user, loading: loadingUser } = useFetch(`http://localhost:8000/users/${userId}`);

    const handleGetPost = useCallback(
        (postId) => navigate(`/profile/${userId}/posts/${postId}`),
        [navigate, userId]
    );

    const displayName = user ? `${user.name} ${user.lastname}` : "Erick";

    return (
        <div className="flex flex-col min-h-screen bg-deep text-white">
            <div className="h-[52px] bg-slate border-b border-steel flex items-center px-4 gap-3">
                {!isOwnProfile && (
                    <button onClick={() => navigate(-1)} className="text-teal mr-1">
                        <GoArrowLeft className="w-6 h-6" />
                    </button>
                )}
                <span className="text-base font-semibold flex-1">
                    {loadingUser ? "..." : user?.username ?? displayName}
                </span>
                {isOwnProfile && (
                    <>
                        <button onClick={() => setShowCreate(true)} className="text-teal mr-1">
                            <GoPlus className="w-5 h-5" />
                        </button>
                        <button onClick={logout} className="text-mist hover:text-teal transition-colors">
                            <GoGear className="w-5 h-5" />
                        </button>
                    </>
                )}
            </div>

            <div className="flex-1 overflow-y-auto pb-[56px]">
                <div className="px-4 py-5 flex gap-6 items-center">
                    <Avatar name={displayName} />
                    <div className="flex gap-6">
                        <div className="text-center">
                            <p className="font-bold text-lg text-white">{posts?.length ?? 0}</p>
                            <p className="text-xs text-mist">posts</p>
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-lg text-white">0</p>
                            <p className="text-xs text-mist">seguidores</p>
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-lg text-white">0</p>
                            <p className="text-xs text-mist">siguiendo</p>
                        </div>
                    </div>
                </div>

                <div className="px-4 pb-4">
                    <p className="font-semibold text-sm">{displayName}</p>
                    {user?.email && (
                        <p className="text-xs text-mist mt-0.5">{user.email}</p>
                    )}
                </div>

                {!isOwnProfile && (
                    <div className="px-4 pb-4">
                        <button className="w-full bg-grape hover:bg-grape-bright active:bg-plum transition-colors rounded-lg py-2 text-sm font-semibold">
                            Seguir
                        </button>
                    </div>
                )}

                {loadingPosts ? (
                    <div className="flex items-center justify-center h-40 text-mist text-sm">
                        Cargando posts...
                    </div>
                ) : posts?.length === 0 ? (
                    <div className="flex items-center justify-center h-40 text-mist text-sm">
                        Sin posts aún
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-0.5">
                        {posts?.map((post) => (
                            <div
                                key={post.id}
                                onClick={() => handleGetPost(post.id)}
                                className="aspect-square bg-slate cursor-pointer hover:bg-plum transition-colors overflow-hidden relative"
                            >
                                {post.image_url ? (
                                    <img src={post.image_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <p className="text-xs text-white/80 line-clamp-5 leading-relaxed p-2">
                                        {post.description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="fixed bottom-0 left-0 right-0">
                <BottomNav />
            </div>

            {showCreate && (
                <CreatePostModal
                    onClose={() => setShowCreate(false)}
                    onCreated={() => { setShowCreate(false); refetchPosts(); }}
                />
            )}
        </div>
    );
};

export default Profile;
