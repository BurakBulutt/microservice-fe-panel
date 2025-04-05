import { Dialog } from "@headlessui/react";
import React, {useEffect, useState} from "react";
import {FaImage, FaPlus, FaTrash} from "react-icons/fa";
import InputField from "../../../../../components/fields/InputField";
import Editor from "react-simple-wysiwyg";
import Selectdialog from "../../../../../components/selectdialog";
import {toast} from "react-toastify";
import Category from "../../../category";
import {useNavigate} from "react-router-dom";
import {ContentService} from "../../../../../service/ContentService";
import {useFormik} from "formik";
import {ContentValidationSchema} from "../../../../../utils/validation/ValidationSchemas";

const ContentMeta = (props) => {
  const {contentId} = props;
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const service = new ContentService();
  const [selectedCategoryList, setSelectedCategoryList] = useState([]);

  const baseRequest = {
    name : "",
    description : "",
    photoUrl : "",
    type : "SERIES",
    subject : "",
    startDate : null,
    slug : "",
    categories : [],
    episodeTime : 0
  }
  const formik = useFormik({
    initialValues: baseRequest,
    validationSchema: ContentValidationSchema,
    onSubmit(values) {
      if (values.id) {
        update(values);
      } else {
        create(values);
      }
    },
  });

  useEffect(() => {
    if (contentId) {
      getData(contentId);
    }
  }, [contentId]);


  useEffect(() => {
    setImageSrc(formik.values?.photoUrl);
  }, [formik.values?.photoUrl]);

  useEffect(() => {
    setSelectedCategoryList(formik.values?.categories);
  }, [formik.values?.categories]);

  const getData = (id) => {
    service.getById(id).then(response => {
      if (response.status === 200) {
        formik.setValues(response.data);
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

  const create = (request) => {
    service.create(request).then(response => {
      if (response.status === 201) {
        toast.success("Save Success",{
          position : 'top-center',
          autoClose : 3000,
          onClose: () => {navigate("/admin/contents",{replace:true})}
        })
      }
    });
  };

  const update = (request) => {
    service.update(request.id,request).then(response => {
      if (response.status === 204) {
        toast.success("Update Success",{
          position : 'top-center',
          autoClose : 3000,
          onClose: () => {navigate("/admin/contents",{replace:true})}
        })
      }
    });
  };

  const closeModal = () => {
    setIsVisible(false);
  };

  const openModal = () => {
    setImageSrc("");
    setIsVisible(true);
  };

  const handleUrlSubmit = () => {
    setImageSrc(formik.values?.photoUrl || "");
    console.log(imageSrc);
    closeModal();
  };

  const options = [
    {
      display: "SERIES",
      value: "SERIES",
    },
    {
      display: "MOVIE",
      value: "MOVIE",
    },
  ];

  const createSlug = (name) => {
    const slug = name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    formik.setFieldValue("slug",slug);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    formik.setFieldValue("categoryIds",selectedCategoryList.map(item => item.id));
    formik.handleSubmit();
  }

  const handleSelect = (data) => {
    if (!selectedCategoryList.map(item => item.id).includes(data.id)) {
      setSelectedCategoryList([...selectedCategoryList, data]);
      //formik.setFieldValue("categories", [...formik.values?.categories,data]);
    }else{
      toast.warn("Item Already Selected",{
        position : 'top-center',
        autoClose : 3000
      })
    }
  }

  const handleUnSelect = (data) => {
    setSelectedCategoryList(selectedCategoryList.filter(item => item.id !== data.id))
    //formik.setFieldValue("categories", formik.values?.categories?.filter(item => item.id !== data.id));
  }

  const onClose = (e) => {
    setSelectedCategoryList(formik.values?.categories);
  }

  const onSave = (e) => {
    formik.setFieldValue("categories",selectedCategoryList);
  }

  const header = () => {
    return (
        <div className="flex flex-wrap gap-4">
          {selectedCategoryList.map((item, index) => (
              <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-md transition-all hover:shadow-lg"
              >
                <p className="text-lg font-semibold text-gray-800">{item.name}</p>
                <button
                    className="ml-3 flex items-center justify-center rounded-md bg-red-500 px-3 py-2 text-white transition-all hover:bg-red-600"
                    onClick={() => handleUnSelect(item)}
                >
                  <FaTrash size={20} />
                </button>
              </div>
          ))}
        </div>
    );
  };

  const actionButtons = (data) => {
    return (
        <div className="flex space-x-2">
          <button
              className="flex cursor-pointer items-center justify-center rounded-lg bg-green-300 p-2 text-white hover:bg-green-400"
              onClick={() => handleSelect(data)}
          >
            <FaPlus size={24} />
          </button>
        </div>
    );
  };

  const categoryView = () => {
    return (
        <div className="flex flex-wrap gap-4">
          {formik.values?.categories?.map((item, index) => (
              <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-md transition-all hover:shadow-lg"
              >
                <p className="text-lg font-semibold text-gray-800">{item.name}</p>
              </div>
          ))}
        </div>
    );
  };

  return (
    <div className="flex items-start space-x-4">
      <div className="mb-4 flex flex-col">
        {/* Resim Alanı */}
        <div className="flex h-48 w-full items-center justify-center overflow-hidden rounded-2xl border shadow-md sm:h-64 sm:w-64 md:h-80 md:w-80 lg:h-96 lg:w-96 xl:w-[20rem]">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt="Seçili Fotoğraf"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-gray-500">Fotoğraf Yok</span>
          )}
        </div>
        {/* Resim Butonları */}
        <div className="mt-4 flex flex-row space-x-2">
          <button
            className="flex flex-1 items-center rounded-xl border-2 border-red-500 px-5 py-3 text-base font-medium text-red-500 transition duration-200 hover:bg-red-600/5 active:bg-red-700/5 dark:border-red-400 dark:bg-red-400/10 dark:text-white dark:hover:bg-red-300/10 dark:active:bg-red-200/10"
            onClick={() => {
              formik.setFieldValue("photoUrl", "");
              setImageSrc("");
            }}
          >
            <FaTrash size={24} className="mr-2" />
            <span className="ml-auto">Sil</span>
          </button>
          <button
            className="flex flex-1 items-center rounded-xl border-2 border-green-500 px-5 py-3 text-base font-medium text-green-500 transition duration-200 hover:bg-green-600/5 active:bg-green-700/5 dark:border-green-400 dark:bg-green-400/10 dark:text-white dark:hover:bg-green-300/10 dark:active:bg-green-200/10"
            onClick={openModal}
          >
            <FaImage size={24} className="mr-2" />
            <span className="ml-auto">{!imageSrc ? "Seç" : "Değiştir"}</span>
          </button>
        </div>
      </div>

      <div className="mb-4 flex w-full flex-col">
        <div className="mb-4 flex flex-row justify-between space-x-4">
          <div className="flex-1">
            <InputField
              label="Name"
              placeholder="Content Name"
              name="name"
              type="text"
              state={formik.errors.name && "error"}
              value={formik.values?.name}
              onChange={(e) => {
                formik.handleChange(e);
                createSlug(e.target.value);
              }}
            />
            {formik.errors.name && submitted && (
              <div className="ml-2 mt-2 text-red-500">{formik.errors.name}</div>
            )}
          </div>
          <div className="flex-1">
            <InputField
              label="Start Date"
              placeholder="Start Date"
              name="startDate"
              type="date"
              state={formik.errors.startDate && "error"}
              value={formik.values.startDate}
              onChange={formik.handleChange}
            />
            {formik.errors.startDate && submitted && (
              <div className="ml-2 mt-2 text-red-500">
                {formik.errors.startDate}
              </div>
            )}
          </div>
          <div className="flex-1">
            <InputField
              disabled={true}
              label="Slug"
              placeholder="Content Slug"
              name="slug"
              type="text"
              state={formik.errors.slug && "error"}
              value={formik.values.slug}
            />
            {formik.errors.slug && submitted && (
              <div className="ml-2 mt-2 text-red-500">{formik.errors.slug}</div>
            )}
          </div>
          <div className="flex-1">
            <label className="ml-3 text-sm font-bold text-navy-700 dark:text-white">
              {"Type"}
            </label>
            <select
              className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border border-gray-200 bg-white/0 p-3 text-sm outline-none focus:border-blue-500 dark:border-white/10 dark:text-white dark:focus:border-blue-400"
              value={formik.values.type}
              name="type"
              onChange={formik.handleChange}
            >
              {options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="text-black dark:text-white"
                >
                  {option.display}
                </option>
              ))}
            </select>
            {formik.errors.type && submitted && (
              <div className="ml-2 mt-2 text-red-500">{formik.errors.type}</div>
            )}
          </div>
          <div className="flex-1">
            <InputField
              label="Episode Time"
              name="episodeTime"
              type="number"
              state={formik.errors.episodeTime && "error"}
              value={formik.values?.episodeTime}
              onChange={(e) => {
                formik.handleChange(e);
              }}
            />
            {formik.errors.episodeTime && submitted && (
              <div className="ml-2 mt-2 text-red-500">
                {formik.errors.episodeTime}
              </div>
            )}
          </div>
        </div>

        <div className="mb-4 flex flex-row space-x-4">
          <div className="flex-1">
            <InputField
              label="Description"
              placeholder="Content Description"
              name="description"
              type="text"
              state={formik.errors.description && "error"}
              value={formik.values?.description}
              onChange={formik.handleChange}
            />
            {formik.errors.description && submitted && (
              <div className="ml-2 mt-2 text-red-500">
                {formik.errors.description}
              </div>
            )}
          </div>
        </div>

        <div className="mb-4 flex flex-col space-y-4">
          <div className="flex-1">
            <Selectdialog
              extra={"w-full rounded-xl bg-gradient-to-br from-[#EA52F8] to-[#0066FF] px-5 py-3 text-base font-medium text-white transition duration-200 hover:shadow-lg hover:shadow-[#0066FF]/25"}
              buttonText="Kategoriler"
              component={
                <Category header={header()} actionButtons={actionButtons} />
              }
              onSave={onSave}
              onClose={onClose}
            />
            {formik.errors.categories && submitted && (
              <div className="ml-2 mt-2 text-red-500">
                {formik.errors.categories}
              </div>
            )}
          </div>
          <div className="flex-1">{categoryView()}</div>
        </div>

        <div className="mb-4 flex flex-col space-y-4">
          <div className="w-full overflow-hidden">
            <label className="ml-3 text-sm font-bold text-navy-700 dark:text-white">
              {"Subject"}
            </label>
            <Editor
              value={formik.values?.subject}
              name="subject"
              onChange={formik.handleChange}
            />
          </div>
          <div className="w-full overflow-hidden">
            <button
              className="w-full rounded-xl bg-green-500 px-5 py-3 text-base font-medium text-white transition duration-200 hover:bg-green-600 active:bg-green-700 dark:bg-green-400 dark:text-white dark:hover:bg-green-300 dark:active:bg-green-200"
              onClick={handleSubmit}
            >
              {formik.values?.id ? "Güncelle" : "Kaydet"}
            </button>
          </div>
        </div>
      </div>

      {/* URL Dialog */}
      <Dialog
        open={isVisible}
        onClose={closeModal}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex min-h-screen items-center justify-center">
          <Dialog.Panel className="z-20 h-full max-h-[80vh]  w-full max-w-lg overflow-y-auto rounded-lg border border-gray-300 bg-white p-6 shadow-lg">
            <div className="mb-4">
              <label className="ml-3 text-sm font-bold text-navy-700 dark:text-white">
                {"Url"}
              </label>
              <input
                type="text"
                name="photoUrl"
                onChange={formik.handleChange}
                value={formik.values.photoUrl}
                className="w-full rounded-md border px-3 py-2"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="cursor-pointer rounded-md bg-green-500 px-4 py-2 font-bold text-white"
                onClick={handleUrlSubmit}
              >
                Seç
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};
export default ContentMeta;
