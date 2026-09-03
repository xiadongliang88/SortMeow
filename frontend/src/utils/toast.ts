interface MessageAPI {
    success: (text: string) => void
    error: (text: string) => void
}

export const message: MessageAPI = {
    success: (text: string) => {
        const div = document.createElement('div')
        div.className = 'message'

        const subDiv = document.createElement('div')
        subDiv.className = 'success'

        const subSpan = document.createElement('span')
        subSpan.innerHTML = `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="9" fill="#22c55e"/><path d="M6 10L9 13L14 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`

        const subP = document.createElement('p')
        subP.innerText = text

        subDiv.appendChild(subSpan)
        subDiv.appendChild(subP)

        div.appendChild(subDiv)
        document.body.appendChild(div)

        setTimeout(() => div.remove(), 3000)
    },
    error: (text: string) => {
        const div = document.createElement('div')
        div.className = 'message'

        const subDiv = document.createElement('div')
        subDiv.className = 'error'

        const subSpan = document.createElement('span')
        subSpan.innerHTML = `<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="9" fill="#ef4444"/><path d="M7 7L13 13M13 7L7 13" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>`

        const subP = document.createElement('p')
        subP.innerText = text

        subDiv.appendChild(subSpan)
        subDiv.appendChild(subP)

        div.appendChild(subDiv)
        document.body.appendChild(div)

        setTimeout(() => div.remove(), 3000)
    }
}
