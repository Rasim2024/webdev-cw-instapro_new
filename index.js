import { renderAddPostPageComponent } from './components/add-post-page-component.js'
import { renderAuthPageComponent } from './components/auth-page-component.js'
import { renderPostsPageComponent } from './components/posts-page-component.js'
import { renderLoadingPageComponent } from './components/loading-page-component.js'
import { renderUserPostsPageComponent } from './components/user-posts-page-component.js'

import {
    ADD_POSTS_PAGE,
    AUTH_PAGE,
    LOADING_PAGE,
    POSTS_PAGE,
    USER_POSTS_PAGE,
} from './routes.js'

import {
    getUserFromLocalStorage,
    removeUserFromLocalStorage,
    saveUserToLocalStorage,
} from './helpers.js'

import {
    getPosts,
    getUserPosts,
    addPost,
    deletePost,
    getLikePost,
} from './api.js'

export let user = getUserFromLocalStorage() //  извлечение данных пользователя из локального хранилища браузера.
export let page = null
export let posts = []

// Если переменная `user` существует \(не равна `null` или `undefined`\), то переменная `token` присваивается строка "Bearer "
// с добавленным значением `user.token`\. В противном случае, `token` присваивается значение `undefined`\.
const getToken = () => {
    const token = user ? `Bearer ${user.token}` : undefined  
    return token
}

/**
 * Обновляет список постов
 * после успешного запроса в API
 */
const updatePosts = newPosts => {
    posts = newPosts
}

export const logout = () => {
    user = null
    removeUserFromLocalStorage()
    goToPage(POSTS_PAGE)
}

/**
 * Включает страницу приложения
 */
export const goToPage = (newPage, data) => {
    if (
        [
            POSTS_PAGE,
            AUTH_PAGE,
            ADD_POSTS_PAGE,
            USER_POSTS_PAGE,
            LOADING_PAGE,
        ].includes(newPage) // includes(newPage, data) ищет item начиная с индекса data и возвращает true, если поиск успешен.
    ) {
        if (newPage === ADD_POSTS_PAGE) {
            // используется тернарный оператор. Если переменная user существует (то есть пользователь авторизован), то переменной page присваивается значение ADD_POSTS_PAGE. 
            //В противном случае (если пользователь не авторизован), переменной page присваивается значение AUTH_PAGE.
            page = user ? ADD_POSTS_PAGE : AUTH_PAGE
            return renderApp()
        }

        if (newPage === POSTS_PAGE) {
            page = LOADING_PAGE
            renderApp()

            return getPosts({ token: getToken() }) //  Здесь вызывается функция getPosts() с передачей токена для авторизации.
                .then(newPosts => {
                    page = POSTS_PAGE
                    posts = newPosts
                    renderApp()
                })
                .catch(error => {
                    console.error(error)
                    goToPage(POSTS_PAGE)
                })
        }

        if (newPage === USER_POSTS_PAGE) {
            page = LOADING_PAGE
            renderApp()

            return getUserPosts({ //  getUserPosts({ token, userId }) {return fetch(`${postsHost}/user-posts/${userId}`, {  method: 'GET',   headers: {  Authorization: token, }, })
                token: getToken(),   // token и userId входят как параметры в функцию getUserPosts
                userId: data.userId,
            })
                .then(newPosts => { // Если запрос на получение постов успешно выполнен, то выполняется следующий блок кода.
                    page = USER_POSTS_PAGE // Переменной page присваивается значение POSTS_PAGE, что, ниже  page = newPage.
                    posts = newPosts
                    renderApp()
                })
                .catch(error => {
                    console.error(error)
                    goToPage(POSTS_PAGE)
                })
        }

        page = newPage
        renderApp()

        return
    }

    throw new Error('страницы не существует')
}

const renderApp = () => {
    const appEl = document.getElementById('app')
    if (page === LOADING_PAGE) {
        return renderLoadingPageComponent({
            appEl,
            user,
            goToPage,
        })
    }

    if (page === AUTH_PAGE) {
        return renderAuthPageComponent({
            appEl,
            setUser: newUser => {
                user = newUser
                saveUserToLocalStorage(user)
                goToPage(POSTS_PAGE)
            },
            user,
            goToPage,
        })
    }

    if (page === ADD_POSTS_PAGE) {
        return renderAddPostPageComponent({
            appEl,
            onAddPostClick({ description, imageUrl }) {
                addPost({ token: getToken(), description, imageUrl })
                    .then(newPosts => {
                        updatePosts(newPosts)
                        renderApp()
                    })
                    .then(() => goToPage(POSTS_PAGE))
            },
        })
    }

    if (page === POSTS_PAGE) {
        return renderPostsPageComponent({
            appEl,
            posts,

            deletePostClick({ postId }) {
                deletePost({
                    token: getToken(),
                    postId,
                })
                    .then(getPosts)
                    .then(newPosts => {
                        updatePosts(newPosts)
                        renderApp()
                    })
            },

            likePostClick({ postId, isLiked }) {
                getLikePost({ token: getToken(), postId, isLiked })
                    ?.then(() => getPosts({ token: getToken() }))
                    .then(newPosts => {
                        updatePosts(newPosts)
                        renderApp()
                    })
            },
        })
    }

    if (page === USER_POSTS_PAGE) {
        return renderUserPostsPageComponent({
            appEl,
            posts,

            deletePostClick({ postId, userId }) {
                deletePost({
                    token: getToken(),
                    postId,
                })
                    .then(() =>
                        getUserPosts({
                            token: getToken(),
                            userId: userId,
                        }),
                    )
                    .then(newPosts => {
                        updatePosts(newPosts)
                        renderApp()
                    })
            },

            likePostClick({ postId, isLiked, userId }) {
                getLikePost({ token: getToken(), postId, isLiked })
                    ?.then(() =>
                        getUserPosts({
                            token: getToken(),
                            userId: userId,
                        }),
                    )
                    .then(newPosts => {
                        updatePosts(newPosts)
                        renderApp()
                    })
            },
        })
    }
}

goToPage(POSTS_PAGE)
