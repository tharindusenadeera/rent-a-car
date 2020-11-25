import React from 'react'
import ChatLog from './ChatLog'
import ChatComposer from './ChatComposer'

const ChatBox = props => {
    const { booking, selectedMessages, user } = props
    return (
    <div>
        <ChatLog selectedMessages={selectedMessages} />
        <ChatComposer user={user} booking={booking} />
    </div>
    )
}


export default ChatBox