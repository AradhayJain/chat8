export const getSender = (loggedUser, users) => {
    // Ensure there are at least 2 users in the array
    if (!users || users.length < 2) return "Unknown User";  // Fallback if users array is invalid

    // Check if the logged-in user is the first user in the array
    return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser, users) => {
    // Ensure there are at least 2 users in the array
    if (!users || users.length < 2) return {};  // Fallback if users array is invalid

    // Return the other user in the chat (not the logged-in user)
    return users[0]?._id === loggedUser?._id ? users[1] : users[0];
};
