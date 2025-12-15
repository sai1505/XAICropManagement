import { useState } from "react";
import downArrow from "/imgs/XCropAIDownArrow.png"
import DropDownModern from "../UI/DropDownModern";
import maleAvatar from "/imgs/avatars/MaleAvatar.svg";
import femaleAvatar from "/imgs/avatars/FemaleAvatar.svg";
import XCropAICover1 from "/imgs/covers/XCropAICover1.png";
import XCropAICover2 from "/imgs/covers/XCropAICover2.png";
import XCropAICover3 from "/imgs/covers/XCropAICover3.png";
import XCropAICover4 from "/imgs/covers/XCropAICover4.png";
import XCropAICover5 from "/imgs/covers/XCropAICover5.png";

export default function UserProfile() {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: "Sai Venkat",
        email: "user@xcropai.com",
        role: "Farmer",
        gender: "Male",
        cover: "cover1",
    });

    const avatarByGender = {
        Male: maleAvatar,
        Female: femaleAvatar,
    };

    const coverOptions = [
        { id: "cover1", img: XCropAICover1 },
        { id: "cover2", img: XCropAICover2 },
        { id: "cover3", img: XCropAICover3 },
        { id: "cover4", img: XCropAICover4 },
        { id: "cover5", img: XCropAICover5 },
    ];


    return (
        <div className="min-h-screen bg-white">
            {/* Cover */}
            <div className="relative mt-20 h-76 rounded-b-3xl overflow-hidden">
                <img
                    src={coverOptions.find(c => c.id === profile.cover)?.img}
                    alt="cover"
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {isEditing && (
                    <div className="absolute right-3 top-3 z-50">
                        <div className="w-100 bg-white rounded-2xl shadow-xl p-4">
                            <p className="text-sm font-poppins font-medium text-gray-700 mb-3">
                                Choose cover
                            </p>

                            <div className="flex flex-wrap gap-3">
                                {coverOptions.map((c) => (
                                    <button
                                        key={c.id}
                                        onClick={() => setProfile({ ...profile, cover: c.id })}
                                        className={`relative h-16 w-16 rounded-xl overflow-hidden border transition
                                    ${profile.cover === c.id
                                                ? "border-black"
                                                : "border-neutral-200 hover:border-neutral-400"}`}
                                    >
                                        <img
                                            src={c.img}
                                            alt={c.id}
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />

                                        {/* Selected overlay */}
                                        {profile.cover === c.id && (
                                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                                <span className="text-white text-xs font-semibold">
                                                    Selected
                                                </span>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/* Profile Card */}
            <div className="relative max-w-4xl mx-auto -mt-10 px-4 z-20">
                <div className="bg-white font-poppins rounded-3xl shadow-lg p-6">
                    <div className="flex items-center gap-6">
                        <img
                            src={avatarByGender[profile.gender]}
                            className="w-28 h-28 rounded-full border-4 border-white -mt-16"
                        />

                        <div className="flex-1">
                            <h2 className="text-2xl font-semibold text-gray-900">
                                {profile.name}
                            </h2>
                            <p className="text-gray-500 text-sm">{profile.email}</p>
                        </div>

                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="px-4 py-2 rounded-3xl text-sm bg-gray-900 text-white hover:bg-gray-800"
                        >
                            {isEditing ? "Cancel" : "Edit"}
                        </button>
                    </div>

                    {/* Details */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <DropDownModern
                            label="Role"
                            value={profile.role}
                            disabled={!isEditing}
                            options={["Farmer", "Researcher", "Student"]}
                            onChange={(v) => {
                                if (!isEditing) return;
                                setProfile({ ...profile, role: v });
                            }}
                        />

                        <DropDownModern
                            label="Gender"
                            value={profile.gender}
                            disabled={!isEditing}
                            options={["Male", "Female"]}
                            onChange={(v) => {
                                if (!isEditing) return;
                                setProfile({ ...profile, gender: v });
                            }}
                        />
                    </div>

                    {isEditing && (
                        <div className="mt-8 flex justify-end gap-4">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-5 py-2 rounded-3xl bg-lime-200 hover:bg-lime-400"
                            >
                                Save Changes
                            </button>
                        </div>
                    )}

                    {/* Logout */}
                    <div className="mt-10 border-t border-neutral-400 pt-6">
                        <button className="text-red-600 hover:underline text-sm">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
}