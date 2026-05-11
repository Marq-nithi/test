import { useApi } from "@michaeldothedi-service/dta-crm-sl-sdk";

export function useMasterEntries() {
  const { api } = useApi();

  const createMasterEntries = async (params) => {
    const response = await api.client.post(
      "/dta.master-entries/create-master-entries",
      params,
    );
    return response.id;
  };

  const getAllMasterEntries = async (params) => {
    const response = await api.client.get(
      "/dta.master-entries/get-all-master-entries",
    );
    return response;
  };

  const deleteMasterEntrie = async (id) => {
    const response = await api.client.delete(
      `/dta.master-entries/delete-master-entry/${id}`,
    );
    return response;
  };

  return {
    createMasterEntries,
    getAllMasterEntries,
    deleteMasterEntrie,
  };
}

export function useItineraryBuilderApi() {
  const { api } = useApi();

  const getItineraryDataById = async (id) => {
    const response = await api.itinerary.getItinerary(id);
    return response;
  };

  const getAllItineraryDraft = async () => {
    const response = await api.client.get(
      "/dta.itinerary-management/get-all-draft",
    );
    return response;
  };

  return {
    getItineraryDataById,
    getAllItineraryDraft,
  };
}

export const useBlobUpload = () => {
  const { api } = useApi();

  const uploadBlob = async (validFileTypes = "*") => {
    return new Promise((resolve, reject) => {
      const input = document.createElement("input");

      input.type = "file";
      input.accept = Array.isArray(validFileTypes)
        ? validFileTypes.join(",")
        : validFileTypes;

      input.onchange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) {
          resolve(null);
          return;
        }

        const base64 = await convertFileToBase64(file);
        const blobBase64 = base64.split(",")[1];
        const response = await api.client.put(
          "/dta.common/blob",
          { blob_data: blobBase64 },
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        const payload = response?.data ?? response;
        resolve(payload?.id || null);
      };

      input.click();
    });
  };

  return {
    uploadBlob,
  };
};

export const useBlobDownload = () => {
  const { api } = useApi();

  const getBlob = async (blobId) => {
    const response = await api.client.get(`/dta.common/blob/${blobId}`);
    const data = response?.data ?? response;
    const mimeType = detectMimeTypeFromBase64(data.blob_data) || "image/jpeg";
    const url = `data:${mimeType};base64,${data.blob_data}`;

    return {
      id: data.id,
      blob: null,
      url,
      created_at: data.created_at,
    };
  };

  return {
    getBlob,
  };
};

const detectMimeTypeFromBase64 = (base64Data) => {
  if (typeof base64Data !== "string" || base64Data.length < 16) return null;
  if (base64Data.startsWith("/9j/")) return "image/jpeg";
  if (base64Data.startsWith("iVBORw0KGgo")) return "image/png";
  if (base64Data.startsWith("R0lGOD")) return "image/gif";
  if (base64Data.startsWith("UklGR")) return "image/webp";
  return null;
};

const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);

    reader.onerror = reject;
  });
};
