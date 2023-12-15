export const cleanLocalModuleData = () => {
  const userData = JSON.parse(localStorage.getItem("@user"));
  localStorage.clear()
  localStorage.setItem("@user", JSON.stringify(userData))
}


export const getSessionRoles = () => {
  const userData = JSON.parse(localStorage.getItem("@user"));
  let results = []
  if (userData?.RoleUsers) {
    if (userData.RoleUsers.length > 0) {
      userData.RoleUsers.forEach(item => results.push(item.idRole));
      return results
    } else {
      return [0]
    }
  } else return [0]
}