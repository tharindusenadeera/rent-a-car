import React from 'react'
import ChatMessage from './ChatMessage'

const ChatLog = ({selectedMessages}) => {
    return (
        <div className="chat-log">
            {
                selectedMessages.map(message => {
                    return <ChatMessage key={message.id} message={message} />
                })
            }
        </div>
    )
}

export default ChatLog