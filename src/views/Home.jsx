import { useState } from "react";
import { useNavigate } from "react-router";
import useFetch from "../hooks/useFetch";
import BottomNav from "../components/BottomNav";
import CreatePostModal from "../components/CreatePostModal";
import { useUser } from "../context/UserContext";
import { GoHeart, GoComment, GoPlus } from "react-icons/go";

const Avatar = ({ name = "?", size = "w-8 h-8", text = "text-sm" }) => (
    <div className={`${size} rounded-full bg-plum flex items-center justify-center font-semibold ${text} text-white shrink-0`}>
        {name[0]?.toUpperCase()}
    </div>
);

const Home = () => {
    const navigate = useNavigate();
    const { currentUser } = useUser();
    const [showCreate, setShowCreate] = useState(false);
    const { data: posts, loading: loadingPosts, refetch: refetchPosts } = useFetch("http://localhost:8000/posts");
    const { data: users } = useFetch("http://localhost:8000/users/");

    const userMap = users?.reduce((acc, u) => {
        acc[u.id] = u;
        return acc;
    }, {}) ?? {};

    return (
        <div className="flex flex-col min-h-screen bg-deep text-white">
            <div className="h-[52px] bg-slate border-b border-steel flex items-center px-4">
                <span className="text-lg font-bold tracking-tight text-teal">Postify</span>
            </div>

            <div className="flex-1 overflow-y-auto pb-[56px]">
                {loadingPosts && (
                    <div className="flex items-center justify-center h-40 text-mist text-sm">
                        Cargando...
                    </div>
                )}

                {!loadingPosts && posts?.length === 0 && (
                    <div className="flex items-center justify-center h-40 text-mist text-sm">
                        No hay posts aún.
                    </div>
                )}

                {posts?.map((post) => {
                    const author = userMap[post.user_id];
                    const displayName = author ? `${author.name} ${author.lastname}` : "Usuario";
                    const username = author?.username ?? post.user_id?.slice(0, 8);

                    return (
                        <div key={post.id} className="border-b border-steel">
                            <div
                                className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                                onClick={() => navigate(`/profile/${post.user_id}`)}
                            >
                                <Avatar name={displayName} />
                                <div>
                                    <p className="text-sm font-semibold">{displayName}</p>
                                    <p className="text-xs text-mist">@{username}</p>
                                </div>
                            </div>

                            <div
                                className="bg-slate mx-4 rounded-xl overflow-hidden cursor-pointer active:bg-plum transition-colors"
                                onClick={() => navigate(`/profile/${post.user_id}/posts/${post.id}`)}
                            >
                                {post.image_url && (
                                    <img src={post.image_url} alt="" className="w-full max-h-96 object-cover" />
                                )}
                                <p className="text-sm leading-relaxed p-4">{post.description}</p>
                            </div>

                            <div className="flex items-center gap-5 px-4 py-3">
                                <button className="flex items-center gap-1.5 text-mist active:text-coral transition-colors">
                                    <GoHeart className="w-6 h-6" />
                                </button>
                                <button
                                    className="flex items-center gap-1.5 text-mist hover:text-teal transition-colors"
                                    onClick={() => navigate(`/profile/${post.user_id}/posts/${post.id}`)}
                                >
                                    <GoComment className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {currentUser && (
                <button
                    onClick={() => setShowCreate(true)}
                    className="fixed bottom-[72px] right-4 w-12 h-12 bg-teal hover:bg-teal-bright active:bg-steel rounded-full flex items-center justify-center shadow-lg transition-colors z-10"
                >
                    <GoPlus className="w-6 h-6 text-deep" />
                </button>
            )}

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

export default Home;
