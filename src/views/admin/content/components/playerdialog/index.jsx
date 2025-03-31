import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { useKeycloak } from "@react-keycloak/web";
import { MediaService } from "../../../../../service/MediaService";

const PlayerDialog = (props) => {
  const { dialogVisible, hideDialog, data } = props;
  const { keycloak } = useKeycloak();
  const service = new MediaService(keycloak);

  const [mediaList, setMediaList] = useState([]);
  const [fanSubOptions, setFanSubOptions] = useState([]);
  const [selectedFanSub, setSelectedFanSub] = useState("");
  const [typeOptions, setTypeOptions] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [filteredMedia, setFilteredMedia] = useState(null);

  useEffect(() => {
    setFilteredMedia(null);
    if (data && dialogVisible) {
      getMediaSources(data);
    }
  }, [data, dialogVisible]);

  const getMediaSources = (id) => {
    service
      .getMediaSourcesByMediaId(id)
      .then((response) => {
        if (response.status === 200) {
          const mediaData = response.data;
          setMediaList(mediaData);

          // fanSub set oluştur
          const uniqueFanSubs = [
            ...new Set(mediaData.map((item) => item.fanSub)),
          ];
          setFanSubOptions(uniqueFanSubs);
          setSelectedFanSub(uniqueFanSubs[0] || "");

          // type set oluştur
          const filteredTypes = [
            ...new Set(
              mediaData
                .filter((item) => item.fanSub === uniqueFanSubs[0])
                .map((item) => item.type)
            ),
          ];

          setTypeOptions(filteredTypes);
          setSelectedType(filteredTypes[0] || "");
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (selectedFanSub) {
      const filteredTypes = [
        ...new Set(
          mediaList
            .filter((item) => item.fanSub === selectedFanSub)
            .map((item) => item.type)
        ),
      ];
      setTypeOptions(filteredTypes);
      setSelectedType(filteredTypes[0] || "");
    }
  }, [selectedFanSub]);

  useEffect(() => {
    if (selectedFanSub && selectedType) {
      const filtered = mediaList.find(
        (item) => item.fanSub === selectedFanSub && item.type === selectedType
      );
      setFilteredMedia(filtered || null);
    }
  }, [selectedType]);

  return (
    <Dialog
      open={dialogVisible}
      onClose={hideDialog}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="flex min-h-screen items-center justify-center">
        <Dialog.Panel className="z-20 h-full max-h-[100vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-gray-300 bg-white p-6 shadow-lg">
          <Dialog.Title
            as="h3"
            className="mb-4 text-lg font-medium leading-6 text-gray-900"
          >
            Video
          </Dialog.Title>
          <div className="mb-4 flex flex-row space-x-4">
            <div>
              <label className="ml-3 text-sm font-bold text-navy-700 dark:text-white">
                {"FanSub"}
              </label>
              <select
                className="mt-2 flex h-12 w-full rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none focus:border-blue-500 dark:border-white/10 dark:text-white dark:focus:border-blue-400"
                value={selectedFanSub}
                onChange={(e) => setSelectedFanSub(e.target.value)}
              >
                {fanSubOptions.map((fanSub) => (
                  <option key={fanSub} value={fanSub}>
                    {fanSub}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="ml-3 text-sm font-bold text-navy-700 dark:text-white">
                {"Player"}
              </label>
              <select
                className="mt-2 flex h-12 w-full rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none focus:border-blue-500 dark:border-white/10 dark:text-white dark:focus:border-blue-400"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {typeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {filteredMedia?.url && (
            <div className="p-4">
              <p className="mb-2 text-sm text-gray-700">Seçilen Video</p>
              <iframe
                  className="w-full max-w-2xl h-96"
                  src={filteredMedia.url}
                      frameBorder="0"
                allow="autoplay; encrypted-media; picture-in-picture"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          )}
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={hideDialog}
              className="mr-2 cursor-pointer rounded-md bg-red-500 px-4 py-2 font-bold text-white"
            >
              Kapat
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default PlayerDialog;
