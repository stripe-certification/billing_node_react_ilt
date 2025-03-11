"use client";

import { PricedLlmModel } from "@/types";
import { useOfferings } from "@/contexts/OfferingsContext";
import fetchClient from "@/utils/fetchClient";
import React, { useEffect, useState } from "react";
import { LoadingOverlay } from "@/components";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/contexts/UserContext";

const ChatPage = () => {
  const { offerings, offeringsLoading } = useOfferings();
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [selectedModel, setSelectedModel] = useState<PricedLlmModel | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isLoggedIn, hasActiveSubscription } = useUserContext();
  const router = useRouter();

  const modelsArray = offerings?.models ? Object.values(offerings.models) : [];

  useEffect(() => {
    if (!isLoggedIn() || !hasActiveSubscription()) {
      router.push("/auth/sign-up");
    }
    if (!offeringsLoading && offerings && selectedModel === null) {
      const defaultModel = modelsArray[0];
      setSelectedModel(defaultModel);
    }
    setIsLoading(false);
  }, [offerings, offeringsLoading, isLoggedIn, router, hasActiveSubscription]);

  if (isLoading || !isLoggedIn() || offeringsLoading) {
    return <LoadingOverlay />;
  }

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length) {
      setPrompt(e.target.value);
      setResponse("");
    } else {
      setError("Prompt must be less than 500 characters");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!selectedModel) {
      throw new Error("Selected model .");
    }

    try {
      const { data } = await fetchClient.post(`/chat`, {
        prompt,
        meterEventName: selectedModel.meterEventName,
      });

      if (data.error) {
        setError(data.error.message);
      } else {
        setResponse(data.message);
        setPrompt("");
        setError(null);
      }
    } catch (error: any) {
      console.error("Error submitting request:", error);
      setError(
        error.response.data.error.message ||
          "An error occurred while submitting the request."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center pt-8">
      <div className="w-full max-w-4xl px-4 pt-40 relative">
        <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-3/4 h-48 bg-purple rounded-full blur-3xl opacity-75"></div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-6 relative"
        >
          <textarea
            className="w-full h-64 resize-none border-none focus:ring-0 text-xl text-gray-600 placeholder-gray-300 outline-none"
            placeholder="How are you can Lora help you today?"
            value={prompt}
            onChange={handlePromptChange}
          />
          <div className="flex justify-between items-center mt-2">
            <div className="flex flex-col items-center space-y-4">
              <select
                id="model-select"
                className="p-2 border rounded-lg"
                value={selectedModel?.modelName || ""}
                onChange={(e) => {
                  const selected = modelsArray.find(
                    (model) => model.modelName === e.target.value
                  );
                  if (selected) {
                    setSelectedModel(selected);
                  }
                }}
              >
                {!offeringsLoading && offerings?.models ? (
                  modelsArray.map((model) => (
                    <option key={model.modelName} value={model.modelName}>
                      {model.displayName}
                    </option>
                  ))
                ) : (
                  <option value="">Loading models...</option>
                )}
              </select>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-purple text-button-color px-4 py-2 rounded-full text-sm font-bold hover:bg-purple-hover transition-colors"
            >
              {isLoading ? "Processing..." : "Submit"}
            </button>
          </div>
        </form>
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        {response && (
          <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold mb-2">Response</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{response}</p>
          </div>
        )}
        {isLoading && (
          <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold mb-2">Thinking...</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
