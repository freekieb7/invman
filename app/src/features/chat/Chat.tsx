"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

type FormData = {
    message: string;
};

export default function Chat() {
    const isBrowser = typeof window !== "undefined";
    const [messages, setMessages] = useState<string[]>([]);

    if (!isBrowser) return <div>Chat not supported for browser</div>

    const socket = useMemo(() => new WebSocket('ws://localhost:8081/ws'), []);

    socket.onmessage = function (messageCluster) {
        var newMessages = messageCluster.data.split('\n');
        console.log(newMessages);
        setMessages(currentMessages => currentMessages.concat(newMessages));
    }

    socket.onclose = function (event) {
        console.log("Connection closed");
    }

    const {
        register,
        handleSubmit,
        resetField,
        formState: { errors, isSubmitting }, // TODO implementing error
    } = useForm<FormData>();

    const onSend = handleSubmit((data) => {
        if (socket.readyState !== socket.OPEN) {
            console.log("Socket is not open");
            return
        }

        socket.send(data.message);

        resetField("message");
    });

    return (
        <div className="App bg-slate-800">
            <div className="h-[20rem]">
                {messages.map((value, index) => {
                    return (
                        <p key={index}>{value}</p>
                    )
                })}
            </div>
            <div className="flex items-center">
                <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={onSend}
                >
                    Send
                </button>
                <input
                    disabled={isSubmitting}
                    {...register("message", { required: true })}
                    type="text"
                    className="ml-2 w-full bg-slate-700"
                    onKeyUp={(event) => {
                        if (event.key === 'Enter') {
                            onSend();
                        }
                    }}
                    autoComplete="off"
                    autoFocus
                />
            </div>
        </div>
    );
}