import { USER_POSTS_PAGE } from '../routes.js'
import { renderHeaderComponent } from './header-component.js'
import { goToPage, user } from '../index.js'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'

export function renderPostsPageComponent({
    appEl,
    posts,
    deletePostClick,
    likePostClick,
}) {
    render = () => {
        const appHtml = `
    <div class="page-container">
    <div class="header-container"></div>
    <ul class="posts">
        ${posts
            .map(post => {
                const toggleLikeActiveImg = post.isLiked
                    ? `like-active.svg`
                    : `like-not-active.svg`

                const togglePostLikeText = !post.likes.length // Это условие проверяет, равна ли длина массива post.likes нулю. Оператор ! перед значением преобразует число в логическое значение: если длина массива равна нулю, то это условие будет истинным.
                    ? `<strong>${post.likes.length}</strong>` // Если условие истинно (длина массива post.likes равна нулю), то будет возвращен текст в теге <strong> с количеством лайков из массива.
                    : `<strong>${post.likes[0].name}</strong>` //Если условие ложно (длина массива post.likes не равна нулю), то будет возвращено имя первого пользователя, поставившего лайк, в теге <strong>.

// получение имени первого пользователя, поставившего лайк к посту. 
//  ?. является оператором опциональной цепочки  если значение post.likes[0] равно null или undefined. Имя пользователя помещается в тег <strong>, делая его жирным.
                const andMorePostLikeText = `<strong>${post.likes[0]?.name}</strong> и <strong>еще ${post.likes.length - 1}</strong>`

                const postCreateFormatDate = formatDistanceToNow(
                    new Date(post.createdAt),
                    { addSuffix: true, locale: ru },
                )

                return `
        <li class="post">
            <div class="post-header" data-user-id="${post.user.id}">
                <img
                    src="${post.user.imageUrl}"
                    class="post-header__user-image"
                />
                <p class="post-header__user-name">${post.user.name}</p>
            </div>
            <div class="post-image-container">
                <img class="post-image" src="${post.imageUrl}" />
            </div>
            <div class="post-likes">
                <button class="${user?._id === post.user.id ? `delete-button` : `-hide-del-btn`}" data-post-id="${post.id}"></button>
                <button class="like-button" data-is-liked="${post.isLiked}" data-post-id="${post.id}">
                    <img src="./assets/images/${toggleLikeActiveImg}" />
                </button>
                <p class="post-likes-text">
                Нравится: ${post.likes.length > 1 ? andMorePostLikeText : togglePostLikeText}
                </p>
            </div>
            <p class="post-text">
                <span class="user-name">${post.user.name}</span> ${post.description}
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

        for (let userEl of document.querySelectorAll('.post-header')) {
            userEl.addEventListener('click', () => {
                goToPage(USER_POSTS_PAGE, {
                    userId: userEl.dataset.userId,
                })
            })
        }

        //Удалить пост
        document.querySelectorAll('.delete-button').forEach(deleteButton => {
            deleteButton.addEventListener('click', () => {
                deletePostClick({ postId: deleteButton.dataset.postId })
            })
        })

        //Поставить лайк
        document.querySelectorAll('.like-button').forEach(likeButton => {
            likeButton.addEventListener('click', () => {
                likePostClick({
                    postId: likeButton.dataset.postId,
                    isLiked: likeButton.dataset.isLiked,
                })
            })
        })
    }

    
}
