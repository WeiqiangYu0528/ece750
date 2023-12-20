import { lazy, useReducer, useEffect, useState, useContext } from "react";
import EditProfile from "../components/setting/editProfile";
import ChangePassword from "../components/setting/changePassword";
import Sidebar from "../components/sidebar/sidebar";
import UserContext from "../contexts/user-context";

export default function Profile(props: any) {
  const [option, setOption] = useState("edit");

  function switchOption() {
    switch (option) {
      case "edit":
        return <EditProfile />;
      case "change":
        return <ChangePassword />;
    }
  }

  // async function getPosts() {}

  return (
    <>
      <div className="bg-gray-background">
        <div className="grid grid-cols-5 gap-12 max-w-screen-2xl">
          <div className="col-span-1">
            <Sidebar />
          </div>
          <div className="col-span-4 grid grid-cols-5 mt-10 mb-10">
            <div className="col-start-2 col-span-4 border grid grid-cols-11">
              <div className=" border-r col-span-3 grid grid-rows-6">
                <div className="flex">
                  <img
                    src="/images/logo.png"
                    alt="Instagram"
                    className=" m-auto"
                  />
                </div>
                <div className="row-span-5 border-t">
                  <label
                    data-testid="test-setOptionEdit"
                    className="cursor-pointer inline-block h-10 w-full"
                    onClick={() => setOption("edit")}
                  >
                    <input
                      type="radio"
                      name={option}
                      className="peer/edit hidden"
                      checked={option === "edit"}
                    />
                    <div className="flex pl-5 h-full w-full peer-checked/edit:font-medium peer-checked/edit:border-l-2 peer-checked/edit:border-l-black border-l-2 border-l-transparent hover:bg-gray-100 hover:border-l-2 hover:border-l-gray-200">
                      <p className="my-auto">Edit Profile</p>
                    </div>
                  </label>

                  <label
                    data-testid="test-setOptionChange"
                    className="cursor-pointer inline-block h-10 w-full"
                    onClick={() => setOption("change")}
                  >
                    <input
                      type="radio"
                      name={option}
                      className="peer/change hidden"
                      checked={option === "change"}
                    />
                    <div className="flex pl-5 h-full w-full peer-checked/change:font-medium peer-checked/change:border-l-2 peer-checked/change:border-l-black border-l-2 border-l-transparent hover:bg-gray-100 hover:border-l-2 hover:border-l-gray-200">
                      <p className="my-auto">Change password</p>
                    </div>
                  </label>

                  {/* <label
                    className="cursor-pointer inline-block h-10 w-full"
                    onClick={() => setOption("email")}
                  >
                    <input
                      type="radio"
                      name={option}
                      className="peer/email hidden"
                      checked={option === "email"}
                    />
                    <div className="flex pl-5 h-full w-full peer-checked/email:font-medium peer-checked/email:border-l-2 peer-checked/email:border-l-black border-l-2 border-l-transparent hover:bg-gray-100 hover:border-l-2 hover:border-l-gray-200">
                      <p className="my-auto">Email notifications</p>
                    </div>
                  </label> */}
                </div>
              </div>
              <div className="col-span-8">{switchOption()}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export type userdata = {
  email: string;
};
