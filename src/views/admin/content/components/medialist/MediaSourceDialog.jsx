import { Dialog } from "@headlessui/react";
import InputField from "../../../../../components/fields/InputField";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useKeycloak } from "@react-keycloak/web";
import { MediaService } from "../../../../../service/MediaService";
import {FaTrash} from "react-icons/fa";
import {toast} from "react-toastify";

const MediaSourceDialog = (props) => {
  const { dialogVisible, hideDialog, data } = props;
  const { keycloak } = useKeycloak();
  const service = new MediaService(keycloak);
  const [mediaSources, setMediaSources] = useState([]);

  useEffect(() => {
    if (data && dialogVisible) {
      getMediaSources(data);
    }
  }, [data, dialogVisible]);

  const getMediaSources = (id) => {
    service
        .getMediaSourcesByMediaId(id)
        .then((response) => {
          if (response.status === 200) {
            setMediaSources(response.data);
          }
        })
        .catch((err) => {
          throw err;
        });
  };

  const updateMediaSources = (request) => {
    service
        .updateMediaSources(data,request)
        .then((response) => {
          if (response.status === 200) {
            toast.success("UPDATE SUCCESS",{
              position : 'top-center',
              autoClose : 3000,
              onClose : hideDialog
            })
          }
        })
        .catch((err) => {
          toast.error("SOMETHINGS WENT WRONG",{
            position : 'top-center',
            autoClose : 3000,
            data: err.status
          })
        });
  };

  const options = [
    { display: "GOOGLE DRIVE", value: "G_DRIVE" },
    { display: "DAILYMOTION", value: "DAILYMOTION" },
    { display: "SIBNET", value: "SIBNET" },
    { display: "VOE", value: "VOE" },
    { display: "OK.RU", value: "OK_RU" },
  ];

  const formik = useFormik({
    initialValues: { mediaSources: mediaSources },
    enableReinitialize: true,
    onSubmit: (values) => {
      console.log(values);
      updateMediaSources(values);
    },
  });

  const handleAddMediaSource = () => {
    const newMedia = {
      url: "",
      type: options[0].value,
      fanSub: "",
      mediaId: data,
    };

    setMediaSources((prev) => [...prev, newMedia]);
  };

  const handleRemoveMediaSource = (index) => {
    setMediaSources((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateMediaSource = (index, field, value) => {
    setMediaSources((prev) =>
        prev.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        )
    );
  };

  return (
      <Dialog open={dialogVisible} onClose={hideDialog} className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center">
          <Dialog.Panel className="z-20 h-full max-h-[100vh] w-full max-w-6xl overflow-y-auto rounded-lg border border-gray-300 bg-white p-6 shadow-lg">
            <Dialog.Title as="h3" className="mb-4 text-lg font-medium leading-6 text-gray-900">
              {"Kaynak"}
            </Dialog.Title>
            {mediaSources.map((mediaSource, index) => (
                <div key={index} className="mb-4 flex flex-row space-x-2">
                  <div className="flex-[1]">
                    <label className="ml-3 text-sm font-bold text-navy-700 dark:text-white">{"Type"}</label>
                    <select
                        className="mt-2 flex h-12 w-full rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none focus:border-blue-500 dark:border-white/10 dark:text-white dark:focus:border-blue-400"
                        value={mediaSource.type}
                        onChange={(e) => handleUpdateMediaSource(index, "type", e.target.value)}
                    >
                      {options.map((option) => (
                          <option key={option.value} value={option.value} className="text-black dark:text-white">
                            {option.display}
                          </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-[2]">
                    <InputField
                        label="Url"
                        placeholder="url"
                        type="text"
                        value={mediaSource.url}
                        onChange={(e) => handleUpdateMediaSource(index, "url", e.target.value)}
                    />
                  </div>
                  <div className="flex-[1]">
                    <InputField
                        label="FanSub"
                        placeholder="fanSub"
                        type="text"
                        value={mediaSource.fanSub}
                        onChange={(e) => handleUpdateMediaSource(index, "fanSub", e.target.value)}
                    />
                  </div>
                  <button
                      type="button"
                      className="cursor-pointer rounded-lg bg-red-500 p-2 text-white hover:bg-red-600"
                      onClick={() => handleRemoveMediaSource(index)}
                  >
                    <FaTrash size={24} />
                  </button>
                </div>
            ))}
            <button
                type="button"
                className="w-full cursor-pointer rounded-md bg-green-500 px-4 py-2 font-bold text-white"
                onClick={handleAddMediaSource}
            >
              {"Ekle"}
            </button>
            <div className="mt-4 flex justify-end">
              <button
                  type="button"
                  onClick={hideDialog}
                  className="mr-2 cursor-pointer rounded-md bg-red-500 px-4 py-2 font-bold text-white"
              >
                İptal
              </button>
              <button
                  type="button"
                  className="cursor-pointer rounded-md bg-green-500 px-4 py-2 font-bold text-white"
                  onClick={formik.handleSubmit}
              >
                {"Kaydet"}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
  );
};
export default MediaSourceDialog;
