import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "next-i18next";

interface Props {
  message: string;
}

const SuccessBanner = ({ message }: Props) => {
  const [isVisible, setIsVisible] = useState(true);
  const { t } = useTranslation();

  if (!isVisible) return null;

  return (
    <div className="bg-green-50 border-l-4 border-green-400 p-4">
      <div className="flex">
        <div className="ml-3">
          <p className="text-sm text-green-700">
            {message || t("common.error.default_message")}
          </p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
              onClick={() => setIsVisible(false)}
            >
              <span className="sr-only">{t("common.error.dismiss")}</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessBanner;
