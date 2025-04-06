import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { MediaService } from "../../../../../service/MediaService";
import {useDisclosure} from "@chakra-ui/hooks";
import {FaPlay} from "react-icons/fa";

const PlayerDialog = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data } = props;
  const service = new MediaService();
  const [mediaList, setMediaList] = useState([]);
  const [fanSubOptions, setFanSubOptions] = useState([]);
  const [selectedFanSub, setSelectedFanSub] = useState("");
  const [typeOptions, setTypeOptions] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [filteredMedia, setFilteredMedia] = useState(null);

  useEffect(() => {
    if (data && isOpen) {
      getMediaSources(data);
    }
  }, [data, isOpen]);

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

  const getMediaSources = (id) => {
    service
        .getMediaSourcesByMediaId(id)
        .then((response) => {
          if (response.status === 200) {
            const mediaData = response.data;
            setMediaList(mediaData);

            const uniqueFanSubs = [
              ...new Set(mediaData.map((item) => item.fanSub)),
            ];
            setFanSubOptions(uniqueFanSubs);
            setSelectedFanSub(uniqueFanSubs[0] || "");

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

  return (
      <div>
        <button
            className="flex cursor-pointer items-center justify-center rounded-lg bg-lime-400 p-2 text-white hover:bg-lime-500"
            onClick={onOpen}
            aria-label="Oynat"
        >
          <FaPlay size={24} />
        </button>
        <Dialog
            open={isOpen}
            onClose={onClose}
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
                  <div className="mb-4 p-4">
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
              <div className="flex justify-center">
                <button
                    type="button"
                    onClick={onClose}
                    className="mr-2 cursor-pointer rounded-md bg-red-500 px-4 py-2 font-bold text-white"
                >
                  Close
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
  );
};

export default PlayerDialog;
