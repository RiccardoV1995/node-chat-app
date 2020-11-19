const socket = io()

const $messageForm = document.querySelector('#messageForm')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#position-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyle = getComputedStyle($newMessage) // usiamo lo stile globale messo a disposizione dal browser
    const newMessageMargin = parseInt(newMessageStyle.marginBottom) // prende una stringa e passa un numero
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have i scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight// scrollTop= quantità di distanza che siamo scesi rispetto al top

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('HH:mm')
    })
    //inserisce i nodi risultanti nell'albero DOM in una posizione specificata
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('locationMessage', (url) => {
    console.log(url)

    const html = Mustache.render(locationTemplate, {
        username: url.username,
        url: url.url,
        createdAtLocation: moment(url.createdAtLocation).format('HH:mm')
    })

    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({room, users}) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // disabilitazione pulsante una volta inviato il messaggio
    $messageFormButton.setAttribute('disabled', 'disabled')
    
    //const message = document.querySelector('input').value
    const message = e.target.elements.message.value
    
    socket.emit('sendMessage', message, (error) => {
        //riattivazione pulsante
        $messageFormButton.removeAttribute('disabled')

        //svuotare campo di testo
        $messageFormInput.value = ''
        //per portare il cursore all'interno del campo di testo
        $messageFormInput.focus()

        if (error) {
            return console.log(error)
        }

        console.log('Message delivered!')
    })
})

$sendLocationButton.addEventListener('click', () => {
    // per "navigator.geolocation" non c'è bisogno di installare nessun pacchetto
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    $sendLocationButton.setAttribute('disable', 'disable')

    navigator.geolocation.getCurrentPosition((position) => {
        
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            console.log('Location shared!')
        })
    })

    $sendLocationButton.removeAttribute('disable')
})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})

// // questa funzione invia i dati solo all'evento (ovvero la pagina html)
// socket.on('countUpdate', (count) => { // il volore tra le ' ' deve essere uguale a quello inserito nella funzione socket.emit
//     console.log('The count has been updated!', count)
// })

// document.querySelector('#increment').addEventListener('click', () => {
//     console.log('Clicked')
//     socket.emit('increment')
// })