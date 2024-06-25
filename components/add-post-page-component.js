import { renderHeaderComponent } from './header-component'
import { renderUploadImageComponent } from './upload-image-component'
import sanitizeHtml from 'sanitize-html'

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
    let imageUrl = ''

    const render = () => {
        const appHtml = `
        <div class="page-container">
        <div class="header-container"></div>
        <div class="form">
            <h3 class="form-title">Добавить пост</h3>
            <div class="form-inputs">
                <div class="upload-image-container">
                    <div class="upload=image">
                        <div class="file-upload-image-container">
                            <img class="file-upload-image" />
                            <button class="file-upload-remove-button button">
                                Заменить фото
                            </button>
                        </div>
                    </div>
                </div>
                <label>
                    Опишите фотографию:
                    <textarea
                        class="input textarea"
                        id="desc-photo"
                        rows="4"
                    ></textarea>
                </label>
                <button class="button" id="add-button">Добавить</button>
            </div>
        </div>
        </div>`

        appEl.innerHTML = appHtml

        renderHeaderComponent({
            element: document.querySelector('.header-container'),
        })

        const uploadImageContainer = appEl.querySelector(
            '.upload-image-container',
        )

        if (uploadImageContainer) {
            renderUploadImageComponent({
                element: appEl.querySelector('.upload-image-container'),
                onImageUrlChange(newImageUrl) {
                    imageUrl = newImageUrl
                },
            })
        }

        document.getElementById('add-button').addEventListener('click', () => {
            const addPostDesc = document
                .getElementById('desc-photo')
                .value.trim()

            try {
                if (!imageUrl) {
                    throw new Error('Добавьте фото')
                }
                if (!addPostDesc) {
                    throw new Error('Напишите комментарий к посту')
                }

                 onAddPostClick({
                    description: sanitizeHtml(addPostDesc, { allowedTags: [] }),
                    imageUrl: imageUrl,
                });
            } catch (error) {
                // alert(error.message);
                console.log(error);
            }


        })

    }

    render()
}
