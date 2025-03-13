import Card from "../../../../../components/card";
import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";

import MediaList from "../medialist";
import ContentMeta from "../contentmeta";
import {useFormik} from "formik";
import {
  ContentCreateValidationSchema,
  ContentUpdateValidationSchema
} from "../../../../../utils/validation/ValidationSchemas";
import {ContentService} from "../../../../../service/ContentService";
import {useKeycloak} from "@react-keycloak/web";
import {toast} from "react-toastify";

const ContentCard = () => {
  const navigate = useNavigate();
  const {keycloak} = useKeycloak();
  const {id} = useParams();
  const [activeTab, setActiveTab] = useState("content-meta");
  const service = new ContentService(keycloak);
  const baseRequest = {
    name : "",
    description : "",
    photoUrl : "",
    type : "SERIES",
    subject : "",
    startDate : null,
    slug : "",
    categoryIds : [],
    episodeTime : 0
  }
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
  let validationSchema  = ContentCreateValidationSchema;

  useEffect(() => {
    if (id && keycloak.authenticated) {
      getData(id);
    }
  }, [id,keycloak.authenticated]);

  const getData = (id) => {
    service.getById(id).then(response => {
      if (response.status === 200) {
        formik.setValues(response.data);
        validationSchema = ContentUpdateValidationSchema;
      }
    }).catch(err => {
      if (err.status === 404) {
        toast.error("Content Not Found",{
          position :'top-center',
          autoClose : 3000,
          onClose: () => {
            navigate("/admin/contents",{replace:false});
          }
        });
      }else {
        toast.error("Something Went Wrong",{
          position :'top-center',
          autoClose : 3000,
          onClose: () => {
            navigate("/admin/contents",{replace:false});
          }
        });
      }
    })
  }

  const update = (request) => {
    service.update(request.id,request).then(response => {
      if (response.status === 200) {
        toast.success("Update Success",{
          position : 'top-center',
          autoClose : 3000
        })
      }
    });
  };

  const create = (request) => {
    service.create(request).then(response => {
      if (response.status === 200) {
        toast.success("Save Success",{
          position : 'top-center',
          autoClose : 3000,
          onClose: () => {navigate("/admin/contents",{replace:true})}
        })
      }
    });
  };

  const formik = useFormik({
    initialValues: baseRequest,
    validationSchema: validationSchema,
    onSubmit(values) {
      if (values.id) {
        update(values);
      } else {
        create(values);
      }
    },
  });

  const renderTabComponent = (activeTab) => {
    switch (activeTab) {
      case "content-meta":
        return <ContentMeta formik={formik} />;
      case "media-list":
        return <MediaList contentId={id}/>;
      default:
        return null;
    }
  };

  return (
    <Card extra={"w-full h-full sm:overflow-auto px-6"}>
      <div className="mt-4 flex space-x-6 border-b">
        {tabs.map((tab) => (
          <div
            key={tab.key}
            className={`relative cursor-pointer px-4 py-2 font-semibold 
        ${activeTab === tab.key ? "text-brand-500 dark:text-brand-400" : "opacity-60 text-gray-700 dark:text-gray-300"} 
        ${!formik.values?.id && tab.key !== "content-meta" ? "line-through cursor-not-allowed" : ""}`}
            onClick={() => formik.values.id && setActiveTab(tab.key)}
          >
            {tab.name}
            {activeTab === tab.key && (
              <div className="absolute bottom-0 left-0 h-1 w-full rounded-lg bg-brand-500 dark:bg-brand-400" />
            )}
          </div>
        ))}
      </div>
      {/* Content */}
      <div className="mt-4">{renderTabComponent(activeTab)}</div>
    </Card>
  );
};

export default ContentCard;
