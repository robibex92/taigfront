  // handleResponse: обрабатывает статус ответа
  export const handleResponse = async (response) => {
    const contentType = response.headers.get('content-type');
    let data;
  
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text(); // fallback
    }
  
    if (!response.ok) {
      const error = new Error(`HTTP error! Status: ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }
  
    return data;
  };