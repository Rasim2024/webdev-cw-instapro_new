export function saveUserToLocalStorage(user) {
  window.localStorage.setItem('user', JSON.stringify(user))
}


//  Эта функция  предполагает извлечение данных пользователя из локального хранилища браузера. 
// Она использует метод JSON.parse() для преобразования строки JSON, хранящейся в локальном хранилище, в объект JavaScript.
export function getUserFromLocalStorage() {
  try {
      return JSON.parse(window.localStorage.getItem('user'))
  } catch {
      return null
  }
}

export function removeUserFromLocalStorage() {
  window.localStorage.removeItem('user')
}

export function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}