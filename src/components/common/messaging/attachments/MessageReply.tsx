import { Text } from "preact-i18n";
import UserShort from "../../user/UserShort";
import styled, { css } from "styled-components";
import Markdown from "../../../markdown/Markdown";
import { Reply, File } from "@styled-icons/boxicons-regular";
import { useUser } from "../../../../context/revoltjs/hooks";
import { useRenderState } from "../../../../lib/renderer/Singleton";

interface Props {
    channel: string
    index: number
    id: string
}

export const ReplyBase = styled.div<{ head?: boolean, fail?: boolean, preview?: boolean }>`
    gap: 4px;
    display: flex;
    font-size: 0.8em;
    margin-left: 30px;
    user-select: none;
    margin-bottom: 4px;
    align-items: center;
    color: var(--secondary-foreground);

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    svg {
        flex-shrink: 0;
        color: var(--tertiary-foreground);
    }

    ${ props => props.fail && css`
        color: var(--tertiary-foreground);
    ` }

    ${ props => props.head && css`
        margin-top: 12px;
    ` }

    ${ props => props.preview && css`
        margin-left: 0;
    ` }
`;

export function MessageReply({ index, channel, id }: Props) {
    const view = useRenderState(channel);
    if (view?.type !== 'RENDER') return null;

    const message = view.messages.find(x => x._id === id);
    if (!message) {
        return (
            <ReplyBase head={index === 0} fail>
                <Reply size={16} />
                <span><Text id="app.main.channel.misc.failed_load" /></span>
            </ReplyBase>
        )
    }

    const user = useUser(message.author);

    return (
        <ReplyBase head={index === 0}>
            <Reply size={16} />
            <UserShort user={user} size={16} />
            { message.attachments && message.attachments.length > 0 && <File size={16} /> }
            <Markdown disallowBigEmoji content={(message.content as string).replace(/\n/g, ' ')} />
        </ReplyBase>
    )
}