function getLoggedUser() {
    const loggedInUser = localStorage.getItem("user");
    return JSON.parse(loggedInUser);
}

export default getLoggedUser