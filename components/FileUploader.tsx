import { Field, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

export default function FileUploader({ label, uploadedLabel, actionLabel, fileRestrictionLabel } : {
  label: string,
  uploadedLabel,
  actionLabel: string,
  fileRestrictionLabel: string
}) {

  const [t] = useTranslation();
  const [uploaded, setUploaded] = useState(false);

  const { values } = useFormikContext();

  useEffect(() => {
    if (values['fileUpload'] && values['fileUpload'].length !== 0) {
      setUploaded(true);
    }
  }, [values]);

  return (
    <div>
      <label className="block font-bold text-sm font-medium text-gray-700">
        {t(label)}
      </label>
      <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
        <div className="space-y-1 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className="flex justify-center text-sm text-gray-600">
            <label htmlFor="fileUpload"
                   className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
              { !uploaded ? <span>{t(actionLabel)}</span> : <span>{t(uploadedLabel)}</span> }
              <Field name="fileUpload" id="fileUpload" type="file" className="sr-only" />
            </label>
            {/*<p className="pl-1">{t('uploader.drag.description')}</p>*/}
          </div>
          <p className="text-xs text-gray-500">
            {t(fileRestrictionLabel)}
          </p>
        </div>
      </div>
    </div>
  );
}
