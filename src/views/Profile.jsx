import { useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import useFetch from "../hooks/useFetch";
import { GoHomeFill, GoVideo, GoPaperAirplane, GoSearch, GoCopilot } from "react-icons/go";

const Profile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();

    const urlPosts = `http://localhost:8000/users/${userId}/posts`;
    const { data, loading, error } = useFetch(urlPosts);

    const handleGetPosts = useCallback(
        (postId) => {
            navigate(`/profile/${userId}/posts/${postId}`);
        },
        [navigate, userId]
    );

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="flex flex-col min-h-screen bg-neutral-950 text-white">
            <div className="h-[80px] bg-neutral-900 border-b border-neutral-800 flex items-center gap-4 px-4">
                <div className="font-semibold">Erick</div>
                <div className="text-sm text-neutral-300">followers</div>
                <div className="text-sm text-neutral-300">posts</div>
            </div>

            <div className="flex-1 grid grid-cols-3 gap-2 p-3 bg-neutral-950">
                {data.map((post) => (
                    <div
                        key={post.id}
                        onClick={() => handleGetPosts(post.id)}
                        className="aspect-square bg-neutral-800 rounded-md p-3 text-sm text-white border border-neutral-700 overflow-hidden cursor-pointer"
                    >
                        {post.description}
                    </div>
                ))}
            </div>

            <div className="h-[56px] bg-neutral-900 border-t border-neutral-800 flex items-center justify-around">
                <GoHomeFill className="w-6 h-6" />
                <GoVideo className="w-6 h-6" />
                <GoPaperAirplane className="w-6 h-6" />
                <GoSearch className="w-6 h-6" />
                <GoCopilot className="w-6 h-6" />
            </div>
        </div>
    );
};

export default Profile;
