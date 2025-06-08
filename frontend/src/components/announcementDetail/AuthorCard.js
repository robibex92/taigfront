import React, { useEffect, useState } from "react";
import { Box, Typography, Stack, Avatar, Skeleton } from "@mui/material";
import { API_URL } from "../../config/config";
import { getUserFromCache, setUserToCache } from "../../utils/userAvatarCache";

const AuthorCard = ({ user_id }) => {
  const [displayName, setDisplayName] = useState("Не указано");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = getUserFromCache(user_id);
    if (cached) {
      setDisplayName(cached.displayName);
      setAvatarUrl(cached.avatarUrl);
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        const userResponse = await fetch(`${API_URL}/users/${user_id}`);
        if (!userResponse.ok) throw new Error("Failed to load user data");

        const userData = await userResponse.json();
        setDisplayName(userData.first_name || "Не указано");

        const avatarResponse = await fetch(
          `${API_URL}/users/${user_id}/avatar`
        );
        if (!avatarResponse.ok) throw new Error("Failed to load avatar");

        const avatarData = await avatarResponse.json();
        setAvatarUrl(avatarData.avatar_url || null);
        setUserToCache(user_id, {
          displayName: userData.first_name || "Не указано",
          avatarUrl: avatarData.avatar_url || null,
        });
      } catch (error) {
        console.error("Error loading user data:", error);
        setDisplayName("Не указано");
        setAvatarUrl(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user_id]);

  return (
    <Box>
      <Stack direction="row" spacing={2} alignItems="center">
        {loading ? (
          <Skeleton variant="circular" width={56} height={56} />
        ) : (
          <Avatar
            src={avatarUrl || undefined}
            alt={"Avatar"}
            sx={{ width: 56, height: 56 }}
          >
            {displayName.charAt(0)}
          </Avatar>
        )}
        <Stack spacing={0.5}>
          {loading ? (
            <Skeleton variant="text" width={120} height={28} />
          ) : (
            <Typography variant="h6">{displayName}</Typography>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default AuthorCard;
