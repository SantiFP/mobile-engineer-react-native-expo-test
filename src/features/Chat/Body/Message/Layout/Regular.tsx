import React from "react";
import { Text } from "../../../../../components/Text/Text";
import { getChatEventPropertyById } from "../../../../../redux/chat/chat.selector";
import { useAppSelector } from "../../../../../redux/hooks";
import { getMessageTextColor } from "../../../../../utils/getMessageTextColor";
import { useMessageContext } from "../Provider";

function Regular() {
  const ctx = useMessageContext();

  const text = useAppSelector(getChatEventPropertyById(ctx.id, "text"));

  const isAutoResponse = useAppSelector(
    getChatEventPropertyById(ctx.id, "isAutoResponse")
  );

  const isReceived = !!isAutoResponse;

  const color = getMessageTextColor(isReceived);

  return (
    <Text type="default" lightColor={color}>
      {text}
    </Text>
  );
}

export default React.memo(Regular);

