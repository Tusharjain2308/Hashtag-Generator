import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_PATHS } from "../../utils/apiPaths";

const AccountInfo = () => {
    const [accountData, setAccountData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAccountInfo = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(API_PATHS.HASHTAGS.ACCOUNT_INFO, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setAccountData(res.data);
            } catch (err) {
                console.error('Error details:', err);
                if (err.response) {
                    setError(`Backend error: ${err.response.data?.message || 'Unknown error'}`);
                } else {
                    setError("Failed to load account information.");
                }
            } finally {
                setLoading(false);
            }

        };

        fetchAccountInfo();
    }, []);

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (error) return <div className="text-red-500 text-center py-10">{error}</div>;

    // Ensure accountData.history is always an array
    const history = accountData?.history || [];

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">👤 Account Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                    <p><strong>Name:</strong> {accountData.name || "N/A"}</p>
                    <p><strong>Username:</strong> {accountData.username || "N/A"}</p>
                    <p><strong>Email:</strong> {accountData.email}</p>
                    <p><strong>Joined:</strong> {new Date(accountData.createdAt).toLocaleDateString()}</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">📜 Hashtag History</h2>
                {history.length === 0 ? (
                    <p className="text-gray-500">No hashtag generations yet.</p>
                ) : (
                    <ul className="space-y-4">
                        {history.map((item) => (
                            <li
                                key={item._id}
                                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                            >
                                <p className="text-sm text-gray-600">
                                    <strong>Topic:</strong> {item.topic} | <strong>Platform:</strong> {item.platform}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <strong>Vibe:</strong> {item.vibe} | <strong>Post Type:</strong> {item.postType}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {item.hashtags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="bg-indigo-100 text-indigo-700 text-sm font-medium px-2.5 py-1 rounded-full"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-400 mt-2">
                                    Generated on: {new Date(item.createdAt).toLocaleString()}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default AccountInfo;
