export const TITLE = "testify";
export const PROFILE_IMG = "https://firebasestorage.googleapis.com/v0/b/testify-adfa4.appspot.com/o/anonymous%2Faccount.png?alt=media&token=a9863ed1-f585-4ac1-bbeb-3d3ae7db79e1"

export const formatTimeDifference = (
    startTimestamp,
    endTimestamp
  ) => {
    // Convert Firestore Timestamps to JavaScript Date objects
    const start = startTimestamp.toDate();
    const end = endTimestamp.toDate();

    // Calculate the difference in milliseconds
    const diffInMs = end - start;

    // Define time units
    const msInSecond = 1000;
    const msInMinute = msInSecond * 60;
    const msInHour = msInMinute * 60;
    const msInDay = msInHour * 24;

    // Calculate time differences
    const days = Math.floor(diffInMs / msInDay);
    const hours = Math.floor((diffInMs % msInDay) / msInHour);
    const minutes = Math.floor((diffInMs % msInHour) / msInMinute);
    const seconds = Math.floor((diffInMs % msInMinute) / msInSecond);

    // Determine the most significant unit of time
    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return `${seconds}s`;
  };