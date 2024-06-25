import { renderHeaderComponent } from './header-component.js'

// const appEl = document.getElementById('app') из  renderApp
export function renderLoadingPageComponent({ appEl, user, goToPage }) {
    const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <div class="loading-page">
                  <div class="loader"><div></div><div></div><div></div></div>
                </div>
              </div>`

    appEl.innerHTML = appHtml

    renderHeaderComponent({
        user,
        element: document.querySelector('.header-container'),
        goToPage,
    })
}
