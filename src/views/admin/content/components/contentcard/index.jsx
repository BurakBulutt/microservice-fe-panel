import Card from "../../../../../components/card";
import {useParams} from "react-router-dom";
import React, {useState} from "react";

import Media from "../media";
import ContentMeta from "../contentmeta";

const ContentCard = () => {
  const {id} = useParams();
  const [activeTab, setActiveTab] = useState("content-meta");
  const tabs = [
    {
      name : "Content Meta",
      key: "content-meta"
    },
    {
      name : "Media List",
      key: "media-list"
    }
  ]

  return (
    <Card extra={"w-full h-full sm:overflow-auto px-6"}>
      <div className="mt-4 flex space-x-6 border-b">
        {tabs.map((tab) => (
          <div
            key={tab.key}
            className={`relative cursor-pointer px-4 py-2 font-semibold 
        ${activeTab === tab.key ? "text-brand-500 dark:text-brand-400" : "opacity-60 text-gray-700 dark:text-gray-300"} 
        ${!id && tab.key !== "content-meta" ? "line-through cursor-not-allowed" : ""}`}
            onClick={() => id && setActiveTab(tab.key)}
          >
            {tab.name}
            {activeTab === tab.key && (
              <div className="absolute bottom-0 left-0 h-1 w-full rounded-lg bg-brand-500 dark:bg-brand-400" />
            )}
          </div>
        ))}
      </div>
      {/* Content */}
      <div className="mt-4 mb-4">
        <div style={{ display: activeTab === "content-meta" ? 'block' : 'none' }}>
          <ContentMeta contentId={id} />
        </div>
        <div style={{ display: activeTab === "media-list" ? 'block' : 'none' }}>
          <Media contentId={id} />
        </div>
      </div>
    </Card>
  );
};

export default ContentCard;
