import { API_URL } from "../config/config";
export const createAd = async (data) => {
  const token =
    localStorage.getItem("accessToken") || localStorage.getItem("token");
  const res = await fetch(`${API_URL}/ads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      ...data,
      isTelegram: data.selectedChats && data.selectedChats.length > 0,
    }),
  });
  if (!res.ok) {
    let msg = "Ошибка при создании объявления";
    try {
      const err = await res.json();
      msg = err.error || msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
};
