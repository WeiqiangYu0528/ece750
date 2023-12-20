import React from "react";
import axiosAPI from "../../config/userConfig";
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import UserContext from "../../contexts/user-context";

export default function ChangePassword() {
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [newPwdConf, setNewPwdConf] = useState("");

  const [isAlert, setIsAlert] = useState<Boolean>(false);
  const [isPwdSame, setIsPwdSame] = useState<Boolean>(true);
  const [isOldPwdRight, setIsOldPwdRight] = useState<Boolean>(true);

  const { user, setUser } = useContext(UserContext);

  async function changePwd() {
    if (newPwd !== newPwdConf) {
      setIsPwdSame(false);
    } else {
      setIsPwdSame(true);
      const formData = new FormData();
      formData.append("oldPwd", oldPwd);
      formData.append("newPwd", newPwd);

      console.log(oldPwd);
      console.log(newPwd);

      await axiosAPI.post(`/changePwd/${user.username}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }).then((res) => {
        console.log(res);
        if (res.data.sign === 1) {
          setIsAlert(true);
          setIsOldPwdRight(true);
          setOldPwd("");
          setNewPwd("");
          setNewPwdConf("");
        } else {
          setIsOldPwdRight(false);
        }
      });
    }
  }

  return (
    <>
      <div className=" mx-auto">
        <div className="grid grid-flow-col grid-cols-7 mt-5">
          <span className="block text-sm font-medium text-slate-700 mr-5 col-span-2 mx-auto">
            Old password
          </span>
          <input
            data-testid="test-setOldPwd"
            type={"password"}
            defaultValue={oldPwd}
            onChange={(event) => setOldPwd(event.target.value)}
            className="  col-span-3 border-slate-200 placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500 border"
          />
        </div>
        <div className="grid grid-flow-col grid-cols-7 mt-5">
          <span className="block text-sm font-medium text-slate-700 mr-5 col-span-2 mx-auto">
            New password
          </span>
          <input
            data-testid="test-setNewPwd"
            type={"password"}
            defaultValue={newPwd}
            onChange={(event) => setNewPwd(event.target.value)}
            className="  col-span-3 border-slate-200 placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500 border"
          />
        </div>
        <div className="grid grid-flow-col grid-cols-7 mt-5">
          <span className="block text-sm font-medium text-slate-700 mr-5 col-span-2 mx-auto">
            Confirm new password
          </span>
          <input
            data-testid="test-setNewPwdConf"
            type={"password"}
            defaultValue={newPwdConf}
            onChange={(event) => setNewPwdConf(event.target.value)}
            className="  col-span-3 border-slate-200 placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500 border"
          />
        </div>
        <div className={`flex ${isPwdSame ? "hidden" : ""}`}>
          <span className="block text-sm font-medium text-red-700 mx-auto">
            Please make sure both passwords match.
          </span>
        </div>
        <div className={`flex ${isOldPwdRight ? "hidden" : ""}`}>
          <span className="block text-sm font-medium text-red-700 mx-auto">
            Your old password was entered incorrectly. Please enter it again.
          </span>
        </div>

        <div className="mt-5 flex">
          <button
            data-testid="test-changePwd"
            className=" h-8 w-28 mx-auto bg-sky-500 hover:bg-sky-700 rounded-full text-sm font-medium text-slate-200"
            onClick={() => changePwd()}
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
              <p className="font-bold">The password has changed</p>
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
