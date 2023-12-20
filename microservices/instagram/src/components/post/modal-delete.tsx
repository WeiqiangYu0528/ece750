import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { modalDelete } from "./postType";
import axiosApi from "../../config/postConfig";

export default function ModalDelete(props: modalDelete) {
  const cancelButtonRef = useRef(null);

  const onHandleDelete = () => {
    props.setOpen(false);
    props.onClose();
    axiosApi
      .delete(`/${props.post_id}`)
      .then((res) => {
        console.log(res);
        props.onDelete();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <Transition.Root show={props.open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={props.setOpen}
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
                <div className="bg-gray-50 cursor-pointer text-center">
                  <div
                    className="text-red-500 font-bold px-4 py-3 sm:px-6 border-b-[1px] solid border-color-gray"
                    onClick={onHandleDelete}
                    data-testid="delete"
                  >
                    Delete
                  </div>
                  <div
                    className="px-4 py-3 sm:px-6"
                    data-testid="cancel"
                    onClick={() => props.setOpen(false)}
                  >
                    Cancel
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
