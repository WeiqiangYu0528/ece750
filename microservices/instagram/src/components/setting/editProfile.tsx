import React from "react";
import axiosAPI from "../../config/userConfig";
import { useState, useEffect, useContext } from "react";
import AvatarModal from "../profile/avatarModal";
import UserContext from "../../contexts/user-context";

export default function EditProfile() {
  const [isAvatarOpen, setAvatarOpen] = useState(false);
  const [avatar, setAvatar] = useState("/images/avatars/default_avatar.jpg");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("privacy");
  const [isAlert, setIsAlert] = useState<Boolean>(false);
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    try {
      const requestBody = {
        username: user.username,
        loadedNumber: 0
      }
      await axiosAPI.post("/profile", requestBody).then((res) => {
          console.log(res.data);
          if (res.data.avatar !== null) {
            setAvatar("data:image/png;base64, " + res.data.avatar.data);
          } else {
            setAvatar("/images/avatars/default_avatar.jpg");
          }
          setName(res.data.fullname);
          setUsername(res.data.username);
          setEmail(res.data.email);
          if (res.data.phoneNumber === null) setPhone("");
          else setPhone(res.data.phoneNumber);
          if (res.data.gender === null) setGender("privacy");
          else setGender(res.data.gender);
        });
    } catch (err) {
      console.error(err);
    }
  }

  async function updateUser() {
    const formData = new FormData();
    formData.append("fullname", name);
    formData.append("username", user.username);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("gender", gender);
    await axiosAPI
      .post(`/update/${user.username}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        console.log(res);
        setIsAlert(true);
        setUser({
          ...user,
          username: username,
        });
        console.log(user);
      });
  }

  return (
    <>
      <div>
        <AvatarModal
          isOpen={isAvatarOpen}
          isUserSelf={true}
          setAvatar={setAvatar}
          onClose={() => setAvatarOpen(false)}
        ></AvatarModal>
        <div className="grid grid-flow-col grid-cols-7 mt-5">
          <div className="col-span-2">
            <img
              className="rounded-full w-12 h-12 flex mr-3 mx-auto"
              src={avatar}
              alt="abc"
            />
          </div>
          <div className="col-span-3 grid grid-flow-row">
            <span>{user.username}</span>
            <span
              data-testid="test-setAvatarOpen"
              onClick={() => setAvatarOpen(true)}
              className="  text-blue-600 cursor-pointer"
            >
              Change profile photo
            </span>
          </div>
        </div>
        <div className="grid grid-flow-col grid-cols-7 mt-5">
          <span className="block text-sm font-medium text-slate-700 mr-5 col-span-2 mx-auto">
            Name
          </span>
          <input
            data-testid="test-setName"
            type={"text"}
            defaultValue={name}
            onChange={(event) => setName(event.target.value)}
            className="  col-span-3 border-slate-200 placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500 border"
          />
        </div>
        <div className="grid grid-flow-col grid-cols-7 mt-5">
          <span className="block text-sm font-medium text-slate-700 mr-5 col-span-2 mx-auto">
            Username
          </span>
          <input
            type={"text"}
            defaultValue={username}
            disabled={true}
            className="  col-span-3 border-slate-200 placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500 border"
          />
        </div>
        <div className="grid grid-flow-col grid-cols-7 mt-5">
          <span className="block text-sm font-medium text-slate-700 mr-5 col-span-2 mx-auto">
            Email
          </span>
          <input
            data-testid="test-setEmail"
            type={"text"}
            defaultValue={email}
            onChange={(event) => setEmail(event.target.value)}
            className="  col-span-3 border-slate-200 placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500 border"
          />
        </div>
        <div className="grid grid-flow-col grid-cols-7 mt-5">
          <span className="block text-sm font-medium text-slate-700 mr-5 col-span-2 mx-auto">
            Phone number
          </span>
          <input
          data-testid="test-setPhone"
            type={"text"}
            defaultValue={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="  col-span-3 border-slate-200 placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500 border"
          />
        </div>
        <div className="grid grid-flow-col grid-cols-7 mt-5">
          <span className="block text-sm font-medium text-slate-700 mr-5 col-span-2 mx-auto">
            Gender
          </span>
          <div className="col-span-5">
            <div className="radio ">
              <label data-testid="test-setGenderMale">
                <input
                  type="radio"
                  value="male"
                  checked={gender === "male"}
                  onChange={() => setGender("male")}
                />
                Male
              </label>
            </div>
            <div className="radio">
              <label data-testid="test-setGenderFemale">
                <input
                  type="radio"
                  value="female"
                  checked={gender === "female"}
                  onChange={() => setGender("female")}
                />
                Female
              </label>
            </div>
            <div className="radio">
              <label data-testid="test-setGenderPrivacy">
                <input
                  type="radio"
                  value="privacy"
                  checked={gender === "privacy"}
                  onChange={() => setGender("privacy")}
                />
                Prefer not to say
              </label>
            </div>
          </div>
        </div>
        <div className="mt-5 flex">
          <button
            data-testid="test-updateUser"
            className=" h-8 w-28 mx-auto bg-sky-500 hover:bg-sky-700 rounded-full text-sm font-medium text-slate-200"
            onClick={() => updateUser()}
          >
            Save changes
          </button>
        </div>

        <div
          className={`bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md  mt-5 ${
            isAlert ? "" : "hidden"
          }`}
          role="alert"
        >
          <div className="grid grid-flow-col grid-cols-7">
            <div className="py-1 col-span-1">
              <svg
                className="fill-current h-6 w-6 text-teal-500 mr-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
              </svg>
            </div>
            <div className=" col-span-5">
              <p className="font-bold">The user profile has changed</p>
              <p className="text-sm">
                Make sure you know how these changes affect you.
              </p>
            </div>
            <div>
              <svg
                data-testid="test-setIsAlert"
                className="fill-current h-6 w-6 text-red-500 float-right"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                onClick={() => {
                  setIsAlert(false);
                }}
              >
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
