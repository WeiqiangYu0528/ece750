import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { postModal } from "./postType";
import Header from "./header";
import ModalComments from "./modal-comments";
import Actions from "./actions";
import AddComment from "./add-comment";
import Media from "./media";

export default function Modal(props: postModal) {
  const [mediaIdx, setMediaIdx] = useState(0);
  const media = props.mediaList[mediaIdx];
  const [replyUser, setReplyUser] = useState("");
  const [commentId, setCommentId] = useState("");

  const cancelButtonRef = useRef(null);

  const handleClose = () => {
    props.onClose();
    setReplyUser("");
    setCommentId("");
  };

  return (
    <Transition.Root show={props.open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        data-testid="modal"
        initialFocus={cancelButtonRef}
        onClose={handleClose}
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
          <div
            className={`fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity`}
          />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex max-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative grid grid-cols-2 gap-2 transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-5/6 h-4/6">
                <div className="container bg-black col-span-1 pt-6 pb-6" data-userid="post-modal">
                  <div className="sm:flex sm:items-start ">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left">
                      <div className="relative bg-black pb-[100%]">
                        <Media
                          type={media.type}
                          data={media.data}
                          controls={true}
                        />
                        {mediaIdx > 0 && (
                          <button
                            data-testid="prev"
                            className="absolute top-1/2 left-[5%] text-sm z-10 text-white cursor-pointer bg-[#1a1a1acc]  rounded-full px-2 py-0.5 font-bold"
                            onClick={() => {
                              setMediaIdx(mediaIdx - 1);
                            }}
                          >
                            &#10094;
                          </button>
                        )}
                        {mediaIdx < props.mediaList.length - 1 && (
                          <button
                            data-testid="next"
                            className="absolute top-1/2 right-[5%] text-sm z-10 text-white cursor-pointer bg-[#1a1a1acc] rounded-full px-2 py-0.5 font-bold"
                            onClick={() => {
                              setMediaIdx(mediaIdx + 1);
                            }}
                          >
                            &#10095;
                          </button>
                        )}
                        <p className="text-sm text-gray-500">
                          Are you sure you want to deactivate your account? All
                          of your data will be permanently removed. This action
                          cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="container col-span-1 max-h-[60vh]">
                  <Header
                    username={props.username}
                    avatar={props.avatar}
                    time_created={props.time_created}
                    whether_followed_post_user={
                      props.whether_followed_post_user
                    }
                    onClose={props.onClose}
                    post_id={props.id}
                    deleteButton={true}
                    onDelete={props.onCreateComment}
                  />
                  <ModalComments
                    username={props.username}
                    caption={props.caption}
                    avatar={props.avatar}
                    time_created={props.time_created}
                    comments={props.comments}
                    setReplyUser={setReplyUser}
                    setCommentId={setCommentId}
                  />
                  <Actions
                    post_id={props.id}
                    likes={props.likes}
                    whether_liked={props.whether_liked}
                    whether_saved={props.whether_saved}
                  />
                  <AddComment
                    id={props.id}
                    username={props.username}
                    avatar={props.avatar}
                    onCreateComment={props.onCreateComment}
                    replyUser={replyUser}
                    commentId={commentId}
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
