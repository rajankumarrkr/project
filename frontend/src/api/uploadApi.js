import axios from './axios';

export const uploadVideo = async (file, onProgress) => {
    const formData = new FormData();
    formData.append('video', file);

    const response = await axios.post('/upload/video', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
            if (onProgress) {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                onProgress(percentCompleted);
            }
        },
    });

    return response.data;
};

export const uploadImage = async (file, onProgress) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await axios.post('/upload/image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
            if (onProgress) {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                onProgress(percentCompleted);
            }
        },
    });

    return response.data;
};
