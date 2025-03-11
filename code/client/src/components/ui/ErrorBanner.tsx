import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "next-i18next";
import Link from "next/link";

interface ErrorBannerProps {
  message: string;
  link?: {
    text: string;
    href: string;
  };
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, link }) => {
  const [isVisible, setIsVisible] = useState(true);
  const { t } = useTranslation();

  if (!isVisible) return null;

  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4">
      <div className="flex">
        <div className="ml-3">
          <p className="text-sm text-red-700">
            {message || t("common.error.default_message")}
          </p>
          {link && (
            <div className="mt-2">
              <Link
                href={link.href}
                className="underline text-red-700 hover:text-red-900"
              >
                {link.text}
              </Link>
            </div>
          )}
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
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

export default ErrorBanner;
