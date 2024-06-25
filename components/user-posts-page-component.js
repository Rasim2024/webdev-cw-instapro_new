import { renderHeaderComponent } from "./header-component.js"
import { formatDistanceToNow } from "date-fns"
import { ru } from 'date-fns/locale'
import { user } from "../index.js"

export function renderUserPostsPageComponent({
    appEl,
    posts,
    deletePostClick,
    likePostClick,
}) {
    const render = () => {
        const appHtml = `
    <div class="page-container">
    <div class="header-container"></div>
    <ul class="user-posts">
        ${posts
            .map(post => {
                const toggleLikeActiveImg = post.isLiked
                    ? `like-active.svg`
                    : `like-not-active.svg`

                const togglePostLikeText = !post.likes.length
                    ? `<strong>${post.likes.length}</strong>`
                    : `<strong>${post.likes[0].name}</strong>`

                const andMorePostLikeText = `<strong>${post.likes[0]?.name}</strong> и <strong>еще ${post.likes.length - 1}</strong>`

                const postCreateFormatDate = formatDistanceToNow(
                    new Date(post.createdAt),
                    { addSuffix: true, locale: ru },
                )

                return `
        <div class="posts-user-header" data-user-id="${post.user.id}">
            <img
                src="${post.user.imageUrl}"
                class="posts-user-header__user-image"
            />
            <div>
            <p class="posts-user-header__user-name">${post.user.name}</p>
            <p class="posts-user-header__user-posts-length">Посты: <strong>${posts.length}</strong></p>
            </div>
        </div>
        <li class="post">
            <div class="post-image-container">
                <img class="post-image" src="${post.imageUrl}" />
            </div>
            <div class="post-likes">
            <button class="${user?._id === post.user.id ? `delete-button` : `-hide-del-btn`}" data-post-id="${post.id}" data-user-id="${post.user.id}"></button>
            <button class="like-button" data-is-liked="${post.isLiked}" data-post-id="${post.id}" data-user-id="${post.user.id}">
                <img src="./assets/images/${toggleLikeActiveImg}" />
            </button>
                <p class="post-likes-text">
                Нравится: ${post.likes.length > 1 ? andMorePostLikeText : togglePostLikeText}
                </p>
            </div>
            <p class="post-text">
                <span class="user-name">${post.user.name}</span>
                ${post.description}
            </p>
            <p class="post-date">${postCreateFormatDate}</p>
        </li>`
            })
            .join('')}
    </ul>
    </div>`

        appEl.innerHTML = appHtml

        renderHeaderComponent({
            element: document.querySelector('.header-container'),
        })

        //Удалить пост
        document.querySelectorAll('.delete-button').forEach(deleteButton => {
            deleteButton.addEventListener('click', () => {
                deletePostClick({
                    postId: deleteButton.dataset.postId,
                    userId: deleteButton.dataset.userId,
                })
            })
        })

        //Поставить лайк
        document.querySelectorAll('.like-button').forEach(likeButton => {
            likeButton.addEventListener('click', () => {
                likePostClick({
                    postId: likeButton.dataset.postId,
                    isLiked: likeButton.dataset.isLiked,
                    userId: likeButton.dataset.userId,
                })
            })
        })
    }

    render()
}
