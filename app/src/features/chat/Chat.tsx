"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

type FormData = {
    message: string;
};

export default function Chat() {
    const [messages, setMessages] = useState<string[]>([]);
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
        formState: { errors, isSubmitting },
    } = useForm<FormData>();

    const onSend = handleSubmit((data) => {
        if (socket.readyState !== socket.OPEN) {
            console.log("Socket is not open");
            return
        }

        socket.send(data.message);
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
            <form>
                <div className="flex items-center">
                    <button
                        type="button"
                        onClick={onSend}
                        disabled={isSubmitting}
                    >
                        Send
                    </button>
                    <input
                        disabled={isSubmitting}
                        {...register("message", { required: true })}
                        type="text"
                        className="ml-2 w-full bg-slate-700"
                        autoFocus
                    />
                </div>

            </form>
        </div>
    );
}