import { Fragment, useEffect, useRef, useState, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import axiosAPI from "../../config/userConfig"
import { useParams } from "react-router-dom";
import UserContext from "../../contexts/user-context";

export default function AvatarModal({
  isOpen,
  isUserSelf,
  onClose,
  setAvatar
}: {
  isOpen: boolean;
  isUserSelf: boolean;
  onClose: () => void;
  setAvatar: any;
}) {
  const cancelButtonRef = useRef(null);
  // const [imgs, setImgs] = useState<string[]>([]);
  const [imgFile, setImgFile] = useState<File>();
  // const { username } = useParams();
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    if (imgFile !== undefined) {
      onClose();
      updateAvatar();
    }
  }, [imgFile]);

  const HandleFileChange = async (e: any) => {
    setImgFile(e.target.files[0]);
  };

  async function updateAvatar() {
    const formData = new FormData();
    user.username !== undefined && formData.append("username", user.username);
    imgFile !== undefined && formData.append("avatar", imgFile);
    await axiosAPI.post("/changeAva", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then((res) => {
      console.log(res);
      setAvatar("data:image/png;base64, " + res.data.res.data);
      if (isUserSelf) {
        setUser({
          ...user,
          avatar: "data:image/png;base64, " + res.data.res.data,
        })
      }
    });
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        initialFocus={cancelButtonRef}
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm">
                <div className="bg-white">
                  <h1 className="flex items-center justify-center h-20 font-bold">
                    Change Profile Photo
                  </h1>
                  <label className="inline-block h-10 w-full">
                    <span className="flex items-center justify-center h-10 border-t-2 text-blue-500 font-bold cursor-pointer">
                      Upload Photo
                    </span>
                    <input
                      data-testid="test-upload"
                      type="file"
                      className="absolute w-full opacity-0 -z-10"
                      onChange={HandleFileChange}
                      accept="image/*"
                    ></input>
                  </label>
                  <span className="flex items-center justify-center h-10 border-t-2 cursor-pointer text-red-500 font-bold">
                    Remove Current Photo
                  </span>
                  <span
                    className="flex items-center justify-center h-10 border-t-2 cursor-pointer"
                    onClick={onClose}
                  >
                    Cancel
                  </span>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
