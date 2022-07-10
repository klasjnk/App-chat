(function () {
    let chatBox = document.querySelector("#chat-box")

    if (chatBox) {
        chatBox.scrollTop = chatBox.scrollHeight
    }

    const chatForm = $("#chat-form")
    const chatMsg = $('#message')
    let ws
    init()

    function show_receiveMessage(messages) {
        let src = $("#guest-img").attr('src')
        $('#chat-box').append(
            `<div class="chat guest">
                <div class="avatar">
                    <img src="${src}" alt="">
                </div>
                <div class="details">
                    ${messages.message}
                    <div class="time">
                        ${messages.createdAt}                                
                    </div>
                </div>
        </div>`)
        if (chatBox) {
            chatBox.scrollTop = chatBox.scrollHeight
        }
    }

    function show_sendMessage(message, createdAt) {
        $('#chat-box').append(
            `<div class="chat host">
            <div class="details">
                ${message}
                <div class="time">
                    ${createdAt}                                
                </div>
            </div>
        </div>`)
        if (chatBox) {
            chatBox.scrollTop = chatBox.scrollHeight
        }
    }

    function init() {
        if (ws) {
            ws.onerror = ws.onopen = ws.onclose = null
            ws.close()
        }

        // const server_url = `wss://chat-app.up.railway.app`
        const server_url = `ws://localhost:3000`
        ws = new WebSocket(server_url)
        ws.onopen = () => {
            // console.log('Connecting to server')
        }

        ws.onmessage = (json) => {
            let messages = JSON.parse(json.data)
            show_receiveMessage(messages)
        }

        ws.onclose = function () {
            ws = null
        }

        chatForm.submit(e => {
            e.preventDefault()
            if (!ws) {
                return
            }

            let date = new Date()
            let hours = date.getHours()
            let minutes = (date.getMinutes() <= 9) ? "0" + date.getMinutes() : date.getMinutes()
            let dates = (date.getDate() <= 9) ? "0" + date.getDate() : date.getDate()
            let months = (date.getMonth() <= 9) ? "0" + date.getMonth() + 1 : date.getMonth() + 1
            let years = date.getFullYear()

            let createdAt = hours + ":" + minutes + " " + dates + "-" + months + ", " + years

            let jsonMessage = {
                host_email: $("#host_email").val(),
                guest_email: $("#guest_email").val(),
                guest_id: window.location.search.split("?id=")[1],
                message: chatMsg.val(),
                createdAt: createdAt
            }

            ws.send(JSON.stringify(jsonMessage))
            show_sendMessage(chatMsg.val(), createdAt)
            chatMsg.val("")
            chatMsg.focus()
        })
    }
})()